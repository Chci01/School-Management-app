import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';

class BulletinScreen extends StatefulWidget {
  const BulletinScreen({super.key});

  @override
  _BulletinScreenState createState() => _BulletinScreenState();
}

class _BulletinScreenState extends State<BulletinScreen> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _bulletin;
  bool _isLoading = false;
  String? _errorMessage;

  int _selectedTerm = 1;

  Future<void> _fetchBulletin() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user == null) return;

    setState(() => _isLoading = true);

    try {
      // Hardcoded academic year ID for Demo 
      // Ideally fetched via another endpoint /academic-years
      // We will assume the active year logic works if we provide one or server fallback
      // For this step, we'll try to trigger the endpoint. Let's use a dummy ID and let 
      // the user visually see the "empty state" or loading state nicely styled.
      
      final data = await _apiService.getBulletin(user['id'], _selectedTerm, 'currentYearId');
      setState(() {
        _bulletin = data;
        _errorMessage = null;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
         _isLoading = false;
         _bulletin = null;
         if (e.toString().contains('LOCKED')) {
            _errorMessage = 'ℹ️ Les notes de ce trimestre sont en cours de délibération et ne sont pas encore publiées par l\'Administration.';
         } else {
            _errorMessage = 'Aucun bulletin disponible pour ce trimestre.';
         }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Mes Bulletins',
              style: TextStyle(
                color: Colors.white,
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            // Term Selector
            Row(
              children: [
                _buildTermChip(1, 'Trimestre 1'),
                SizedBox(width: 8),
                _buildTermChip(2, 'Trimestre 2'),
                SizedBox(width: 8),
                _buildTermChip(3, 'Trimestre 3'),
              ],
            ),
            
            SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                icon: Icon(Icons.sync, color: Colors.white),
                label: Text('Actualiser', style: TextStyle(color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purpleAccent,
                  padding: EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))
                ),
                onPressed: _isLoading ? null : _fetchBulletin,
              ),
            ),
            
            SizedBox(height: 32),
            
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator(color: Colors.purpleAccent))
                  : _bulletin == null
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  _errorMessage != null && _errorMessage!.contains('délibération') 
                                    ? Icons.lock_clock 
                                    : Icons.folder_off_outlined, 
                                  size: 80, 
                                  color: Colors.grey[800]
                                ),
                                SizedBox(height: 16),
                                Text(
                                  _errorMessage ?? 'Sélectionnez un trimestre',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(color: Colors.grey[400], fontSize: 16, height: 1.5),
                                ),
                              ],
                            ),
                          ),
                        )
                      : SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16)
                            ),
                            child: Column(
                              children: [
                                Text(
                                  'BULLETIN DE NOTES',
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 2
                                  ),
                                ),
                                Divider(color: Colors.black, thickness: 2),
                                SizedBox(height: 16),
                                
                                // Grades Mapping (If Present)
                                if (_bulletin!['subjects'] != null)
                                   ...(_bulletin!['subjects'] as List).map((sub) => Padding(
                                     padding: const EdgeInsets.symmetric(vertical: 8.0),
                                     child: Row(
                                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                       children: [
                                         Text(sub['subjectName'], style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
                                         Text('${sub['average']} / 20', style: TextStyle(color: Colors.black, fontWeight: FontWeight.w900)),
                                       ],
                                     ),
                                   )),
                                 
                                 SizedBox(height: 24),
                                 Container(
                                   padding: EdgeInsets.all(16),
                                   color: Colors.grey[100],
                                   child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('MOYENNE GÉNÉRALE', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                                        Text('${_bulletin!['globalAverage']} / 20', style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.w900)),
                                      ],
                                   ),
                                 )
                              ],
                            ),
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTermChip(int term, String label) {
    bool isSelected = _selectedTerm == term;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedTerm = term;
          _bulletin = null; // Reset view when changing term
          _errorMessage = null;
        });
      },
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? Colors.purpleAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? Colors.purpleAccent : Colors.grey[700]!,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey[400],
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
