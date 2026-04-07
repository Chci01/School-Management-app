import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';

class StudentPaymentsScreen extends StatefulWidget {
  const StudentPaymentsScreen({super.key});

  @override
  _StudentPaymentsScreenState createState() => _StudentPaymentsScreenState();
}

class _StudentPaymentsScreenState extends State<StudentPaymentsScreen> {
  bool _isLoading = true;
  List<dynamic> _payments = [];

  @override
  void initState() {
    super.initState();
    _fetchPayments();
  }

  Future<void> _fetchPayments() async {
    try {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      final data = await ApiService().getPayments(user?['id']);
      setState(() {
        _payments = data;
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);

    // TODO: Dynamic translations for the title
    return Scaffold(
      backgroundColor: Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Historique des Paiements'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: settings.themeColor))
          : _payments.isEmpty
              ? Center(child: Text('Aucun paiement trouvé', style: TextStyle(color: Colors.white)))
              : ListView.builder(
                  padding: EdgeInsets.all(16),
                  itemCount: _payments.length,
                  itemBuilder: (context, index) {
                    final payment = _payments[index];
                    final date = DateTime.parse(payment['createdAt']);
                    return Card(
                      color: Color(0xFF1E293B),
                      margin: EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.green.withOpacity(0.2),
                          child: Icon(Icons.attach_money, color: Colors.green),
                        ),
                        title: Text('Tranche ${payment['tranche']}', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        subtitle: Text(DateFormat('dd/MM/yyyy').format(date), style: TextStyle(color: Colors.grey[400])),
                        trailing: Text(
                          '${payment['amount']} FCFA',
                          style: TextStyle(color: settings.themeColor, fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
