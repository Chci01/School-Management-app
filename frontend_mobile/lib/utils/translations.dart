
class AppTranslations {
  static const Map<String, Map<String, String>> strings = {
    'fr': {
      'login_title': 'KalanSira du Mali',
      'login_subtitle_student': 'Espace Élève & Parent',
      'login_subtitle_teacher': 'Espace Professeur',
      'login_hint_school': 'Sélectionnez un établissement',
      'login_hint_matricule': 'Matricule',
      'login_hint_password': 'Mot de passe',
      'login_button': 'Se connecter',
      'login_loading': 'Chargement...',
      'login_error_school': 'Veuillez sélectionner un établissement',
      'login_error_failed': 'Connexion échouée : ',
      
      'dashboard_home': 'Accueil',
      'dashboard_schedule': 'Planning',
      'dashboard_announcements': 'Annonces',
      'dashboard_bulletin': 'Bulletins',
      'dashboard_greeting': 'Bonjour,',
      'dashboard_matricule': 'Matricule',
      'dashboard_shortcuts': 'Raccourcis',
      
      'teacher_classes': 'Mes Classes',
      'teacher_grading': 'Saisie des Notes',
      'teacher_absences': 'Appel d\'Absence',
      'teacher_homework': 'Devoirs',
      'teacher_tools': 'Mes Outils de Classe',

      'settings_title': 'Paramètres',
      'settings_language': 'Langue',
      'settings_theme': 'Couleur du thème',
    },
    'en': {
      'login_title': 'KalanSira du Mali',
      'login_subtitle_student': 'Student & Parent Portal',
      'login_subtitle_teacher': 'Teacher Portal',
      'login_hint_school': 'Select a school',
      'login_hint_matricule': 'Student/Teacher ID',
      'login_hint_password': 'Password',
      'login_button': 'Log In',
      'login_loading': 'Loading...',
      'login_error_school': 'Please select a school',
      'login_error_failed': 'Login failed: ',
      
      'dashboard_home': 'Home',
      'dashboard_schedule': 'Schedule',
      'dashboard_announcements': 'Announcements',
      'dashboard_bulletin': 'Report Cards',
      'dashboard_greeting': 'Hello,',
      'dashboard_matricule': 'ID Number',
      'dashboard_shortcuts': 'Shortcuts',
      
      'teacher_classes': 'My Classes',
      'teacher_grading': 'Submit Grades',
      'teacher_absences': 'Roll Call',
      'teacher_homework': 'Homework',
      'teacher_tools': 'My Classroom Tools',

      'settings_title': 'Settings',
      'settings_language': 'Language',
      'settings_theme': 'Theme Color',
    }
  };

  static String translate(String key, String langCode) {
    return strings[langCode]?[key] ?? key;
  }
}
