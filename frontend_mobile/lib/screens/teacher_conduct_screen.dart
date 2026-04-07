import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class TeacherConductScreen extends StatefulWidget {
  const TeacherConductScreen({super.key});

  @override
  _TeacherConductScreenState createState() => _TeacherConductScreenState();
}

class _TeacherConductScreenState extends State<TeacherConductScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = false;
  List<dynamic> _classes = [];
  List<dynamic> _students = [];
  String? _selectedClassId;
  String? _selectedStudentId;
  String? _activeYearId;

  int _selectedMonth = DateTime.now().month;
  final int _selectedYear = DateTime.now().year;

  final TextEditingController _gradeController = TextEditingController();
  final TextEditingController _appreciationController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    final activeYear = await _apiService.getActiveAcademicYear();
    setState(() {
      _activeYearId = activeYear?['id'];
    });
    await _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final schedules = await _apiService.getSchedules(teacherId: user?['id']);
      
      final Set<String> classIds = {};
      final List<dynamic> uniqueClasses = [];

      for (var schedule in schedules) {
        if (!classIds.contains(schedule['class']['id'])) {
          classIds.add(schedule['class']['id']);
          uniqueClasses.add(schedule['class']);
        }
      }

      setState(() {
        _classes = uniqueClasses;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur chargement classes: $e')));
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _fetchStudents(String classId) async {
    setState(() => _isLoading = true);
    try {
      final students = await _apiService.getStudentsByClass(classId, _activeYearId ?? 'CURRENT_YEAR_ID_PLACEHOLDER');
      setState(() {
        _students = students.map((r) => r['student']).toList();
        _selectedStudentId = null;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _submitConduct() async {
    if (_selectedStudentId == null || _gradeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Veuillez remplir les champs requis')));
      return;
    }

    final grade = double.tryParse(_gradeController.text);
    if (grade == null || grade < 0 || grade > 20) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Note invalide (entre 0 et 20)')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      await _apiService.submitConduct(
        studentId: _selectedStudentId!,
        month: _selectedMonth,
        year: _selectedYear,
        grade: grade,
        appreciation: _appreciationController.text,
      );
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Note de conduite enregistrée avec succès')));
      _gradeController.clear();
      _appreciationController.clear();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Nouvelle Note de Conduite'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading && _classes.isEmpty
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  DropdownButtonFormField<String>(
                    dropdownColor: Color(0xFF1E293B),
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                       labelText: 'Sélectionner une classe',
                       labelStyle: TextStyle(color: Colors.grey),
                       filled: true,
                       fillColor: Colors.white.withOpacity(0.05),
                       border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    initialValue: _selectedClassId,
                    items: _classes.map((c) => DropdownMenuItem<String>(
                      value: c['id'],
                      child: Text(c['name']),
                    )).toList(),
                    onChanged: (val) {
                      setState(() => _selectedClassId = val);
                      if (val != null) _fetchStudents(val);
                    },
                  ),
                  SizedBox(height: 20),

                  if (_students.isNotEmpty)
                    DropdownButtonFormField<String>(
                      dropdownColor: Color(0xFF1E293B),
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                         labelText: 'Sélectionner un élève',
                         labelStyle: TextStyle(color: Colors.grey),
                         filled: true,
                         fillColor: Colors.white.withOpacity(0.05),
                         border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      initialValue: _selectedStudentId,
                      items: _students.map((s) => DropdownMenuItem<String>(
                        value: s['id'],
                        child: Text('${s['firstName']} ${s['lastName']}'),
                      )).toList(),
                      onChanged: (val) => setState(() => _selectedStudentId = val),
                    ),
                  SizedBox(height: 20),

                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<int>(
                          dropdownColor: Color(0xFF1E293B),
                          style: TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                             labelText: 'Mois',
                             filled: true,
                             fillColor: Colors.white.withOpacity(0.05),
                             border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          initialValue: _selectedMonth,
                          items: List.generate(12, (i) => i + 1).map((m) => DropdownMenuItem<int>(
                            value: m,
                            child: Text('Mois $m'),
                          )).toList(),
                          onChanged: (val) => setState(() => _selectedMonth = val!),
                        ),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: TextField(
                          style: TextStyle(color: Colors.white),
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            labelText: 'Note sur 20',
                            labelStyle: TextStyle(color: Colors.grey),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.05),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          controller: _gradeController,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 20),

                  TextField(
                    style: TextStyle(color: Colors.white),
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'Appréciation (Optionnel)',
                      labelStyle: TextStyle(color: Colors.grey),
                      filled: true,
                      fillColor: Colors.white.withOpacity(0.05),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    controller: _appreciationController,
                  ),
                  SizedBox(height: 32),

                  ElevatedButton(
                    onPressed: _isLoading ? null : _submitConduct,
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isLoading 
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text('Soumettre la note', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
    );
  }
}
