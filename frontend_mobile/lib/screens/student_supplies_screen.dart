import 'package:flutter/material.dart';
import '../services/api_service.dart';

class StudentSuppliesScreen extends StatefulWidget {
  const StudentSuppliesScreen({super.key});

  @override
  _StudentSuppliesScreenState createState() => _StudentSuppliesScreenState();
}

class _StudentSuppliesScreenState extends State<StudentSuppliesScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  List<dynamic> _supplies = [];

  @override
  void initState() {
    super.initState();
    _fetchSupplies();
  }

  Future<void> _fetchSupplies() async {
    try {
      // In a real scenario, we would pass the child's classId if we only want their specific list
      final supplies = await _apiService.getSupplies(null); 
      setState(() {
        _supplies = supplies;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Fournitures & Tenues'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _supplies.isEmpty
              ? Center(child: Text('Aucune fourniture enregistrée.', style: TextStyle(color: Colors.white)))
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: _supplies.length,
                  itemBuilder: (context, index) {
                    final item = _supplies[index];
                    final isUniform = item['type'] == 'UNIFORM';
                    return Card(
                      color: Colors.white.withOpacity(0.05),
                      margin: EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: ListTile(
                        contentPadding: EdgeInsets.all(16),
                        leading: CircleAvatar(
                          backgroundColor: isUniform ? Colors.orange.withOpacity(0.2) : Colors.blue.withOpacity(0.2),
                          child: Icon(
                            isUniform ? Icons.checkroom : Icons.menu_book, 
                            color: isUniform ? Colors.orangeAccent : Colors.lightBlueAccent,
                          ),
                        ),
                        title: Text(item['name'], style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            SizedBox(height: 4),
                            if (item['description'] != null) Text(item['description'], style: TextStyle(color: Colors.grey)),
                            SizedBox(height: 8),
                            Text(
                              item['price'] != null ? '${item['price']} FCFA' : 'Prix non renseigné',
                              style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
