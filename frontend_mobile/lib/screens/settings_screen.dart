import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';

class SettingsScreen extends StatelessWidget {
  static const List<Map<String, dynamic>> _colors = [
    {'name': 'Teal Blue', 'color': Color(0xFF067BC2)},
    {'name': 'Sky', 'color': Color(0xFF84BCDA)},
    {'name': 'Amber', 'color': Color(0xFFECC30B)},
    {'name': 'Coral', 'color': Color(0xFFF37748)},
    {'name': 'Pink', 'color': Color(0xFFD56062)},
  ];

  SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(AppTranslations.translate('settings_title', settings.languageCode)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Dark Mode Toggle
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Mode Sombre",
                  style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Switch(
                  value: settings.isDarkMode,
                  onChanged: (val) => settings.toggleTheme(),
                  activeThumbColor: settings.themeColor,
                ),
              ],
            ),
            SizedBox(height: 32),

            // Theme Colors
            Text(
              AppTranslations.translate('settings_theme', settings.languageCode),
              style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Wrap(
              spacing: 16,
              children: _colors.map((c) {
                final isSelected = settings.themeColor.value == (c['color'] as Color).value;
                return GestureDetector(
                  onTap: () => settings.setThemeColor(c['color']),
                  child: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: c['color'],
                      shape: BoxShape.circle,
                      border: isSelected ? Border.all(color: Theme.of(context).textTheme.bodyMedium?.color ?? Colors.white, width: 3) : null,
                      boxShadow: isSelected
                          ? [BoxShadow(color: c['color'].withOpacity(0.5), blurRadius: 10, spreadRadius: 2)]
                          : [],
                    ),
                    child: isSelected ? Icon(Icons.check, color: Theme.of(context).scaffoldBackgroundColor) : null,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 32),

            // Languages
            Text(
              AppTranslations.translate('settings_language', settings.languageCode),
              style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            _buildLangButton(context, settings, 'Français', 'fr'),
            SizedBox(height: 8),
            _buildLangButton(context, settings, 'English', 'en'),
          ],
        ),
      ),
    );
  }

  Widget _buildLangButton(BuildContext context, SettingsProvider settings, String name, String code) {
    final isSelected = settings.languageCode == code;
    return InkWell(
      onTap: () => settings.setLanguage(code),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? settings.themeColor.withOpacity(0.2) : Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? settings.themeColor : (Theme.of(context).textTheme.bodyMedium?.color?.withOpacity(0.1) ?? Colors.transparent)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(name, style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 16)),
            if (isSelected) Icon(Icons.check_circle, color: settings.themeColor),
          ],
        ),
      ),
    );
  }
}
