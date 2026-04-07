import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class ScheduleScreen extends StatefulWidget {
  const ScheduleScreen({super.key});

  @override
  _ScheduleScreenState createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _schedules = [];
  bool _isLoading = true;

  Map<int, String> _getDaysMap(String lang) {
    if (lang == 'en') {
      return {
        1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
        4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday',
      };
    }
    return {
      1: 'Lundi', 2: 'Mardi', 3: 'Mercredi',
      4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi', 7: 'Dimanche',
    };
  }

  @override
  void initState() {
    super.initState();
    _fetchSchedules();
  }

  Future<void> _fetchSchedules() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user == null) return;

    try {
      String? classId = user['role'] != 'ENSEIGNANT' ? user['classId'] : null;
      String? teacherId = user['role'] == 'ENSEIGNANT' ? user['id'] : null;

      final schedules = await _apiService.getSchedules(
        classId: classId,
        teacherId: teacherId,
      );

      setState(() {
        _schedules = schedules;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur de chargement des emplois du temps')),
      );
    }
  }

  // Grouper les horaires par jour
  Map<int, List<dynamic>> _groupSchedulesByDay() {
    final Map<int, List<dynamic>> grouped = {};
    for (var s in _schedules) {
      final day = s['dayOfWeek'] as int;
      if (!grouped.containsKey(day)) {
        grouped[day] = [];
      }
      grouped[day]!.add(s);
    }
    return grouped;
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;
    final groupedSchedules = _groupSchedulesByDay();
    final daysMap = _getDaysMap(lang);

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(AppTranslations.translate('dashboard_schedule', lang)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : groupedSchedules.isEmpty
              ? Center(child: Text(lang == 'en' ? 'No classes found' : 'Aucun cours trouvé', style: TextStyle(color: Colors.white54)))
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: groupedSchedules.keys.length,
                  itemBuilder: (context, index) {
                    final dayInt = groupedSchedules.keys.elementAt(index);
                    final daySchedules = groupedSchedules[dayInt]!;
                    final dayName = daysMap[dayInt] ?? (lang == 'en' ? 'Unknown Day' : 'Jour Inconnu');

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12.0),
                          child: Text(
                            dayName,
                            style: TextStyle(
                              color: settings.themeColor,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        ...daySchedules.map((s) => _buildScheduleCard(s, settings.themeColor, lang)),
                      ],
                    );
                  },
                ),
    );
  }

  Widget _buildScheduleCard(dynamic schedule, Color themeColor, String lang) {
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: themeColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                Text(
                  schedule['startTime'],
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                Text('|', style: TextStyle(color: Colors.white54, fontSize: 10)),
                Text(
                  schedule['endTime'],
                  style: TextStyle(color: Colors.white54),
                ),
              ],
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  schedule['subject']['name'],
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 4),
                Text(
                  '${lang == 'en' ? 'Class' : 'Classe'}: ${schedule['class']['name']}',
                  style: TextStyle(color: Colors.grey[400], fontSize: 13),
                ),
                Text(
                  'Prof: ${schedule['teacher']['firstName']} ${schedule['teacher']['lastName']}',
                  style: TextStyle(color: Colors.grey[400], fontSize: 13),
                ),
                if (schedule['room'] != null)
                  Text(
                    '${lang == 'en' ? 'Room' : 'Salle'}: ${schedule['room']}',
                    style: TextStyle(color: Colors.orangeAccent, fontSize: 13),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
