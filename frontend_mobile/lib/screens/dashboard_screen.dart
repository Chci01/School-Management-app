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
    final auth = Provider.of<AuthProvider>(context);
    final role = auth.user?['role'];
    
    // Determine theme color based on role
    Color themeColor = const Color(0xFF8B5CF6); // Default Purple for Student
    if (role == 'PARENT') {
      themeColor = const Color(0xFF10B981); // Green for Parent
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: _screens[_currentIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          backgroundColor: Colors.white,
          selectedItemColor: themeColor,
          unselectedItemColor: Colors.grey[400],
          currentIndex: _currentIndex,
          type: BottomNavigationBarType.fixed,
          elevation: 0,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.home_outlined),
              activeIcon: const Icon(Icons.home),
              label: AppTranslations.translate('dashboard_home', lang),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.calendar_today_outlined),
              activeIcon: const Icon(Icons.calendar_today),
              label: AppTranslations.translate('dashboard_schedule', lang),
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.book_outlined),
              activeIcon: const Icon(Icons.book),
              label: 'Notes', // Mockup shows 'Notes' or 'Devoirs'
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.chat_bubble_outline),
              activeIcon: Icon(Icons.chat_bubble),
              label: 'Messages',
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.more_horiz),
              label: 'Plus',
            ),
          ],
        ),
      ),
    );
  }
}

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
    final user = auth.user;
    final isParent = user?['role'] == 'PARENT';
    final themeColor = isParent ? const Color(0xFF10B981) : const Color(0xFF8B5CF6);

    return SingleChildScrollView(
      child: Column(
        children: [
          // Curved Header
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 60),
            decoration: BoxDecoration(
              color: themeColor,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(40),
                bottomRight: Radius.circular(40),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      backgroundImage: user?['photo'] != null ? NetworkImage(user!['photo']) : null,
                      child: user?['photo'] == null 
                          ? const Icon(Icons.person, color: Colors.white, size: 28) 
                          : null,
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Bonjour,',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                        Row(
                          children: [
                            Text(
                              isParent ? 'M/Mme ${user?['lastName'] ?? ''}' : '${user?['firstName'] ?? ''}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Text('👋', style: TextStyle(fontSize: 20)),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
                Stack(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.notifications_outlined, color: Colors.white, size: 28),
                      onPressed: () {},
                    ),
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: const Text(
                          '1',
                          style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
          
          // Overlapping Card (Main Stats)
          Transform.translate(
            offset: const Offset(0, -40),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: isParent ? _buildParentStats(themeColor) : _buildStudentStats(themeColor),
              ),
            ),
          ),

          // Shortcuts / Modules Grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Modules',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF333333)),
                ),
                const SizedBox(height: 16),
                GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _buildShortcutCard(Icons.payment, 'Paiements', const Color(0xFF3B82F6), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => StudentPaymentsScreen()));
                    }),
                    _buildShortcutCard(Icons.medical_services, 'Infirmerie', const Color(0xFFEF4444), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => StudentHealthScreen()));
                    }),
                    _buildShortcutCard(Icons.shopping_bag, 'Fournitures', const Color(0xFFF59E0B), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => StudentSuppliesScreen()));
                    }),
                    _buildShortcutCard(Icons.campaign, 'Actualités', const Color(0xFF8B5CF6), () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => NewsScreen()));
                    }),
                  ],
                ),
                const SizedBox(height: 24),
                // Settings & Logout Area
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    children: [
                      ListTile(
                        leading: const Icon(Icons.settings, color: Colors.grey),
                        title: const Text('Paramètres'),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => SettingsScreen())),
                      ),
                      const Divider(),
                      ListTile(
                        leading: const Icon(Icons.logout, color: Colors.red),
                        title: const Text('Déconnexion', style: TextStyle(color: Colors.red)),
                        onTap: () async {
                          final auth = Provider.of<AuthProvider>(context, listen: false);
                          await auth.logout();
                          Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => LoginScreen()));
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentStats(Color themeColor) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Moyenne générale', style: TextStyle(color: Colors.grey, fontSize: 14)),
                const SizedBox(height: 4),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '14,6',
                      style: TextStyle(color: themeColor, fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const Text(
                      '/20',
                      style: TextStyle(color: Colors.grey, fontSize: 16),
                    ),
                  ],
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text('Classement', style: TextStyle(color: Colors.grey, fontSize: 14)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Text('8', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    const Text('/28', style: TextStyle(color: Colors.grey)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.arrow_upward, size: 12, color: Colors.green),
                          Text('2', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          height: 8,
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(4),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: 14.6 / 20,
            child: Container(
              decoration: BoxDecoration(
                color: themeColor,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildParentStats(Color themeColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Mes enfants', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Icon(Icons.add, color: Colors.grey[400]),
          ],
        ),
        const SizedBox(height: 16),
        // Mock children
        Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[200]!),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const CircleAvatar(radius: 20, backgroundColor: Colors.blueAccent),
                    const SizedBox(height: 8),
                    const Text('Emma', style: TextStyle(fontWeight: FontWeight.bold)),
                    const Text('4ème B', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: themeColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text('Moy: 14,2/20', style: TextStyle(color: themeColor, fontSize: 10, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[200]!),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const CircleAvatar(radius: 20, backgroundColor: Colors.orangeAccent),
                    const SizedBox(height: 8),
                    const Text('Lucas', style: TextStyle(fontWeight: FontWeight.bold)),
                    const Text('2nde A', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: themeColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text('Moy: 12,8/20', style: TextStyle(color: themeColor, fontSize: 10, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildShortcutCard(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey[100]!),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFF333333),
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
