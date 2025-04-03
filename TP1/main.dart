import 'dart:convert';
import 'package:http/http.dart' as http;

const String apiUrl = "http://localhost:3000";

// Récupérer et afficher les produits
Future<void> afficherProduits() async {
  final response = await http.get(Uri.parse("$apiUrl/produits"));
  if (response.statusCode == 200) {
    List produits = jsonDecode(response.body);
    produits.forEach((p) => print("Produit: ${p['nom']} - Prix: ${p['prix']} DH"));
  }
}

// Ajouter un produit
Future<void> ajouterProduit(String nom, double prix) async {
  final response = await http.post(
    Uri.parse("$apiUrl/produits"),
    headers: {"Content-Type": "application/json"},
    body: jsonEncode({"nom": nom, "prix": prix}),
  );
  if (response.statusCode == 201) print("✅ Produit ajouté !");
}

// Récupérer et afficher les commandes
Future<void> afficherCommandes() async {
  final response = await http.get(Uri.parse("$apiUrl/commandes"));
  if (response.statusCode == 200) {
    List commandes = jsonDecode(response.body);
    commandes.forEach((c) => print("Commande: ${c['id']} - Total: ${c['total']} DH"));
  }
}

// Ajouter une commande
Future<void> ajouterCommande(int id, List produits) async {
  final response = await http.post(
    Uri.parse("$apiUrl/commandes"),
    headers: {"Content-Type": "application/json"},
    body: jsonEncode({"id": id, "produits": produits, "total": produits.fold(0, (sum, p) => sum + p['prix'])}),
  );
  if (response.statusCode == 201) print("✅ Commande ajoutée !");
}

void main() async {
  await afficherProduits();
  await ajouterProduit("Clavier", 300);
  await afficherProduits();
  await ajouterCommande(1, [{"nom": "Clavier", "prix": 300}]);
  await afficherCommandes();
}