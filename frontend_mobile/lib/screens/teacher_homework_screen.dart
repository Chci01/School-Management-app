import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class TeacherHomeworkScreen extends StatefulWidget {
  const TeacherHomeworkScreen({super.key});

  @override
  _TeacherHomeworkScreenState createState() => _TeacherHomeworkScreenState();
}

class _TeacherHomeworkScreenState extends State<TeacherHomeworkScreen> {
  bool _isLoading = true;
  List<dynamic> _classes = [];
  List<dynamic> _subjects = [];
  
  String? _selectedClassId;
  String? _selectedSubjectId;
  
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  DateTime? _selectedDate;

  @override
  void initState() {
    super.initState();
    _fetchClasses();
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

      if (!mounted) return;
      setState(() {
        _classes = uniqueClasses;
        _subjects = uniqueSubjects;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  Future<void> _submitHomework() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (_selectedClassId == null || _selectedSubjectId == null || _selectedDate == null || _titleController.text.isEmpty) return;
    
    setState(() => _isLoading = true);
    try {
      await ApiService().submitHomework({
        'schoolId': user?['schoolId'],
        'teacherId': user?['id'],
        'classId': _selectedClassId,
        'subjectId': _selectedSubjectId,
        'title': _titleController.text,
        'description': _descController.text,
        'dueDate': _selectedDate!.toIso8601String(),
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Devoir ajouté avec succès!'), backgroundColor: Colors.green));
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red));
    } finally {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 365)),
    );
    if (date != null) {
      setState(() => _selectedDate = date);
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(AppTranslations.translate('teacher_homework', lang)),
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
                  _buildDropdown('Classe', _classes, _selectedClassId, (val) => setState(() => _selectedClassId = val)),
                  SizedBox(height: 16),
                  
                  _buildDropdown('Matière', _subjects, _selectedSubjectId, (val) => setState(() => _selectedSubjectId = val)),
                  SizedBox(height: 16),
                  
                  TextField(
                    controller: _titleController,
                    style: TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Titre du Devoir'),
                  ),
                  SizedBox(height: 16),
                  
                  TextField(
                    controller: _descController,
                    maxLines: 4,
                    style: TextStyle(color: Colors.white),
                    decoration: _inputDecoration('Description (Consignes, liens, etc.)'),
                  ),
                  SizedBox(height: 16),

                  InkWell(
                    onTap: _pickDate,
                    child: Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            _selectedDate == null ? 'Date limite' : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                            style: TextStyle(color: _selectedDate == null ? Colors.grey : Colors.white),
                          ),
                          Icon(Icons.calendar_today, color: Colors.grey),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 32),
                  
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: settings.themeColor,
                      minimumSize: Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _submitHomework,
                    child: Text('Publier le Devoir', style: TextStyle(fontSize: 18, color: Colors.white)),
                  )
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
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
    );
  }

  Widget _buildDropdown(String hint, List<dynamic> items, String? value, Function(String?) onChanged) {
    return DropdownButtonFormField<String>(
      decoration: _inputDecoration(hint),
      dropdownColor: Color(0xFF1E293B),
      style: TextStyle(color: Colors.white),
      initialValue: value,
      items: items.map((item) {
        return DropdownMenuItem<String>(
          value: item['id'],
          child: Text(item['name']),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }
}
