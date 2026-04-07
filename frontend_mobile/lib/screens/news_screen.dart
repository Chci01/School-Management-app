import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

class NewsScreen extends StatefulWidget {
  const NewsScreen({super.key});

  @override
  _NewsScreenState createState() => _NewsScreenState();
}

class _NewsScreenState extends State<NewsScreen> {
  final ApiService _apiService = ApiService();
  List<dynamic> _newsItems = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchNews();
  }

  Future<void> _fetchNews() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final schoolId = authProvider.user!['schoolId'];
      final news = await _apiService.getNews(schoolId);
      setState(() {
        _newsItems = news;
        _isLoading = false;
      });
    } catch (e) {
      print('Error fetching news: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Actualités'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      extendBodyBehindAppBar: true,
      body: Container(
        color: Color(0xFF0F172A), // Dark fallback background
        child: SafeArea(
          child: _isLoading
              ? Center(child: CircularProgressIndicator())
              : _newsItems.isEmpty
                  ? Center(child: Text('Aucune actualité', style: TextStyle(color: Colors.white70)))
                  : ListView.builder(
                      padding: EdgeInsets.all(16),
                      itemCount: _newsItems.length,
                      itemBuilder: (context, index) {
                        final item = _newsItems[index];
                        return Card(
                          color: Colors.white.withOpacity(0.05),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item['title'],
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  item['content'],
                                  style: TextStyle(color: Colors.white70),
                                ),
                                SizedBox(height: 16),
                                // Image handling would go here, parsing JSON strings
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    _formatDate(item['publishedAt']),
                                    style: TextStyle(fontSize: 12, color: Colors.white54),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
        ),
      ),
    );
  }

  String _formatDate(String isoDate) {
    final date = DateTime.parse(isoDate);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}
