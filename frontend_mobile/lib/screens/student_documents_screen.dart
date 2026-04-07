import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';

class StudentDocumentsScreen extends StatefulWidget {
  const StudentDocumentsScreen({super.key});

  @override
  _StudentDocumentsScreenState createState() => _StudentDocumentsScreenState();
}

class _StudentDocumentsScreenState extends State<StudentDocumentsScreen> {
  bool _isLoading = true;
  List<dynamic> _requests = [];
  String _selectedType = 'CERTIFICAT'; // CERTIFICAT, RELEVE
  final TextEditingController _reasonController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchRequests();
  }

  Future<void> _fetchRequests() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final data = await ApiService().getDocuments(user?['id']);
      setState(() {
        _requests = data;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _submitRequest() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    setState(() => _isLoading = true);
    
    try {
      await ApiService().requestDocument({
        'schoolId': user?['schoolId'],
        'studentId': user?['id'],
        'type': _selectedType,
        'reason': _reasonController.text,
      });

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Demande envoyée!'), backgroundColor: Colors.green));
      _reasonController.clear();
      _fetchRequests(); // Refresh list
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red));
    }
  }

  Color _getStatusColor(String status) {
    if (status == 'PENDING') return Colors.orange;
    if (status == 'APPROVED') return Colors.green;
    return Colors.red;
  }

  String _getStatusText(String status) {
    if (status == 'PENDING') return 'En attente';
    if (status == 'APPROVED') return 'Approuvé';
    return 'Rejeté';
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);

    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Documents Administratifs'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : Column(
              children: [
                // Request Form
                Container(
                  padding: EdgeInsets.all(16),
                  margin: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text('Nouvelle Demande', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                      SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        initialValue: _selectedType,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Color(0xFF0F172A),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                        dropdownColor: Color(0xFF1E293B),
                        style: TextStyle(color: Colors.white),
                        items: ['CERTIFICAT', 'RELEVE'].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
                        onChanged: (val) => setState(() => _selectedType = val!),
                      ),
                      SizedBox(height: 12),
                      TextField(
                        controller: _reasonController,
                        style: TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Motif (Optionnel)',
                          hintStyle: TextStyle(color: Colors.grey),
                          filled: true,
                          fillColor: Color(0xFF0F172A),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                      ),
                      SizedBox(height: 16),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: settings.themeColor,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: EdgeInsets.symmetric(vertical: 14),
                        ),
                        onPressed: _submitRequest,
                        child: Text('Demander le Document', style: TextStyle(color: Colors.white)),
                      )
                    ],
                  ),
                ),
                
                Expanded(
                  child: _requests.isEmpty
                    ? Center(child: Text('Aucune demande en cours', style: TextStyle(color: Colors.grey)))
                    : ListView.builder(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _requests.length,
                        itemBuilder: (context, index) {
                          final req = _requests[index];
                          return Card(
                            color: Color(0xFF1E293B),
                            margin: EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: ListTile(
                              leading: Icon(Icons.description, color: settings.themeColor),
                              title: Text(req['type'], style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              subtitle: Text(DateFormat('dd/MM/yyyy').format(DateTime.parse(req['createdAt'])), style: TextStyle(color: Colors.grey)),
                              trailing: Container(
                                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: _getStatusColor(req['status']).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(_getStatusText(req['status']), style: TextStyle(color: _getStatusColor(req['status']), fontSize: 12, fontWeight: FontWeight.bold)),
                              ),
                            ),
                          );
                        },
                      ),
                ),
              ],
            ),
    );
  }
}
