# Blockchain Academic Certificate Management System

## Description

Ce projet est une application full-stack permettant de gérer les certificats académiques de manière sécurisée en utilisant la blockchain.

Le système repose sur 3 couches :

- Frontend : Next.js
- Backend : Node.js / Express
- Blockchain : Ethereum (Smart Contract + ethers.js)

---

## Fonctionnalités

- Générer un certificat (Admin)
- Signer un certificat (Teacher)
- Valider un certificat (Admin)
- Vérifier un certificat (Public)

---

## Installation

### 1. Cloner le projet

```bash
git clone <repo-url>
cd projet-certificats


2. Installer les dépendances
Frontend
cd frontend-blockchain
npm install
Backend
cd ../backend
npm install
Blockchain
cd ../blockchain
npm install
Configuration

Créer les fichiers .env :

Backend
PORT=5000
RPC_URL=http://127.0.0.1:7545
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address
Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
Ganache
Lancer Ganache
Copier :
RPC URL (ex: http://127.0.0.1:7545
)
Private Key
Ajouter réseau dans MetaMask