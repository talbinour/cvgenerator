import json
import os
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

# Charger et entraîner à partir du JSON personnalisé
def train_from_json(file_paths):
    for file_path in file_paths:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            trainer = ListTrainer(bot)
            for entry in data:
                if "patterns" in entry and "responses" in entry:
                    patterns = entry["patterns"]
                    responses = entry["responses"]
                    for pattern, response in zip(patterns, responses):
                        trainer.train([pattern, response])  # Correction ici

# Entraîner à partir du fichier conversations.json
train_from_json(["conversations.json"])

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
    save_conversation_to_json(user_input, bot_response)  # Enregistrer la conversation
    return jsonify({"response": bot_response})

@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    # Implémentez ici la gestion réelle des profils
    # Enregistrez les données du profil utilisateur dans le CV
    # Enregistrez également les données dans une base de données ou un fichier JSON si nécessaire
    # Par exemple, pour enregistrer les données dans une base de données MongoDB :
    # user_profile = db.profiles.insert_one(data)
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})

# Fonction pour charger les conversations depuis le fichier JSON
def load_conversations_from_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            conversations = [json.loads(line) for line in lines if line.strip()]
    except FileNotFoundError:
        conversations = []
    return conversations
@app.route("/save-response", methods=["POST"])
def save_response():
    data = request.json
    # Implémentez ici la logique pour enregistrer la réponse dans un fichier ou une base de données
    return jsonify({"message": "Réponse enregistrée avec succès."})

if __name__ == "__main__":
    app.run(debug=True)
