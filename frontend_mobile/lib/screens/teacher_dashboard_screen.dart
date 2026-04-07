import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';
import 'login_screen.dart';
import 'schedule_screen.dart';
import 'settings_screen.dart';
import 'teacher_classes_screen.dart';
import 'teacher_attendance_screen.dart';
import 'teacher_grading_screen.dart';
import 'teacher_homework_screen.dart';
import 'teacher_conduct_screen.dart';
import 'news_screen.dart';

class TeacherDashboardScreen extends StatelessWidget {
  const TeacherDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(AppTranslations.translate('login_subtitle_teacher', lang)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => SettingsScreen()),
              );
            },
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              await Provider.of<AuthProvider>(context, listen: false).logout();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => LoginScreen()),
              );
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Card
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [settings.themeColor, settings.themeColor.withOpacity(0.6)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: Colors.white24,
                      child: Icon(Icons.person, size: 40, color: Colors.white),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Bonjour cher Prof',
                            style: TextStyle(fontSize: 18, color: Colors.white70),
                          ),
                          Text(
                            '[${user?['matricule'] ?? ''}] ${user?['firstName'] ?? ''} ${user?['lastName'] ?? ''}',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
              SizedBox(height: 32),
              
              Text(AppTranslations.translate('teacher_tools', lang), style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Theme.of(context).textTheme.bodyMedium?.color)),
              SizedBox(height: 16),

              // Action Grid
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                children: [
                  _buildActionCard(context, Icons.calendar_today, AppTranslations.translate('dashboard_schedule', lang), settings.themeColor, ScheduleScreen()),
                  _buildActionCard(context, Icons.class_, AppTranslations.translate('teacher_classes', lang), Colors.cyan, TeacherClassesScreen()),
                  _buildActionCard(context, Icons.grading, AppTranslations.translate('teacher_grading', lang), Colors.green, TeacherGradingScreen()),
                  _buildActionCard(context, Icons.co_present, AppTranslations.translate('teacher_absences', lang), Colors.purple, TeacherAttendanceScreen()),
                  _buildActionCard(context, Icons.assignment, AppTranslations.translate('teacher_homework', lang), Colors.orange, TeacherHomeworkScreen()),
                  _buildActionCard(context, Icons.star, 'Conduite', Colors.amber, TeacherConductScreen()),
                  _buildActionCard(context, Icons.campaign, 'Actualités', Colors.pink, NewsScreen()),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, IconData icon, String title, Color color, Widget? destination) {
    return GestureDetector(
      onTap: () {
        if (destination != null) {
          Navigator.push(context, MaterialPageRoute(builder: (context) => destination));
        } else {
           ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Module en cours de développement')));
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.1) ?? Colors.transparent),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 32),
            ),
            SizedBox(height: 12),
            Text(
              title, 
              textAlign: TextAlign.center,
              style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontWeight: FontWeight.w600)
            ),
          ],
        ),
      ),
    );
  }
}

