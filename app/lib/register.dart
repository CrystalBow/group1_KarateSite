import 'package:app/main.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class PasswordRequirementRow extends StatelessWidget {
  final bool isMet;
  final String text;

  const PasswordRequirementRow({super.key, required this.isMet, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(isMet ? Icons.check_circle : Icons.cancel,
            color: isMet ? Colors.green : Colors.red),
        SizedBox(width: 10),
        Text(text),
      ],
    );
  }
}

class _RegisterPageState extends State<RegisterPage> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;

  String password = '';

  bool hasUppercase(String s) => s.contains(RegExp(r'[A-Z]'));
  bool hasLowercase(String s) => s.contains(RegExp(r'[a-z]'));
  bool hasSpecialChar(String s) => s.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
  bool hasMinLength(String s) => s.length >= 8;

  @override
  void initState() {
    super.initState();
      _passwordController.addListener(() {
      setState(() {
        password = _passwordController.text;
      });
    });
  }


  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _register() async {
    final firstName = _firstNameController.text;
    final lastName = _lastNameController.text;
    final email = _emailController.text;
    final password = _passwordController.text;

    try {
      final url = Uri.parse('http://karatetrainer.xyz:5000/api/register');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user': email,
          'password': password,
          'name': '$firstName $lastName',
          'email': email,
          'rank': 0
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['error'] == '') {
          showEmailVerificationDialog(context);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Registration failed: ${data['error']}')),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Server error: ${response.statusCode}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Network error: $e')),
      );
    }
  }

    void showEmailVerificationDialog(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false, // Prevent dismiss by tapping outside
    builder: (BuildContext context) {
      return AlertDialog(
        title: const Text("Email Not Verified"),
        content: const Text(
          "Please verify your email address before logging in. Check your inbox or resend a verification email.",
        ),
        actions: <Widget>[
          TextButton(
            child: const Text("Continue"),
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginPage()), // Navigate to RegisterPage
              );// Go back to the login page
            },
          ),
          ElevatedButton(
            child: const Text("Resend Email"),
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog first
              // onResend(); // TODO: Implement resend email functionality
            },
          ),
        ],
      );
    },
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(247, 222, 196, 1),
      body: Center(
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
                  'Register',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.only(top: 20.0, left: 30.0, right: 30.0, bottom: 20.0),
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
                        controller: _firstNameController,
                        decoration: const InputDecoration(
                          hintText: 'First Name',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                          ),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextField(
                        controller: _lastNameController,
                        decoration: const InputDecoration(
                          hintText: 'Last Name',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                          ),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          hintText: 'Email',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(12)),
                          ),
                          filled: true,
                          fillColor: Colors.white,
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                    ),
                    const SizedBox(height: 16),
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
              const SizedBox(height: 16),
              Padding(
                padding: const EdgeInsets.only(left: 75),
                child: Center(
                  child: Column(
                    children: [
                      PasswordRequirementRow(
                        isMet: hasMinLength(password),
                        text: 'At least 8 characters',
                      ),
                      PasswordRequirementRow(
                        isMet: hasUppercase(password),
                        text: 'Contains uppercase letter',
                      ),
                      PasswordRequirementRow(
                        isMet: hasLowercase(password),
                        text: 'Contains lowercase letter',
                      ),
                      PasswordRequirementRow(
                        isMet: hasSpecialChar(password),
                        text: 'Contains special character',
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16), // Spacing before register button
                Center(
                    child: SizedBox(
                      width: 200,
                      child: ElevatedButton(
                        onPressed: (
                          hasMinLength(password) &&
                          hasUppercase(password) &&
                          hasLowercase(password) &&
                          hasSpecialChar(password)
                        ) ? _register : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromRGBO(168, 184, 189, 1),
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(vertical: 10.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Register'),
                      ),
                    ),
                  ),
              
              // const SizedBox(height: 16), // Spacing before login button
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "Already have an account? ",
                        style: TextStyle(fontSize: 16, color: Colors.black54),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                    child: const Text(
                      "Login",
                      style: TextStyle(fontSize: 16,
                      color: Colors.blue),
                    ),
                  ),
                ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  } // <-- closes build method
} // <-- closes _RegisterPageState classdd