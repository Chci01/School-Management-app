import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsProvider with ChangeNotifier {
  String _languageCode = 'fr'; // Default language
  Color _themeColor = const Color(0xFF067BC2); // Changed to Bright Teal Blue
  bool _isDarkMode = true; // Default to dark mode

  String get languageCode => _languageCode;
  Color get themeColor => _themeColor;
  bool get isDarkMode => _isDarkMode;

  SettingsProvider() {
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Load Language
    _languageCode = prefs.getString('languageCode') ?? 'fr';

    // Load Theme Color
    int? colorValue = prefs.getInt('themeColor');
    if (colorValue != null) {
      _themeColor = Color(colorValue);
    }
    
    _isDarkMode = prefs.getBool('isDarkMode') ?? true;
    
    notifyListeners();
  }

  Future<void> setLanguage(String code) async {
    _languageCode = code;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', code);
    notifyListeners();
  }

  Future<void> setThemeColor(Color color) async {
    _themeColor = color;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('themeColor', color.value);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', _isDarkMode);
    notifyListeners();
  }
}
