import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from datetime import datetime
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
                    if data.strip():
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
    bot_response = str(bot.get_response(user_input))
    return jsonify({"response": bot_response})

@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})

@app.route("/save-message", methods=["POST"])
def save_message():
    data = request.json
    message_data = data.get("message")# type: ignore
    user_id = data.get("user_id")# type: ignore
    conversation_id = data.get("conversation_id")# type: ignore

    bot_response = bot.get_response(message_data)

    conversation = messages_collection.find_one({"user_id": user_id, "conversation_id": conversation_id})

    if conversation:
        messages_collection.update_one(
            {"user_id": user_id, "conversation_id": conversation_id},
            {"$push": {"messages": {"user_message": message_data, "bot_response": str(bot_response), "timestamp": datetime.now()}}}
        )
    else:
        messages_collection.insert_one({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "messages": [{"user_message": message_data, "bot_response": str(bot_response), "timestamp": datetime.now()}]
        })

    return jsonify({"message": "Message enregistré avec succès."})

@app.route("/conversations/<user_id>", methods=["GET"])
def get_conversations(user_id):
    conversations = messages_collection.find({"user_id": user_id})
    conversation_list = []
    for conv in conversations:
        if "messages" in conv and conv["messages"]:
            title = conv["messages"][0]["user_message"]
            date = conv["messages"][0]["timestamp"]
            conversation_list.append({"title": title, "date": date, "conversation_id": conv["conversation_id"]})
    return jsonify(conversation_list)

@app.route("/messages/<conversation_id>", methods=["GET"])
def get_messages_by_conversation_id(conversation_id):
    try:
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

# Sections qui peuvent avoir plusieurs réponses
multi_entry_sections = ["education", "experience", "competences professionnelles", "languages", "interets"]

def get_next_question(conversation_state):
    section_questions = conversation_state.get("section_questions", [])
    current_index = conversation_state.get("current_question_index", 0)
    if (current_index < len(section_questions)):
        next_question = section_questions[current_index]["example"]
        conversation_state["current_question_index"] += 1
        return next_question, conversation_state
    else:
        return None, conversation_state

@app.route("/new-question", methods=["POST"])# type: ignore
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state", {})# type: ignore
    user_response = data.get("message")# type: ignore

    if not conversation_state:
        next_question = "À quelle section souhaitez-vous commencer ?"
        conversation_state = {"state": "waiting_for_section"}
        return jsonify({"response": next_question, "conversation_state": conversation_state})

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
                "current_question_index": 0,
                "multi_entry": section_title.lower() in multi_entry_sections,
                "adding_more": False
            })
            if section_questions:
                next_question = section_questions[0]["example"]
                conversation_state["current_question_index"] = 1
            else:
                next_question = None
            return jsonify({"response": next_question, "conversation_state": conversation_state, "section_key": section_title, "question_number": 1})
        else:
            return jsonify({"response": "La section que vous avez choisie n'existe pas. Veuillez réessayer.", "conversation_state": {"state": "waiting_for_section"}})

    elif conversation_state.get("state") == "section":
        if conversation_state.get("adding_more"):
            if user_response.lower() == "oui":
                conversation_state["current_question_index"] = 0
                conversation_state["adding_more"] = False
            elif user_response.lower() == "non":
                section_title = conversation_state.get("section_title", "Section inconnue")
                conversation_state = {"state": "waiting_for_section"}
                return jsonify({"response": f"Vous avez répondu à toutes les questions de la section '{section_title}'. Veuillez choisir une autre section.", "conversation_state": conversation_state})
            else:
                return jsonify({"response": "Voulez-vous ajouter un autre exemple dans cette section ? (oui/non)", "conversation_state": conversation_state})

        next_question, conversation_state = get_next_question(conversation_state)
        question_number = conversation_state.get("current_question_index", 0)

        if next_question:
            return jsonify({"response": next_question, "conversation_state": conversation_state, "section_key": conversation_state["section_title"], "question_number": question_number})
        else:
            if conversation_state["multi_entry"]:
                conversation_state["adding_more"] = True
                return jsonify({"response": "Voulez-vous ajouter un autre exemple dans cette section ? (oui/non)", "conversation_state": conversation_state})
            else:
                section_title = conversation_state.get("section_title", "Section inconnue")
                conversation_state["state"] = "waiting_for_section"
                return jsonify({"response": f"Vous avez répondu à toutes les questions de la section '{section_title}'. Veuillez choisir une autre section.", "conversation_state": conversation_state})

if __name__ == "__main__":
    app.run(debug=True)
