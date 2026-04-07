import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'dashboard_screen.dart';
import 'teacher_dashboard_screen.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ApiService _apiService = ApiService();
  final _matriculeController = TextEditingController();
  final _passwordController = TextEditingController();

  String? _selectedSchoolId;
  List<dynamic> _schools = [];
  bool _isLoadingSchools = true;

  @override
  void initState() {
    super.initState();
    _fetchSchools();
  }

  Future<void> _fetchSchools() async {
    try {
      final data = await _apiService.getSchools();
      setState(() {
        _schools = data;
        _isLoadingSchools = false;
      });
    } catch (e) {
      print('FAILED TO FETCH SCHOOLS: $e');
      setState(() => _isLoadingSchools = false);
    }
  }

  void _handleLogin() async {
    if (_selectedSchoolId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Veuillez sélectionner un établissement')),
      );
      return;
    }

    final auth = Provider.of<AuthProvider>(context, listen: false);
    try {
      await auth.login(
        _matriculeController.text,
        _passwordController.text,
        _selectedSchoolId!,
      );
      
      Widget nextScreen = (auth.user?['role'] == 'ENSEIGNANT') 
          ? TeacherDashboardScreen() 
          : DashboardScreen();

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => nextScreen),
      );
    } catch (e) {
      final lang = Provider.of<SettingsProvider>(context, listen: false).languageCode;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${AppTranslations.translate('login_error_failed', lang)}${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<SettingsProvider>(context).languageCode;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Stack(
        children: [
          // Background Gradient Blobs
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.blue.withOpacity(0.3),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.purple.withOpacity(0.3),
              ),
            ),
          ),

          // Main content
          Center(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Theme.of(context).primaryColor, width: 2),
                      image: DecorationImage(
                        image: AssetImage('assets/logo.png'),
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    AppTranslations.translate('login_title', lang),
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).textTheme.bodyMedium?.color,
                    ),
                  ),
                  Text(
                    AppTranslations.translate('login_subtitle_student', lang),
                    style: TextStyle(fontSize: 16, color: Colors.grey[400]),
                  ),
                  SizedBox(height: 48),

                  // Glassmorphism Card
                  ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: EdgeInsets.all(32),
                        decoration: BoxDecoration(
                          color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.1) ?? Colors.white,
                            width: 1,
                          ),
                        ),
                        child: Column(
                          children: [
                                _buildTextField(
                                  controller: _matriculeController,
                                  icon: Icons.person_outline,
                                  hint: AppTranslations.translate('login_hint_matricule', lang),
                                  obscure: false,
                                  capitalization: TextCapitalization.characters,
                                ),
                                SizedBox(height: 16),
                                _buildSchoolDropdown(lang),
                                SizedBox(height: 16),
                                _buildTextField(
                                  controller: _passwordController,
                                  icon: Icons.lock_outline,
                                  hint: AppTranslations.translate('login_hint_password', lang),
                                  obscure: true,
                                ),
                            SizedBox(height: 32),

                            // Login Button
                            Consumer<AuthProvider>(
                              builder: (context, auth, _) {
                                return SizedBox(
                                  width: double.infinity,
                                  height: 50,
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.blueAccent,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                    ),
                                    onPressed: auth.isLoading
                                        ? null
                                        : _handleLogin,
                                    child: auth.isLoading
                                        ? CircularProgressIndicator(
                                            color: Colors.white,
                                          )
                                        : Text(
                                            AppTranslations.translate('login_button', lang),
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                            ),
                                          ),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required IconData icon,
    required String hint,
    required bool obscure,
    TextCapitalization capitalization = TextCapitalization.none,
  }) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      textCapitalization: capitalization,
      style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color),
      decoration: InputDecoration(
        prefixIcon: Icon(icon, color: Colors.grey[400]),
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey[500]),
        filled: true,
        fillColor: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.05),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildSchoolDropdown(String langCode) {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(
        prefixIcon: Icon(
          Icons.account_balance_outlined,
          color: Colors.grey[400],
        ),
        filled: true,
        fillColor: Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.05),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
      dropdownColor: Theme.of(context).scaffoldBackgroundColor,
      style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color),
      hint: Text(
        _isLoadingSchools ? AppTranslations.translate('login_loading', langCode) : AppTranslations.translate('login_hint_school', langCode),
        style: TextStyle(color: Colors.grey[500]),
      ),
      initialValue: _selectedSchoolId,
      items: _schools.map((school) {
        return DropdownMenuItem<String>(
          value: school['id'],
          child: Text(school['name'] ?? 'École inconnue'),
        );
      }).toList(),
      onChanged: (val) {
        setState(() {
          _selectedSchoolId = val;
        });
      },
    );
  }
}
