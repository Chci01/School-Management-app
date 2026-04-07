import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class TeacherGradingScreen extends StatefulWidget {
  const TeacherGradingScreen({super.key});

  @override
  _TeacherGradingScreenState createState() => _TeacherGradingScreenState();
}

class _TeacherGradingScreenState extends State<TeacherGradingScreen> {
  bool _isLoading = true;
  List<dynamic> _classes = [];
  List<dynamic> _students = [];
  List<dynamic> _subjects = [];

  String? _selectedClassId;
  String? _selectedStudentId;
  String? _selectedSubjectId;
  String? _activeYearId;

  final TextEditingController _gradeController = TextEditingController();
  final TextEditingController _termController = TextEditingController(
    text: '1',
  );

  String _evaluationType = 'DEVOIR'; // DEVOIR, COMPOSITION, INTERROGATION

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    final activeYear = await ApiService().getActiveAcademicYear();
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
      final Set<String> subjectIds = {};
      final List<dynamic> uniqueClasses = [];
      final List<dynamic> uniqueSubjects = [];

      for (var schedule in schedules) {
        if (!classIds.contains(schedule['class']['id'])) {
          classIds.add(schedule['class']['id']);
          uniqueClasses.add(schedule['class']);
        }
        if (!subjectIds.contains(schedule['subject']['id'])) {
          subjectIds.add(schedule['subject']['id']);
          uniqueSubjects.add(schedule['subject']);
        }
      }

      setState(() {
        _classes = uniqueClasses;
        _subjects = uniqueSubjects;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _fetchStudents(String classId) async {
    setState(() => _isLoading = true);
    try {
      final students = await ApiService().getStudentsByClass(
        classId,
        _activeYearId ?? 'CURRENT_YEAR_ID_PLACEHOLDER',
      );
      setState(() {
        _students = students.map((r) => r['student']).toList();
        _selectedStudentId = null;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _submitGrade() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (_selectedClassId == null ||
        _selectedStudentId == null ||
        _selectedSubjectId == null ||
        _gradeController.text.isEmpty) {
      return;
    }

    setState(() => _isLoading = true);
    try {
      // Find academic year from somewhere, using a placeholder for now since mobile has no concept of it directly unless requested
      await ApiService().submitGrade({
        'studentId': _selectedStudentId,
        'subjectId': _selectedSubjectId,
        'classId': _selectedClassId,
        'academicYearId': _activeYearId,
        'term': int.parse(_termController.text),
        'type': _evaluationType,
        'value': double.parse(_gradeController.text),
        'evaluationType': _evaluationType,
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Note ajoutée avec succès!'),
          backgroundColor: Colors.green,
        ),
      );
      _gradeController.clear();
      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red),
      );
    } finally {
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
        title: Text(AppTranslations.translate('teacher_grading', lang)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : SingleChildScrollView(
              padding: EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildDropdown('Classe', _classes, _selectedClassId, (val) {
                    setState(() => _selectedClassId = val);
                    if (val != null) _fetchStudents(val);
                  }),
                  SizedBox(height: 16),

                  _buildDropdown('Élève', _students, _selectedStudentId, (val) {
                    setState(() => _selectedStudentId = val);
                  }, isStudent: true),
                  SizedBox(height: 16),

                  _buildDropdown('Matière', _subjects, _selectedSubjectId, (
                    val,
                  ) {
                    setState(() => _selectedSubjectId = val);
                  }),
                  SizedBox(height: 16),

                  DropdownButtonFormField<String>(
                    decoration: _inputDecoration('Type d\'évaluation'),
                    dropdownColor: Color(0xFF1E293B),
                    style: TextStyle(color: Colors.white),
                    initialValue: _evaluationType,
                    items: ['DEVOIR', 'COMPOSITION', 'INTERROGATION']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (val) => setState(() => _evaluationType = val!),
                  ),
                  SizedBox(height: 16),

                  TextField(
                    controller: _termController,
                    keyboardType: TextInputType.number,
                    style: TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Trimestre (1er, 2e, 3e)'),
                  ),
                  SizedBox(height: 16),

                  TextField(
                    controller: _gradeController,
                    keyboardType: TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    style: TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Note (sur 20)'),
                  ),
                  SizedBox(height: 32),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: settings.themeColor,
                      minimumSize: Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: _submitGrade,
                    child: Text(
                      'Enregistrer la Note',
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  InputDecoration _inputDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: TextStyle(color: Colors.grey),
      filled: true,
      fillColor: Color(0xFF1E293B),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
    );
  }

  Widget _buildDropdown(
    String hint,
    List<dynamic> items,
    String? value,
    Function(String?) onChanged, {
    bool isStudent = false,
  }) {
    return DropdownButtonFormField<String>(
      decoration: _inputDecoration(hint),
      dropdownColor: Color(0xFF1E293B),
      style: TextStyle(color: Colors.white),
      initialValue: value,
      items: items.map((item) {
        String label = isStudent
            ? '${item['firstName']} ${item['lastName']}'
            : item['name'];
        return DropdownMenuItem<String>(value: item['id'], child: Text(label));
      }).toList(),
      onChanged: onChanged,
    );
  }
}
