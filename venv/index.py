import json
from operator import index
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
train_from_json(r"C:\Users\isran\cvgenerator\venv\cv_chatbot_data")

class QuestionGenerator:
    def __init__(self):
        self.questions = {}

    def load_questions(self, questions):
        self.questions = questions

    def generate_questions_by_classification(self, classification, cv_content):
        if classification == "contact":
            return self.generate_contact_questions(cv_content)
        elif classification == "education":
            return self.generate_education_questions(cv_content)
        elif classification == "profile":
            return self.generate_profile_questions(cv_content)
        elif classification == "experience":
            return self.generate_experience_questions(cv_content)
        elif classification == "skills":
            return self.generate_skills_questions(cv_content)
        elif classification == "interests":
            return self.generate_interests_questions(cv_content)
        elif classification == "languages":
            return self.generate_languages_questions(cv_content)
        else:
            return []

    def generate_contact_questions(self, cv_content):
        contact_questions = [
            "Quel est votre numéro de téléphone ?",
            "Quelle est votre adresse e-mail ?",
            "Quel est l'URL de votre site web ?",
            "Quel est votre profil LinkedIn ?",
            "Dans quel pays êtes-vous basé(e) ?"
        ]
        reminder_message = "(Veuillez respecter l'ordre des questions lors de la réponse et ajouter une virgule entre chaque réponse.)"
        return contact_questions + [reminder_message]

    def generate_education_questions(self, cv_content):
        education_questions = [
            "Où avez-vous étudié ?",
            "Quel est le nom de votre école/université ?",
            "Pouvez-vous préciser la période de temps de vos études ?"
        ]
        reminder_message = "(Veuillez respecter l'ordre des questions lors de la réponse et ajouter une virgule entre chaque réponse.)"
        return education_questions + [reminder_message]


    def generate_profile_questions(self, cv_content):
        profile_questions = [
            "Pouvez-vous nous parler un peu de vous ?"
        ]
        return profile_questions

    def generate_experience_questions(self, cv_content):
        experience_professionnelle_questions = [
            "Quel est votre poste ?",
            "Quel est le nom de votre employeur ?",
            "Dans quelle ville avez-vous travaillé ?",
            "Quelle est la date de début de votre expérience professionnelle ?",
            "Quelle est la date de fin de votre expérience professionnelle ?",
            "Pouvez-vous décrire votre expérience professionnelle ?"
        ]
        reminder_message = "(Veuillez respecter l'ordre des questions lors de la réponse et ajouter une virgule entre chaque réponse.)"
        return experience_professionnelle_questions + [reminder_message]

    def generate_skills_questions(self, cv_content):
        competence_questions = [
            "Quelles compétences avez-vous ? (Veuillez spécifier le niveau pour chaque compétence, séparés par un deux-points)"
        ]
        return competence_questions


    def generate_interests_questions(self, cv_content):
        centre_interet_questions = [
            "Quels sont vos centres d'intérêt ?"
        ]
        return centre_interet_questions
    
    def generate_languages_questions(self, cv_content):
        langue_questions = [
            "Quelles langues parlez-vous ? (Veuillez spécifier le niveau pour chaque langue, séparés par un deux-points)"
        ]
        return langue_questions

    def generate_formation_questions(self, cv_content):
            formation_questions = [
                "Quel est votre titre de formation ?",
                "Quel est le nom de votre établissement ?",
                "Dans quelle ville avez-vous étudié ?",
                "Quelle est la date de début de votre formation ?",
                "Quelle est la date de fin de votre formation ?",
                "Pouvez-vous décrire votre formation ?"
            ]
            reminder_message = "(Veuillez respecter l'ordre des questions lors de la réponse et ajouter une virgule entre chaque réponse.)"
            return formation_questions + [reminder_message]

# Charger les questions pour question_generator
question_generator = QuestionGenerator()
question_generator.load_questions({
    "question1": "Quel est votre numéro de téléphone ?",  # Passer None pour cv_content
    "question2":"Quelle est votre adresse e-mail ?",  # Passer None pour cv_content
    "question3": "Quel est l'URL de votre site web ?",  # Passer None pour cv_content
    "question4":"Quel est votre profil LinkedIn ?",  # Passer None pour cv_content
    "question5":"Dans quel pays êtes-vous basé(e) ?",  # Passer None pour cv_content
     # Passer None pour cv_content
    
    "question6": "Quelle est la date de début  de vos études ?",  # Passer None pour cv_content
    "question7":  "Quelle est la date de fin de de vos études ?", 
     "question8":  "Où avez-vous étudié ?",
     "question9":  "Quel est le nom de votre école/université ?",
    "question10":"Quelle langues parlez-vous ?",
    "question11":"Quel  est ton niveau dans cette langue ?",
    "question12":" Pouvez-vous nous parler un peu de vous ?",
    "question13":"Quelle est la date de début de votre expérience professionnelle ?",
    "question14":"Quelle est la date de fin de votre expérience professionnelle ?",
    "question15":"Dans quelle ville avez-vous travaillé ?",
    "question16":"Quel est votre poste ?",
    "question17":"Quel est le nom de votre employeur ?",
    "question18":"Pouvez-vous décrire votre expérience professionnelle ?",
    "question19":"Quelle compétences avez-vous ?",
    "question20":"Quel  est ton niveau dans cette compétences  ?",
    "question21":"Quels sont vos centres d'intérêt ?",
    "question22":"",

    # Ajoutez d'autres questions ici...
})


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

