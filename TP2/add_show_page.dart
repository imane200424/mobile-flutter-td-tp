import 'package:flutter/material.dart';

class AddShowPage extends StatelessWidget {
  const AddShowPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(color: Colors.white),
        title: const Text("Add Show", style: TextStyle(color: Colors.white),),
        backgroundColor: Colors.blueAccent,
      ),

      body: const Center(child: Text("Add Show Page")),
    );
  }
}
