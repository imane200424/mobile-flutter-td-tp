const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const readData = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Récupérer tous les produits
app.get("/produits", (req, res) => {
    const produits = readData("produits.json");
    res.json(produits);
});

// Ajouter un produit
app.post("/produits", (req, res) => {
    let produits = readData("produits.json");
    const newProduit = req.body;
    produits.push(newProduit);
    writeData("produits.json", produits);
    res.status(201).json(newProduit);
});

// Récupérer toutes les commandes
app.get("/commandes", (req, res) => {
    const commandes = readData("commandes.json");
    res.json(commandes);
});

// Ajouter une commande
app.post("/commandes", (req, res) => {
    let commandes = readData("commandes.json");
    const newCommande = req.body;
    commandes.push(newCommande);
    writeData("commandes.json", commandes);
    res.status(201).json(newCommande);
});

app.listen(3000, () => console.log(" Serveur démarré sur http://localhost:3000"));
  