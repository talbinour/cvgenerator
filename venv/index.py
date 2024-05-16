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
    message_data = data.get("message")  # type: ignore # Get the message data
    user_id = data.get("user_id") # type: ignore 
    conversation_id = data.get("conversation_id") # type: ignore 

    # Recherchez la discussion de l'utilisateur dans la base de données
    conversation = messages_collection.find_one({"user_id": user_id, "conversation_id": conversation_id})

    if conversation:
        # Si la discussion existe, ajoutez simplement le nouveau message à la liste des messages
        messages_collection.update_one(
            {"user_id": user_id, "conversation_id": conversation_id},
            {"$push": {"messages": {"message": message_data, "timestamp": datetime.now()}}}
        )
    else:
        # Si la discussion n'existe pas, créez une nouvelle entrée dans la collection
        messages_collection.insert_one({
            "user_id": user_id,
            "conversation_id": conversation_id,
            "messages": [{"message": message_data, "timestamp": datetime.now()}]
        })

    return jsonify({"message": "Message enregistré avec succès."})



@app.route("/conversations/<user_id>", methods=["GET"])
def get_conversations(user_id):
    # Récupérer toutes les conversations de l'utilisateur avec l'ID spécifié
    conversations = messages_collection.find({"user_id": user_id})

    # Créer une liste de conversations avec les titres comme premiers messages et les dates
    conversation_list = []
    for conv in conversations:
        title = conv["messages"][0]["message"]  # Le premier message comme titre
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

def get_next_question(section_questions, current_index):
    if current_index < len(section_questions) - 1:
        return section_questions[current_index + 1]["example"]
    else:
        return None

@app.route("/new-question", methods=["POST"])
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state")
    user_response = data.get("message")
    
    print("Conversation state:", conversation_state)
    print("User response:", user_response)

    if conversation_state is None or conversation_state.get("state") == "start":
        # Demander à l'utilisateur à quelle section il souhaite commencer
        next_question = "À quelle section souhaitez-vous commencer ?"
        conversation_state = {"state": "waiting_for_section"}
        return jsonify({"response": next_question, "next_question_key": "waiting_for_section", "conversation_state": conversation_state})

    current_question_key = conversation_state.get("state")
    next_question_key = None
    next_question = None

    if current_question_key == "waiting_for_section":
        # Récupérer les questions de la section choisie par l'utilisateur
        section_title = user_response.strip().capitalize()  # Assurez-vous que la capitalisation est correcte
        section_matched = None
        for section in cv_questions["sections"]:
            if section_title.lower() == section["section_title"].lower():
                section_matched = section
                break

        if section_matched:
            # Commencer à poser toutes les questions de la section correspondante
            section_title = section_matched["section_title"]
            section_questions = section_matched.get("questions", [])
            conversation_state["section_title"] = section_title
            conversation_state["section_questions"] = section_questions
            conversation_state["current_question_index"] = 0
            conversation_state["state"] = "section"
            
            # Enregistrez section_matched dans conversation_state pour une utilisation future
            conversation_state["section_matched"] = section_matched
            
            # Vérifiez si des questions existent dans la section
            if section_questions:
                next_question = section_questions[0]["example"]
                print("Section questions:", section_questions)
                print("Current question index:", conversation_state["current_question_index"])
                print("Next question:", next_question)
            else:
                next_question = f"Aucune question disponible dans la section '{section_title}'."
            
            return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
        else:
            # Aucune section correspondante trouvée
            return jsonify({"response": "La section que vous avez choisie n'existe pas. Veuillez réessayer.", "next_question_key": "waiting_for_section", "conversation_state": {"state": "waiting_for_section"}})
    
    elif current_question_key == "section":
        # Récupérer la réponse de l'utilisateur et poser la prochaine question de la section
        section_questions = conversation_state.get("section_questions", [])
        current_index = conversation_state.get("current_question_index", 0)

        if current_index < len(section_questions):
                # Poser la prochaine question de la section
                next_question = section_questions[current_index]["example"]
                conversation_state["current_question_index"] += 1
                return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})

        else:
            # Indiquer que toutes les questions de la section ont été posées
            section_title = conversation_state.get("section_title", "Section inconnue")
            # Réinitialiser l'index des questions de la section si nécessaire
            conversation_state["current_question_index"] = 0
            
            # Passer à la section suivante si elle existe
            section_matched = conversation_state.get("numbers_questions")
            if section_matched is not None:
                next_section_index = cv_questions["sections"].index(section_matched) + 1
                if next_section_index <= len(cv_questions["sections"]):
                    next_section = cv_questions["sections"][next_section_index]
                    next_section_title = next_section.get("section_title", "Section inconnue")
                    next_section_questions = next_section.get("questions", [])
                    if next_section_questions:
                        next_question = next_section_questions[0]["example"]
                        conversation_state["section_title"] = next_section_title
                        conversation_state["section_questions"] = next_section_questions
                        conversation_state["state"] = "section"
                        # Mise à jour de section_matched pour la prochaine section
                        conversation_state["section_matched"] = next_section
                        return jsonify({"response": next_question, "next_question_key": "section", "conversation_state": conversation_state})
            # Si aucune section suivante n'existe, afficher un message indiquant de choisir une autre section
            return jsonify({"response": f"Vous avez répondu à toutes les questions de la section '{section_title}'. Veuillez choisir une autre section.", "next_question_key": "waiting_for_section", "conversation_state": {"state": "waiting_for_section"}})

    
    else:
        # Gérer toute autre condition ou erreur
        return jsonify({"response": "Une erreur s'est produite. Veuillez réessayer.", "next_question_key": "waiting_for_section", "conversation_state": {"state": "waiting_for_section"}})





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