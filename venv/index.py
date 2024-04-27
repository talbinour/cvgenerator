import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from pymongo import MongoClient
from python_question_generator import QuestionGenerator  # Correction de l'import

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

# Charger et entraîner à partir des fichiers JSON dans un répertoire
def train_from_json(directory):
    trainer = ListTrainer(bot)
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = file.read()
                    if data.strip():  # Vérifie si le fichier n'est pas vide
                        json_data = json.loads(data)
                        for entry in json_data:
                            if "patterns" in entry and "responses" in entry:
                                patterns = entry["patterns"]
                                responses = entry["responses"]
                                for pattern, response in zip(patterns, responses):
                                    trainer.train([pattern, response])
            except FileNotFoundError:
                print(f"Le fichier {file_path} n'existe pas.")
            except PermissionError:
                print(f"Permission refusée pour accéder au fichier {file_path}.")
            except json.JSONDecodeError as e:
                print(f"Erreur de décodage JSON dans le fichier {file_path}: {e}")

# Entraîner à partir du répertoire contenant les fichiers JSON
train_from_json(r"C:\Users\isran\cvgenerator\venv\cv_chatbot_data")

# Fonction pour enregistrer la conversation dans un fichier JSON
def save_conversation_to_json(user_input, bot_response):
    conversation = {"user_input": user_input, "bot_response": bot_response}
    with open("conversation_history.json", "a", encoding="utf-8") as file:
        json.dump(conversation, file, ensure_ascii=False)
        file.write("\n")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    
    # Utiliser la classe QuestionGenerator pour générer une question aléatoire
    if user_input.lower() == "nouvelle question":
        file_path = "C:\\Users\\isran\\cvgenerator\\venv\\question\\questions.json"  # Chemin vers votre fichier JSON contenant les questions
        question_generator = QuestionGenerator(file_path)
        question_generator.load_questions_from_json()
        bot_response = question_generator.get_random_question()
    else:
        bot_response = str(bot.get_response(user_input))
    
    save_conversation_to_json(user_input, bot_response)  # Enregistrer la conversation
    return jsonify({"response": bot_response})

@app.route("/personal_info", methods=["POST"])
def personal_info():
    data = request.json
    # Implémentez la logique pour gérer la saisie des informations personnelles
    # Par exemple, analyser les données et poser des questions supplémentaires si nécessaire
    return jsonify({"message": "Informations personnelles enregistrées avec succès."})

@app.route("/select_template", methods=["POST"])
def select_template():
    data = request.json
    # Implémentez la logique pour gérer la sélection du modèle de CV
    # Par exemple, enregistrer l'information sur le modèle sélectionné
    return jsonify({"message": "Modèle de CV sélectionné avec succès."})

@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    # Implémentez ici la gestion réelle des profils
    # Enregistrez les données du profil utilisateur dans le CV
    # Enregistrez également les données dans une base de données ou un fichier JSON si nécessaire
    # Par exemple, pour enregistrer les données dans une base de données MongoDB :
    # user_profile = db.profiles.insert_one(data)
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})

@app.route("/save-response", methods=["POST"])
def save_response():
    data = request.json
    # Implémentez ici la logique pour enregistrer la réponse dans un fichier ou une base de données
    return jsonify({"message": "Réponse enregistrée avec succès."})

if __name__ == "__main__":
    app.run(debug=True)
