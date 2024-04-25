import os
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import Trainer
from pymongo import MongoClient

class CustomTrainer(Trainer):
    def train(self, directory_path):
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                if file.endswith('.json'):
                    self.train_from_json(os.path.join(root, file))
                elif file.endswith('.csv'):
                    self.train_from_csv(os.path.join(root, file))

    def train_from_json(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for entry in data:
                if "patterns" in entry and "responses" in entry:
                    patterns = entry["patterns"]
                    responses = entry["responses"]
                    for pattern, response in zip(patterns, responses):
                        self.chatbot.storage.update([{"text": pattern, "in_response_to": response}])

    def train_from_csv(self, file_path):
    df = pd.read_csv(file_path)
    for row in df.itertuples():
        question = str(row[1])  # Assuming the question is in the first column
        answer = str(row[2])  # Assuming the answer is in the second column
        statement = self.chatbot.storage.create(text=question, in_response_to=answer)
        self.chatbot.storage.update(statement)

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

trainer = CustomTrainer(bot)

# Chemin d'accès au répertoire contenant les fichiers JSON et CSV
directory_path = "C:\\Users\\isran\\cvgenerator\\venv\\kaggle"

# Charger et entraîner à partir de tous les fichiers JSON et CSV dans le répertoire
trainer.train(directory_path)

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
