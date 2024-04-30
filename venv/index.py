import json
import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

app = Flask(__name__)
CORS(app)
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
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    # Obtenir la réponse du bot
    bot_response = str(bot.get_response(user_input))
    
    return jsonify({"response": bot_response})





class QuestionGenerator:
    def __init__(self):
        self.questions = {}

    def load_questions(self, questions):
        self.questions = questions

    def generate_next_question(self, current_question_key, user_response):
        # Vérifier si la clé de la question actuelle existe dans le dictionnaire des questions
        if current_question_key in self.questions:
            current_question_data = self.questions[current_question_key]
            main_question = current_question_data.get("main_question")
            additional_question = current_question_data.get("additional_question")

            if user_response.strip().lower() == main_question.strip().lower():
                # Si la réponse de l'utilisateur correspond à la question principale, poser la question supplémentaire
                return additional_question
            else:
                # Si la réponse de l'utilisateur est différente de la question principale, passer à la question suivante
                question_number = int(current_question_key.replace("question", ""))
                next_question_number = question_number + 1
                next_question_key = f"question{next_question_number}"
                if next_question_key in self.questions:
                    next_question_data = self.questions[next_question_key]
                    next_question = next_question_data.get("main_question")
                    return next_question, next_question_key
                else:
                    # Si toutes les questions ont été posées, la conversation est terminée
                    return "Merci pour les informations. Votre CV est complet.", None
        else:
            # Si la clé de la question actuelle n'existe pas dans le dictionnaire, la conversation est interrompue
            return "Une erreur est survenue. La conversation est interrompue.", None


# Schéma de données JSON pour les questions
questions_data = {
  "question1": {
    "main_question": "Quel est votre expérience professionnelle ?",
    "additional_question": "Voulez-vous ajouter quelque chose de plus à propos de votre expérience professionnelle ?"
  },
  "question2": {
    "main_question": "Quelle est votre formation académique ?",
    "additional_question": "Avez-vous d'autres formations à ajouter ?"
  },
  "question3": {
    "main_question": "Quelles langues parlez-vous ?",
    "additional_question": "Avez-vous d'autres langues à ajouter ?"
  },
  "question4": {
    "main_question": "Pouvez-vous nous parler un peu de vous ?",
    "additional_question": "Voulez-vous ajouter quelque chose de plus à propos de vous ?"
  },
  "question5": {
    "main_question": "Pouvez-vous nous parler de votre expérience professionnelle ?",
    "additional_question": "Voulez-vous ajouter quelque chose de plus à propos de votre expérience professionnelle ?"
  },
  "question6": {
    "main_question": "Quelles sont vos compétences professionnelles ?",
    "additional_question": "Avez-vous d'autres compétences à ajouter ?"
  },
  "question7": {
    "main_question": "Quels sont vos centres d'intérêt ?",
    "additional_question": "Avez-vous d'autres centres d'intérêt à ajouter ?"
  }
  # Ajoutez d'autres questions ici...
}

# Instanciation de la classe QuestionGenerator et chargement des questions
question_generator = QuestionGenerator()
question_generator.load_questions(questions_data)



@app.route("/add-more-info", methods=["POST"])
def add_more_info():
    data = request.json
    user_input = data.get("message")
    conversation_state = data.get("conversation_state")

    # Vérifier si conversation_state est None, sinon initialiser à un état de conversation par défaut
    if conversation_state is None:
        conversation_state = {}

    current_question_key = conversation_state.get("state")
    next_question_key = None

    # Logique pour gérer les réponses de l'utilisateur et lui permettre d'ajouter des informations supplémentaires
    # Ajoutez votre logique pour chaque étape de la création du CV ici

    return jsonify({"response": next_question, "next_question_key": next_question_key, "conversation_state": conversation_state})



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

@app.route("/extract-cv-title", methods=["POST"])
def get_cv_title():
    data = request.json
    cv_content = data.get("cv_content")
    # Implémentez la logique pour extraire le titre du CV à partir de son contenu
    # Remplacez cette logique par votre propre méthode de détection automatique du titre du CV
    title = "Titre du CV"
    return jsonify({"title": title})

def generate_next_question(next_question_key):
    # Définir un dictionnaire contenant les questions associées à chaque clé
    questions = {
      "question1": "Quel est votre expérience professionnelle ?",
    "question2": "Quelle est votre formation académique ?",
    "question3": "Quelles sont vos compétences professionnelles ?",
    "question4": "Quelles sont vos informations de contact ?",
    "question5": "Quel est votre profil ?",
    "question6": "Quels sont vos centres d'intérêt ?",
     "question7": "Quelles langues parlez-vous ?",
    }

    # Obtenir la question associée à la clé fournie
    next_question = questions.get(next_question_key)

    # Si la clé n'est pas dans le dictionnaire, renvoyer None
    if next_question is None:
        return None

    return next_question

@app.route("/new-question", methods=["POST"])
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state")
    user_response = data.get("message")
    
    # Vérifier si conversation_state est None, sinon initialiser à un état de conversation par défaut
    if conversation_state is None:
        conversation_state = {}

    current_question_key = conversation_state.get("state")
    next_question_key = None

    if current_question_key:
        current_question_data = question_generator.questions.get(current_question_key)
        if current_question_data:
            main_question = current_question_data.get("main_question")
            additional_question = current_question_data.get("additional_question")

            if user_response.strip().lower() == main_question.strip().lower():
                # Si la réponse de l'utilisateur correspond à la question principale, poser la question supplémentaire
                next_question = additional_question
            else:
                # Si la réponse de l'utilisateur est différente de la question principale, passer à la question suivante
                question_number = int(current_question_key.replace("question", ""))
                next_question_number = question_number + 1
                next_question_key = f"question{next_question_number}"
                next_question_data = question_generator.questions.get(next_question_key)
                if next_question_data:
                    next_question = next_question_data.get("main_question")
                    conversation_state["state"] = next_question_key
                else:
                    # Si toutes les questions ont été posées, la conversation est terminée
                    next_question = "Merci pour les informations. Votre CV est complet."
                    conversation_state = None
        else:
            # Si la clé de la question actuelle n'existe pas dans le dictionnaire, la conversation est interrompue
            next_question = "Une erreur est survenue. La conversation est interrompue."
            conversation_state = None
    else:
        # Si l'état de la conversation est absent, initialiser à la première question
        next_question_key = "question1"
        next_question_data = question_generator.questions.get(next_question_key)
        if next_question_data:
            next_question = next_question_data.get("main_question")
            conversation_state["state"] = next_question_key
        else:
            # Si la première question n'existe pas, la conversation est interrompue
            next_question = "Une erreur est survenue. La conversation est interrompue."
            conversation_state = None

    return jsonify({"response": next_question, "next_question_key": next_question_key, "conversation_state": conversation_state})

if __name__ == "__main__":
    app.run(debug=True)