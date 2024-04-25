
# Scrapping de Codes Promo avec Notification par Email

Ce script Node.js utilise Puppeteer pour faire du scrapping sur un site web de codes promo, les enregistre dans un fichier Excel, et envoie des notifications par email pour les promotions expirant bientôt.

## Prérequis

- Node.js installé sur votre machine.
- Puppeteer, ExcelJS, et d'autres bibliothèques nécessaires. Assurez-vous d'avoir un `package.json` correctement configuré.
- Un token pour l'utilisation de l'API Resend pour l'envoi d'emails.

## Installation

1. Clonez le dépôt ou téléchargez les fichiers source.
2. Installez les dépendances nécessaires avec npm :
   ```bash
   npm install 

## Configuration

Créez un fichier `.env` à la racine de votre projet. Ajoutez la clé suivante dans le fichier `.env`:

makefile

Copy code

`RESEND_TOKEN=votre_token_resend` 

## Utilisation

Pour exécuter le script, lancez la commande suivante depuis le terminal :

bash

Copy code

`node nom_du_fichier.js` 

## Fonctionnalités

-   **Scrapping de Codes Promo** : Le script navigue sur le site `https://www.radins.com/code-promo/`, extrait les informations des codes promo et les sauvegarde dans un fichier Excel.
-   **Rotation Visuelle dans la Console** : Pendant le scrapping, une animation de rotation est affichée dans la console pour indiquer que le processus est en cours.
-   **Génération d'un Fichier Excel** : Les codes promo extraits sont enregistrés dans un fichier `Codes_Promo.xlsx`.
-   **Notification par Email** : Les promotions expirant bientôt sont envoyées par email à une liste prédéfinie de destinataires.

## Gestion des erreurs

Le script gère les erreurs de base, notamment les erreurs de navigation et les erreurs d'envoi d'email. Les erreurs sont affichées dans la console.

## Fermeture

Après l'exécution, le navigateur est fermé et le message de fin d'opération s'affiche dans la console.