with open('cvtitre.json', 'r') as file:
    cv_data = json.load(file)

def is_valid_date(date_string):
    formats = ["%Y", "%Y-%m", "%Y-%m-%d"]
    for fmt in formats:
        try:
            datetime.datetime.strptime(date_string, fmt)
            return True
        except ValueError:
            continue
    return False

@app.route("/new-question", methods=["POST"])
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state", {})  # Assurez-vous que conversation_state est un dict
    user_response = data.get("message", "").strip()

    print("Conversation state:", conversation_state)
    print("User response:", user_response)

    current_question_key = conversation_state.get("state", "start")

    if current_question_key == "start":
        next_question = "À quelle section souhaitez-vous commencer ?"
        conversation_state = {"state": "waiting_for_section"}
        return jsonify({"response": next_question, "conversation_state": conversation_state})

    elif current_question_key == "waiting_for_section":
        section_title = user_response.capitalize()  # Assurez-vous que la capitalisation est correcte
        section_matched = None
        for section in cv_data["sections"]:
            if section_title.lower() == section["section_title"].lower():
                section_matched = section
                break

        if section_matched:
            section_title = section_matched["section_title"]
            section_questions = section_matched.get("questions", [])
            conversation_state = {
                "state": "section",
                "section_title": section_title,
                "section_questions": section_questions,
                "current_question_index": 0
            }
            next_question = section_questions[0]["example"] if section_questions else f"Aucune question disponible dans la section '{section_title}'."
            return jsonify({"response": next_question, "conversation_state": conversation_state})
        else:
            next_question = "La section que vous avez choisie n'existe pas. Veuillez réessayer."
            conversation_state["state"] = "waiting_for_section"
            return jsonify({"response": next_question, "conversation_state": conversation_state})

    elif current_question_key == "section":
        section_questions = conversation_state.get("section_questions", [])
        current_index = conversation_state.get("current_question_index", 0)

        if current_index < len(section_questions):
            current_question = section_questions[current_index]["example"]

            if "date" in current_question.lower() and not is_valid_date(user_response):
                next_question = "Veuillez entrer une date valide au format AAAA-MM-JJ."
                return jsonify({"response": next_question, "conversation_state": conversation_state})

            # Enregistrer la réponse de l'utilisateur ici si nécessaire
            # Par exemple, vous pourriez stocker les réponses dans une autre structure de données

            conversation_state["current_question_index"] += 1

            if conversation_state["current_question_index"] < len(section_questions):
                next_question = section_questions[conversation_state["current_question_index"]]["example"]
            else:
                next_question = f"Vous avez terminé la section '{conversation_state['section_title']}'. À quelle section souhaitez-vous continuer ?"
                conversation_state["state"] = "waiting_for_section"

            return jsonify({"response": next_question, "conversation_state": conversation_state})

    next_question = "Une erreur s'est produite. Veuillez réessayer."
    return jsonify({"response": next_question, "conversation_state": {"state": "start"}})

@app.route("/previous-question", methods=["POST"])
def handle_previous_question():
    data = request.json
    conversation_state = data.get("conversation_state") # type: ignore
    previous_question_key = None
    
    # Vérifier si l'état de la conversation est présent
    if conversation_state:
        current_question_key = conversation_state.get("state")
        if current_question_key:
            # Récupérer la clé de la question précédente
            question_number = int(current_question_key.replace("question", ""))
            previous_question_number = question_number - 1
            if previous_question_number > 0:
                previous_question_key = f"question{previous_question_number}"
    
    if previous_question_key:
        previous_question = question_generator.questions.get(previous_question_key)
        updated_state = {"state": previous_question_key}
        return jsonify({"response": previous_question, "conversation_state": updated_state})
    else:
        return jsonify({"response": "Aucune question précédente trouvée.", "conversation_state": conversation_state})


if __name__ == "__main__":
    app.run(debug=True)