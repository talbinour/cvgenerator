import json
import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from datetime import datetime
from chatterbot.conversation import Statement
from functools import lru_cache
from pymongo import MongoClient
import unicodedata
from bson import ObjectId
from pymongo import MongoClient

# Initialisation de la connexion MongoDB et de la collection de messages
client = MongoClient('mongodb://localhost:27017/')
db = client['chatbot_database']
messages_collection = db['messages']

app = Flask(__name__)
CORS(app)

# Initialize SpaCy and NLTK
nlp = spacy.load("fr_core_news_sm")
nltk.download("stopwords")
nltk.download("punkt")
nltk.download("wordnet")
stop_words = set(stopwords.words("french"))
lemmatizer = WordNetLemmatizer()




# Helper function for postprocessing bot response
def postprocess(response):
    # No specific postprocessing logic implemented here
    return response

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
train_from_json(r"C:\Users\ADMIN\cvgenerator\venv\cv_chatbot_data")
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message") # type: ignore

    # Obtenir la réponse du bot
    bot_response = str(bot.get_response(user_input))
    
    return jsonify({"response": bot_response})


@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    # Implémentez ici la gestion réelle des profils
    # Enregistrez les données du profil utilisateur dans le CV
    # Enregistrez également les données dans une base de données ou un fichier JSON si nécessaire
    # Par exemple, pour enregistrer les données dans une base de données MongoDB :
    # user_profile = db.profiles.insert_one(édata)
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})

@app.route("/save-message", methods=["POST"])
def save_message():
    data = request.json
    message_data = data.get("message")  # type: ignore # Obtenez les données du message de la requête
    user_id = data.get("user_id")  # type: ignore 
    conversation_id = data.get("conversation_id")  # type: ignore 

    # Obtenez la réponse du chatbot
    bot_response = bot.get_response(message_data)

    # Recherchez la conversation de l'utilisateur dans la base de données
    conversation = messages_collection.find_one({"user_id": user_id, "conversation_id": conversation_id})

    if conversation:
        # Si la conversation existe, ajoutez le nouveau message de l'utilisateur et la réponse du chatbot à la liste des messages
        messages_collection.update_one(
            {"user_id": user_id, "conversation_id": conversation_id},
            {"$push": {"messages": {"user_message": message_data, "bot_response": str(bot_response), "timestamp": datetime.now()}}}
        )
    else:
        # Si la conversation n'existe pas, créez une nouvelle entrée dans la collection avec le message de l'utilisateur et la réponse du chatbot
        messages_collection.insert_one({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "messages": [{"user_message": message_data, "bot_response": str(bot_response), "timestamp": datetime.now()}]
        })

    return jsonify({"message": "Message enregistré avec succès."})

@app.route("/conversations/<user_id>", methods=["GET"])
def get_conversations(user_id):
    # Récupérer toutes les conversations de l'utilisateur avec l'ID spécifié
    conversations = messages_collection.find({"user_id": user_id})

    # Créer une liste de conversations avec les titres comme premiers messages et les dates
    conversation_list = []
    for conv in conversations:
        if "messages" in conv and conv["messages"]:
            title = conv["messages"][0]["user_message"]  # Le premier message comme titre
            date = conv["messages"][0]["timestamp"]  # La date du premier message
            conversation_list.append({"title": title, "date": date, "conversation_id": conv["conversation_id"]})

    return jsonify(conversation_list)

