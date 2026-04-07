import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class TeacherClassesScreen extends StatefulWidget {
  const TeacherClassesScreen({super.key});

  @override
  _TeacherClassesScreenState createState() => _TeacherClassesScreenState();
}

class _TeacherClassesScreenState extends State<TeacherClassesScreen> {
  bool _isLoading = true;
  List<dynamic> _classes = [];

  @override
  void initState() {
    super.initState();
    _fetchClasses();
  }

  Future<void> _fetchClasses() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final schedules = await ApiService().getSchedules(teacherId: user?['id']);
      
      // Extract unique classes
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
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(AppTranslations.translate('teacher_classes', lang)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : _classes.isEmpty
              ? Center(child: Text('Aucune classe assignée', style: TextStyle(color: Colors.white)))
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: _classes.length,
                  itemBuilder: (context, index) {
                    final cls = _classes[index];
                    return Card(
                      color: Color(0xFF1E293B),
                      margin: EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: settings.themeColor.withOpacity(0.2),
                          child: Icon(Icons.class_, color: settings.themeColor),
                        ),
                        title: Text(cls['name'], style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        subtitle: Text('Niveau: ${cls['level']}', style: TextStyle(color: Colors.grey[400])),
                        trailing: Icon(Icons.chevron_right, color: Colors.white),
                        onTap: () {
                          // TODO: Navigate to Class students list
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
