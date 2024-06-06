Plateforme de Création de CV avec Chatbot
Cette plateforme permet de créer des CV intelligents en utilisant un chatbot pour guider les utilisateurs à travers le processus.

Prérequis
Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

Python (version 3.9.13)
MongoDB (version 7.0.5)
Nodejs(Version:20.11.0)

Installation et Configuration
Clonage du dépôt Git

bash
Copier le code
<<
git clone https://github.com/talbinour/cvgenerator.git
>>
Installation des dépendances Python

pip install Flask flask-cors chatterbot spacy nltk pymongo

Installation des dépendances Node.js pour le client

bash
Copier le code
cd client
npm install
Installation des dépendances Node.js pour le serveur

bash
Copier le code
cd ../server
npm install

Assurez-vous que MongoDB est en cours d'exécution et configurez les paramètres de connexion dans app.py.

Lancement de l'Application
Lancement du Serveur
serveur client ; 
cd client 
npm start 

serveur backend ;
cd server 
npm run dev 

serveur python 
activer l'environnement ; 
cd venv 
./scripts/activate
python index.py

L'application sera maintenant accessible à l'adresse : http://localhost:3000

Utilisation
Chatbot


Contact
Pour toute question ou assistance, veuillez contacter notre équipe de support à l'adresse email : verif.cevor@gmail.com

