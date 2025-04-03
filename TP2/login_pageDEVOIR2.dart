import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'home_page.dart';
import 'package:show_app_backend/config/api_config.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  Future<void> _login(String email, String password, BuildContext context) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final prefs = await SharedPreferences.getInstance();
      final token = jsonDecode(response.body)['token'];
      await prefs.setString('token', token);
Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const HomePage()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Invalid email or password")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
children: [
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: "Email"),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Password"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _login(emailController.text, passwordController.text, context),
              child: const Text("Login"),
            ),
          ],
        ),
  ),
    );
  }
}
