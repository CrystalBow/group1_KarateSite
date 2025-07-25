// user_session.dart
class UserSession {
  static String id = '';
  static String accessToken = '';
  static String name = '';
  static String email = '';
  static String streak = '0';
  static String progressW = '0';
  static String progressY = '0';
  static String progressO = '0';
  static String belt = '';
  // Add any other fields you need

    static void clear() {
    id = '';
    name = '';
    email = '';
    belt = '';
    streak = '0';
    progressW = '0';
    progressY = '0';
    progressO = '0';
    accessToken = '';
  }
}

void loginSuccessHandler(String id, String token, String name, String email, String streak, String progressW, String progressY, String progressO) {
        UserSession.id = id;  
        UserSession.accessToken = token;
        UserSession.name = name;
        UserSession.email = email;
        UserSession.streak = streak;
        UserSession.progressW = progressW;
        UserSession.progressY = progressY;
        UserSession.progressO = progressO;
}
