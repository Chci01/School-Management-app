import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';

class StudentHealthScreen extends StatefulWidget {
  const StudentHealthScreen({super.key});

  @override
  _StudentHealthScreenState createState() => _StudentHealthScreenState();
}

class _StudentHealthScreenState extends State<StudentHealthScreen> {
  bool _isLoading = true;
  List<dynamic> _records = [];

  @override
  void initState() {
    super.initState();
    _fetchRecords();
  }

  Future<void> _fetchRecords() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final data = await ApiService().getHealthRecords(user?['id']);
      setState(() {
        _records = data;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Color _getSeverityColor(String severity) {
    if (severity == 'HIGH') return Colors.red;
    if (severity == 'MEDIUM') return Colors.orange;
    return Colors.green;
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Dossier Médical'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : _records.isEmpty
              ? Center(child: Text('Aucun antécédent médical', style: TextStyle(color: Colors.white)))
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: _records.length,
                  itemBuilder: (context, index) {
                    final record = _records[index];
                    final date = DateTime.parse(record['createdAt']);
                    return Card(
                      color: Color(0xFF1E293B),
                      margin: EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.medical_services, color: settings.themeColor, size: 20),
                                    SizedBox(width: 8),
                                    Text(
                                      DateFormat('dd/MM/yyyy HH:mm').format(date),
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getSeverityColor(record['severity']).withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    record['severity'],
                                    style: TextStyle(color: _getSeverityColor(record['severity']), fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 12),
                            Text('Symptômes:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                            Text(record['symptoms'] ?? 'N/A', style: TextStyle(color: Colors.white)),
                            SizedBox(height: 8),
                            Text('Actions prises:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                            Text(record['actions'] ?? 'Aucune', style: TextStyle(color: Colors.white)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