@app.route("/messages/<conversation_id>", methods=["GET"])
def get_messages_by_conversation_id(conversation_id):
    try:
        # Récupérer les messages de la conversation spécifiée
        conversation = messages_collection.find_one({"conversation_id": conversation_id})
        if conversation:
            messages = conversation.get("messages", [])
            return jsonify({"messages": messages}), 200
            
        else:
            return jsonify({"message": "Conversation not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def load_cv_questions(file_path):
    try:
        with open(file_path, 'r') as f:
            cv_questions = json.load(f)
            return cv_questions
    except FileNotFoundError:
        print("Le fichier CV n'a pas été trouvé.")
        return None
    except json.JSONDecodeError:
        print("Erreur lors du décodage du fichier JSON.")
        return None

cv_questions = load_cv_questions('cvtitre.json')

def get_next_question(conversation_state):
    section_questions = conversation_state.get("section_questions", [])
    current_index = conversation_state.get("current_question_index", 0)
    if current_index < len(section_questions):
        next_question = section_questions[current_index]["example"]
        conversation_state["current_question_index"] += 1
        return next_question, conversation_state
    else:
        return None, conversation_state

@app.route("/new-question", methods=["POST"]) # type: ignore
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state", {}) # type: ignore
    user_response = data.get("message")# type: ignore

    if not conversation_state:
        next_question = "À quelle section souhaitez-vous commencer ?"
        conversation_state = {"state": "waiting_for_section"}
        return jsonify({"response": next_question, "next_question_key": "waiting_for_section", "conversation_state": conversation_state})

    if conversation_state.get("state") == "waiting_for_section":
        section_title = user_response.strip().lower()
        section_matched = next((section for section in cv_questions["sections"] if section["section_title"].lower() == section_title), None)# type: ignore

        if section_matched:
            section_title = section_matched["section_title"]
            section_questions = section_matched.get("questions", [])
            conversation_state.update({
                "state": "section",
                "section_title": section_title,
                "section_questions": section_questions,
                "current_question_index": 0
            })
            next_question = section_questions[0]["example"] if section_questions else None
            return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
        else:
            return jsonify({"response": "La section que vous avez choisie n'existe pas. Veuillez réessayer.", "next_question_key": "waiting_for_section", "conversation_state": {"state": "waiting_for_section"}})

    elif conversation_state.get("state") == "section":
        next_question, conversation_state = get_next_question(conversation_state)
        if next_question:
            return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
        else:
            section_title = conversation_state.get("section_title", "Section inconnue")
            return jsonify({"response": f"Vous avez répondu à toutes les questions de la section '{section_title}'. Veuillez choisir une autre section.", "next_question_key": "waiting_for_section", "conversation_state": {"state": "waiting_for_section"}})

if __name__ == "__main__":
    app.run(debug=True)
def ask_next_question(section_questions, conversation_state):
    # Vérifier s'il y a d'autres questions dans la section
    current_index = conversation_state.get("current_question_index", 0)
    if current_index < len(section_questions):
        # Poser la prochaine question de la section
        next_question = section_questions[current_index]["example"]
        conversation_state["current_question_index"] += 1
        return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
    else:
        # Indiquer que toutes les questions de la section ont été posées
        return move_to_next_section(cv_questions["sections"], conversation_state) # type: ignore

def move_to_next_section(sections, conversation_state):
    current_section_title = conversation_state.get("section_title")
    current_section_index = None
    for i, section in enumerate(sections):
        if section["section_title"] == current_section_title:
            current_section_index = i
            break
    
    if current_section_index is not None and current_section_index < len(sections) - 1:
        # Passer à la section suivante
        next_section = sections[current_section_index + 1]
        next_section_title = next_section["section_title"]
        next_section_questions = next_section.get("questions", [])
        if next_section_questions:
            # Poser la première question de la prochaine section
            next_question = next_section_questions[0]["example"]
            conversation_state["section_title"] = next_section_title
            conversation_state["section_questions"] = next_section_questions
            conversation_state["current_question_index"] = 1  # Remettre l'index à 1 pour la première question
            conversation_state["state"] = "section"
            return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
    else:
        # Aucune section suivante, terminer la conversation
        return jsonify({"response": "Vous avez répondu à toutes les questions du CV.", "next_question_key": "conversation_end", "conversation_state": None})

if __name__ == "__main__":
    app.run(debug=True)
