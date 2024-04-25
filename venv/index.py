import os
import json
import pandas as pd
import itertools  # Ajout de l'importation du module itertools
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Connexion à MongoDB
client = MongoClient("mongodb://localhost:27017/database")
db = client["chat_db"]
messages_collection = db["messages"]

bot = ChatBot(
    "chatbot",
    storage_adapter="chatterbot.storage.MongoDatabaseAdapter",
    database_uri="mongodb://localhost:27017/database",
    logic_adapters=[
        {
            "import_path": "chatterbot.logic.BestMatch",
            "default_response": "Désolé, je n'ai pas de réponse.",
            "maximum_similarity_threshold": 0.7
        }
    ]
)

# Fonction pour charger et entraîner à partir de chaque fichier JSON
def train_from_all_json(directory_path):
    # Liste pour stocker les chemins d'accès des fichiers
    file_paths = []
    
    # Parcourir les fichiers et répertoires dans le répertoire
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.json') or file.endswith('.csv'):  # Lire les fichiers JSON et CSV
                file_path = os.path.join(root, file)
                file_paths.append(file_path)

    # Initialisez la variable trainer à l'extérieur de la boucle try-except
    trainer = ListTrainer(bot)

    # Charger et entraîner à partir de chaque fichier JSON ou CSV
    for file_path in file_paths:
        try:
            if file_path.endswith('.json'):
                with open(file_path, 'r', encoding='latin1') as file:
                    data = json.load(file)
                    for entry in data:
                        if "patterns" in entry and "responses" in entry:
                            patterns = entry["patterns"]
                            responses = entry["responses"]
                            for pattern, response in zip(patterns, responses):
                                trainer.train([pattern, response])
            elif file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
                for row in df.itertuples():
                    patterns = [str(row[1])]  # Assuming the question is in the first column
                    responses = [str(row[2])]  # Assuming the answer is in the second column
                    trainer.train(list(itertools.chain(patterns, responses)))  # Convertir itertools.chain en liste
        except Exception as e:
            print(f"Une erreur s'est produite lors du traitement du fichier {file_path}: {e}")

# Chemin d'accès au répertoire contenant les fichiers JSON et CSV
directory_path = "C:\\Users\\isran\\cvgenerator\\venv\\kaggle"

# Charger et entraîner à partir de tous les fichiers JSON et CSV dans le répertoire
train_from_all_json(directory_path)

# Fonction pour enregistrer la conversation dans un fichier JSON
def save_conversation_to_json(user_input, bot_response):
    conversation = {"user_input": user_input, "bot_response": bot_response}
    with open("conversation_history.json", "a", encoding="utf-8") as file:
        json.dump(conversation, file, ensure_ascii=False)
        file.write("\n")
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    bot_response = str(bot.get_response(user_input))
    save_conversation_to_json(user_input, bot_response)  
    return jsonify({"response": bot_response})

@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})

@app.route("/save-response", methods=["POST"])
def save_response():
    data = request.json
    return jsonify({"message": "Réponse enregistrée avec succès."})

if __name__ == "__main__":
    app.run(debug=True)
