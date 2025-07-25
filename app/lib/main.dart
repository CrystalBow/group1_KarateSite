import 'package:flutter/material.dart';
import 'register.dart';
import 'curriculum.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'usersession.dart';


void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Karate Trainer',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color.fromARGB(247, 222, 196, 1)),
      ),
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _userController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _userController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<bool> _login() async {
    final user = _userController.text;
    final password = _passwordController.text;
    

    if (user.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter both username and password!')),
      );
      return false;
    }

    // Perform login request
    try {
      final url = Uri.parse('http://karatetrainer.xyz:5000/api/login');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'user': user, 'password': password}),
      );

      if (response.statusCode == 200) {

      //   ScaffoldMessenger.of(context).showSnackBar(
      //     SnackBar(content: Text(response.body)),
      // );

          final data = jsonDecode(response.body);

          final token = data['accessToken'] as String? ?? '';

          if (token.isEmpty) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Login failed: No access token received')),
            );
            return false; // Login failed, return false
          }
          // Extract user details from the response
          final name = data['name'] ?? 'Unknown';
          final email = data['email'] ?? user;
          final streak = (data['streak'] ?? 0).toString();
          final progressW = (data['progressW'] ?? 0).toString();
          final progressY = (data['progressY'] ?? 0).toString();
          final progressO = (data['progressO'] ?? 0).toString();
          final id = (data['id'] ?? '').toString();

          // Update user session
          loginSuccessHandler(id, token, name, email, streak, progressW, progressY, progressO);

        return true; // Login successful, return true
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${response.body}')),
        );
        return false; // Login failed, return false
      }

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $e')),
      );
      return false; // Network error, return false
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(247, 222, 196, 1), // Light background color
      body: Center(
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 32.0),
                  child: Image.asset(
                    'lib/assets/logo.png',
                    height: 100,
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 30),
                  child: Text(
                    'Karate Trainer',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.bold,                
                      ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.only(top: 20.0,left: 30.0, right: 30.0, bottom: 20.0),
                  decoration: BoxDecoration(
                    color: Color.fromRGBO(245, 31, 15, 1),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 8,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: TextField(
                          controller: _userController,
                          decoration: const InputDecoration(
                            hintText: 'Username',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.all(Radius.circular(12)),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16), // Spacing between fields
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: TextField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            hintText: 'Password',
                            border: const OutlineInputBorder(
                              borderRadius: BorderRadius.all(Radius.circular(12)),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                            suffixIcon: IconButton(
                              icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                          ),
                        ),
                      ),                    
                    ],
                  ),
                ),
                const SizedBox(height: 16), // Spacing between fields
                
                Center(
                  child: SizedBox(
                    width: 200, // Set your desired width here
                    child: ElevatedButton(
                      onPressed: () async {
                        bool success = await _login();
                        if (success) {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const CurriculumPage()), // Navigate to CurriculumPage
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color.fromRGBO(168, 184, 189, 1),
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 10.0),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Login'),
                    ),
                  ),
                ),
                const SizedBox(height: 12), // Spacing before register button
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      'Don\'t have an account?',
                      style: TextStyle(fontSize: 16, color: Colors.black54), // Style for the text
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const RegisterPage()), // Navigate to RegisterPage
                        );
                      },
                      child: const Text(
                        'Register',
                        style: TextStyle(fontSize: 16,
                        color: Colors.blue),
                      ),
                    ),
                  ], // Center the text and button (Children of Column)
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}


