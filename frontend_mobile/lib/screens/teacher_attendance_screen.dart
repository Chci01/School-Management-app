import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class TeacherAttendanceScreen extends StatefulWidget {
  const TeacherAttendanceScreen({super.key});

  @override
  _TeacherAttendanceScreenState createState() => _TeacherAttendanceScreenState();
}

class _TeacherAttendanceScreenState extends State<TeacherAttendanceScreen> {
  bool _isLoading = true;
  List<dynamic> _classes = [];
  String? _selectedClassId;
  String? _activeYearId;
  List<dynamic> _students = [];
  Map<String, String> _attendanceMap = {}; // studentId -> status

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    final activeYear = await ApiService().getActiveAcademicYear();
    if (!mounted) return;
    setState(() {
      _activeYearId = activeYear?['id'];
    });
    await _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final schedules = await ApiService().getSchedules(teacherId: user?['id']);
      
      final Set<String> classIds = {};
      final List<dynamic> uniqueClasses = [];

      for (var schedule in schedules) {
        if (!classIds.contains(schedule['class']['id'])) {
          classIds.add(schedule['class']['id']);
          uniqueClasses.add(schedule['class']);
          // Also snatch the academicYearId from the first record found to be easy, or we can fetch active year.
          // For simplicity, we assume academicYearId is available or we bypass it if the API allows.
        }
      }

      if (!mounted) return;
      setState(() {
        _classes = uniqueClasses;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchStudents(String classId) async {
    setState(() => _isLoading = true);
    // Ideally, get current academic year. We will hardcode a fallback for now or need an API
    // The API we built `GET /academic-records/class/:classId/year/:yearId` needs the year.
    // Let's assume there's a way from `user` or we just fetch it. 
    try {
      // In a real scenario, this gets the current year.
      final students = await ApiService().getStudentsByClass(classId, _activeYearId ?? 'CURRENT_YEAR_ID_PLACEHOLDER');
      if (!mounted) return;
      setState(() {
        _students = students.map((r) => r['student']).toList();
        _attendanceMap = { for (var s in _students) s['id']: 'PRESENT' };
        _isLoading = false;
      });
    } catch(e) {
       if (!mounted) return;
       setState(() => _isLoading = false);
       ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: impossible de charger les élèves. Pensez à l\'AcademicYearID.')));
    }
  }

  Future<void> _submitAttendance() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (_selectedClassId == null || _students.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      final records = _attendanceMap.entries.map((e) => {
        'studentId': e.key,
        'status': e.value,
        'reason': ''
      }).toList();

      await ApiService().submitAttendance({
        'schoolId': user?['schoolId'],
        'classId': _selectedClassId,
        'date': DateTime.now().toIso8601String(),
        'records': records
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Appel enregistré!'), backgroundColor: Colors.green));
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red));
    } finally {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(AppTranslations.translate('teacher_absences', lang)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : Column(
              children: [
                Padding(
                  padding: EdgeInsets.all(16),
                  child: DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Color(0xFF1E293B),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    ),
                    dropdownColor: Color(0xFF1E293B),
                    style: TextStyle(color: Colors.white),
                    hint: Text('Sélectionnez une classe', style: TextStyle(color: Colors.grey)),
                    initialValue: _selectedClassId,
                    items: _classes.map((c) => DropdownMenuItem<String>(value: c['id'], child: Text(c['name']))).toList(),
                    onChanged: (val) {
                      setState(() => _selectedClassId = val);
                      if (val != null) _fetchStudents(val);
                    },
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: _students.length,
                    itemBuilder: (context, index) {
                      final student = _students[index];
                      final status = _attendanceMap[student['id']] ?? 'PRESENT';

                      return ListTile(
                        title: Text('${student['firstName']} ${student['lastName']}', style: TextStyle(color: Colors.white)),
                        subtitle: Text(student['matricule'], style: TextStyle(color: Colors.grey)),
                        trailing: DropdownButton<String>(
                          value: status,
                          dropdownColor: Color(0xFF1E293B),
                          style: TextStyle(color: settings.themeColor, fontWeight: FontWeight.bold),
                          items: [
                            DropdownMenuItem(value: 'PRESENT', child: Text('PRÉSENT(E)')),
                            DropdownMenuItem(value: 'ABSENT', child: Text('ABSENT(E)')),
                            DropdownMenuItem(value: 'LATE', child: Text('EN RETARD')),
                          ],
                          onChanged: (val) {
                            if (val != null) setState(() => _attendanceMap[student['id']] = val);
                          },
                        ),
                      );
                    },
                  ),
                ),
                if (_students.isNotEmpty)
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: settings.themeColor,
                        minimumSize: Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _submitAttendance,
                      child: Text('Valider l\'Appel', style: TextStyle(fontSize: 18, color: Colors.white)),
                    ),
                  )
              ],
            ),
    );
  }
}
