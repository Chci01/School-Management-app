import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';



class ApiService {
  static String get baseUrl {
    return 'https://school-management-app-6pkq.onrender.com';
  }

  // Helper to get headers with JWT token
  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // --- AUTHENTICATION ---
  
  Future<Map<String, dynamic>> login(String matricule, String password, String schoolId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'matricule': matricule,
        'password': password,
        'schoolId': schoolId,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      
      // Save token and user info
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', data['access_token']);
      await prefs.setString('user_data', jsonEncode(data['user']));
      
      return data;
    } else {
      // print('LOGIN FAILED: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to login: ${response.statusCode} - ${response.body}');
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_data');
  }

  // --- DATA FETCHING ---
  
  Future<List<dynamic>> getSchools() async {
    final response = await http.get(
      Uri.parse('$baseUrl/schools/public'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load schools');
    }
  }

  Future<Map<String, dynamic>?> getActiveAcademicYear() async {
    final response = await http.get(
      Uri.parse('$baseUrl/academic-years/active'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      return null;
    }
  }

  Future<List<dynamic>> getAnnouncements() async {
    final response = await http.get(
      Uri.parse('$baseUrl/announcements'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load announcements');
    }
  }

  Future<Map<String, dynamic>> getBulletin(String studentId, int term, String academicYearId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/reports/bulletin/$studentId?term=$term&academicYearId=$academicYearId'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 403) {
      throw Exception('LOCKED');
    } else {
      throw Exception('Failed to load bulletin');
    }
  }

  Future<List<dynamic>> getSchedules({String? classId, String? teacherId}) async {
    String query = '';
    if (classId != null) query += 'classId=$classId&';
    if (teacherId != null) query += 'teacherId=$teacherId';

    final response = await http.get(
      Uri.parse('$baseUrl/schedules?$query'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load schedules');
    }
  }

  // --- Teacher Modules ---

  Future<List<dynamic>> getStudentsByClass(String classId, String academicYearId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/academic-records/class/$classId/year/$academicYearId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load students');
    }
  }

  Future<void> submitAttendance(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/attendance/batch'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to submit attendance');
    }
  }

  Future<void> submitGrade(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/grades'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to submit grade');
    }
  }

  Future<void> submitHomework(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/homeworks'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to submit homework');
    }
  }

  Future<List<dynamic>> getHomeworksByClass(String schoolId, String classId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/homeworks/class/$schoolId/$classId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load homeworks');
    }
  }

  // --- Student/Parent Modules ---

  Future<List<dynamic>> getPayments(String studentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/payments/student/$studentId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load payments');
    }
  }

  Future<List<dynamic>> getDocuments(String studentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/documents/student/$studentId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load documents');
    }
  }

  // Phase 17: Supplies and Conduct
  Future<List<dynamic>> getSupplies(String? classId) async {
    try {
      final endpoint = classId != null ? '$baseUrl/supplies/class/$classId' : '$baseUrl/supplies';
      final response = await http.get(
        Uri.parse(endpoint),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      throw Exception('Failed to load supplies: $e');
    }
  }

  Future<void> submitConduct({
    required String studentId,
    required int month,
    required int year,
    required double grade,
    String? appreciation,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/conduct/teacher'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'studentId': studentId,
          'month': month,
          'year': year,
          'grade': grade,
          'appreciation': appreciation,
        }),
      );
      if (response.statusCode != 201) {
        throw Exception('Failed to submit conduct');
      }
    } catch (e) {
      throw Exception('Failed to submit conduct: $e');
    }
  }

  Future<dynamic> getGlobalConduct(String studentId, int month, int year) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/conduct/global/$studentId?month=$month&year=$year'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<void> requestDocument(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/documents'),
      headers: await _getHeaders(),
      body: jsonEncode(data),
    );
    if (response.statusCode != 201) {
      throw Exception('Failed to request document');
    }
  }

  Future<List<dynamic>> getHealthRecords(String studentId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/health/student/$studentId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load health records');
    }
  }

  Future<List<dynamic>> getNews(String schoolId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/news/school/$schoolId'),
      headers: await _getHeaders(),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load news');
    }
  }
}
