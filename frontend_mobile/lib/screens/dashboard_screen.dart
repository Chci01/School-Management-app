import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';
import '../utils/translations.dart';
import 'login_screen.dart';
import 'announcements_screen.dart';
import 'bulletin_screen.dart';
import 'schedule_screen.dart';
import 'settings_screen.dart';
import 'student_payments_screen.dart';
import 'student_health_screen.dart';
import 'student_supplies_screen.dart';
import 'news_screen.dart';
import '../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    HomeTab(),
    ScheduleScreen(),
    AnnouncementsScreen(),
    BulletinScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        selectedItemColor: settings.themeColor,
        unselectedItemColor: Colors.grey,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: AppTranslations.translate('dashboard_home', lang),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today),
            label: AppTranslations.translate('dashboard_schedule', lang),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.campaign_outlined),
            activeIcon: Icon(Icons.campaign),
            label: AppTranslations.translate('dashboard_announcements', lang),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school),
            label: AppTranslations.translate('dashboard_bulletin', lang),
          ),
        ],
      ),
    );
  }
}

// Sub-Tab for the Home Dashboard
class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  _HomeTabState createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  final ApiService _apiService = ApiService();
  dynamic _monthlyConduct;

  @override
  void initState() {
    super.initState();
    _fetchConduct();
  }

  Future<void> _fetchConduct() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (auth.user == null) return;
    
    final studentId = auth.user!['id'];
    final now = DateTime.now();
    try {
      final conduct = await _apiService.getGlobalConduct(studentId, now.month, now.year);
      if (mounted) {
        setState(() {
          _monthlyConduct = conduct;
        });
      }
    } catch (e) {
      // Ignored
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final settings = Provider.of<SettingsProvider>(context);
    final lang = settings.languageCode;
    final user = auth.user;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      user?['role'] == 'PARENT' 
                          ? 'Bonjour cher Parent'
                          : 'Bonjour cher',
                      style: TextStyle(color: Colors.grey[400], fontSize: 16),
                    ),
                    Text(
                      user?['role'] == 'PARENT' 
                          ? '[${user?['matricule'] ?? ''}] Élève: ${user?['firstName'] ?? ''} ${user?['lastName'] ?? ''}'
                          : '[${user?['matricule'] ?? ''}] ${user?['firstName'] ?? ''} ${user?['lastName'] ?? ''}',
                      style: TextStyle(
                        color: Theme.of(context).textTheme.bodyMedium?.color,
                        fontSize: user?['role'] == 'PARENT' ? 18 : 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.settings, color: Colors.grey[400]),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => SettingsScreen()),
                        );
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.logout, color: Colors.redAccent),
                      onPressed: () async {
                        await auth.logout();
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => LoginScreen()),
                        );
                      },
                    ),
                  ],
                )
              ],
            ),
            SizedBox(height: 32),
            
            // Quick Stats Card
            Container(
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blueAccent, Colors.purpleAccent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppTranslations.translate('dashboard_matricule', lang),
                        style: TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                      SizedBox(height: 4),
                      Text(
                        '${user?['matricule'] ?? 'N/A'}',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Icon(Icons.badge, color: Colors.white, size: 40),
                ],
              ),
            ),
            
            // Conduct Widget
            if (_monthlyConduct != null) ...[
              SizedBox(height: 16),
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.1),
                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Icon(Icons.star, color: Colors.amber, size: 32),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Conduite du Mois',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 4),
                          Text(
                            '${_monthlyConduct['grade']}/20 - ${_monthlyConduct['appreciation'] ?? ''}',
                            style: TextStyle(color: Colors.amber, fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            SizedBox(height: 32),
            Text(
              AppTranslations.translate('dashboard_shortcuts', lang),
              style: TextStyle(color: Theme.of(context).textTheme.bodyMedium?.color, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildShortcutButton(Icons.payment, 'Paiements', Colors.green, () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => StudentPaymentsScreen()));
                  }),
                  _buildShortcutButton(Icons.medical_services, 'Infirmerie', Colors.red, () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => StudentHealthScreen()));
                  }),
                  _buildShortcutButton(Icons.shopping_bag, 'Fournitures', Colors.blue, () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => StudentSuppliesScreen()));
                  }),
                  _buildShortcutButton(Icons.campaign, 'Actualités', Colors.purple, () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => NewsScreen()));
                  }),
                ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildShortcutButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 32),
          ),
          SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
