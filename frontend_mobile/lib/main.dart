import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'providers/auth_provider.dart';
import 'providers/settings_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final hasToken = prefs.getString('auth_token') != null;

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
      ],
      child: MyApp(initialRouteIsLogin: !hasToken),
    ),
  );
}

class MyApp extends StatelessWidget {
  final bool initialRouteIsLogin;

  const MyApp({super.key, required this.initialRouteIsLogin});

  @override
  Widget build(BuildContext context) {
    return Consumer<SettingsProvider>(
      builder: (context, settings, _) {
        return MaterialApp(
          title: 'KalanSira du Mali',
          debugShowCheckedModeBanner: false,
          themeMode: settings.isDarkMode ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            brightness: Brightness.light,
            primaryColor: settings.themeColor,
            scaffoldBackgroundColor: const Color(0xFFFFFBEB), // Warmer light background (Amber 50-ish)
            textTheme: const TextTheme(
              bodyMedium: TextStyle(color: Color(0xFF422006)), // Dark brown text for warmth
            ),
            colorScheme: ColorScheme.fromSeed(
              seedColor: settings.themeColor,
              brightness: Brightness.light,
              surface: const Color(0xFFFFFBEB),
            ),
          ),
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            primaryColor: settings.themeColor,
            scaffoldBackgroundColor: const Color(0xFF1C1917), // Warm dark background (Stone 900)
            textTheme: const TextTheme(
              bodyMedium: TextStyle(color: Color(0xFFFAFAF9)), // Off-white text
            ),
            colorScheme: ColorScheme.fromSeed(
              seedColor: settings.themeColor,
              brightness: Brightness.dark,
              surface: const Color(0xFF1C1917),
            ),
          ),
          home: initialRouteIsLogin ? LoginScreen() : DashboardScreen(),
        );
      },
    );
  }
}
