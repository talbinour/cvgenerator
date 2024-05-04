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
    # user_profile = db.profiles.insert_one(data)
    return jsonify({"message": "Données du profil utilisateur enregistrées avec succès."})


@app.route("/save-response", methods=["POST"])
def save_response():
    data = request.json
    # Implémentez ici la logique pour enregistrer la réponse dans un fichier ou une base de données
    return jsonify({"message": "Réponse enregistrée avec succès."})











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
        return contact_questions

    def generate_education_questions(self, cv_content):
        education_questions = [
            "Où avez-vous étudié ?",
            "Quel est le nom de votre école/université ?",
            "Pouvez-vous préciser la période de temps de vos études ?"
        ]
        return education_questions

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
        return experience_professionnelle_questions
    def generate_skills_questions(self, cv_content):
        competence_questions = [
            "Quelles compétences avez-vous et à quel niveau ?"
        ]
        return competence_questions

    def generate_interests_questions(self, cv_content):
        centre_interet_questions = [
            "Quels sont vos centres d'intérêt ?"
        ]
        return centre_interet_questions
    
    def generate_languages_questions(self, cv_content):
        langue_questions = [
            "Quelles langues parlez-vous et à quel niveau ?"
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
        return formation_questions

# Charger les questions pour question_generator
# Charger les questions pour question_generator
question_generator = QuestionGenerator()
question_generator.load_questions({
    "question1": question_generator.generate_contact_questions(None),  # Passer None pour cv_content
    "question2": question_generator.generate_education_questions(None),  # Passer None pour cv_content
    "question3": question_generator.generate_languages_questions(None),  # Passer None pour cv_content
    "question4": question_generator.generate_profile_questions(None),  # Passer None pour cv_content
    "question5": question_generator.generate_experience_questions(None),  # Passer None pour cv_content
    "question6": question_generator.generate_skills_questions(None),  # Passer None pour cv_content
    "question7": question_generator.generate_interests_questions(None),  # Passer None pour cv_content
    "question8": question_generator.generate_formation_questions(None),  # Passer None pour cv_content
    "question9":""
    # Ajoutez d'autres questions ici...
})



@app.route("/new-question", methods=["POST"])
def generate_next_question_route():
    data = request.json
    conversation_state = data.get("conversation_state") # type: ignore
    user_response = data.get("message") # type: ignore
    
    # Vérifier si conversation_state est None, sinon initialiser à un état de conversation par défaut
    if conversation_state is None:
        conversation_state = {}

    current_question_key = conversation_state.get("state")
    next_question_key = None

    if current_question_key:
        current_question = question_generator.questions.get(current_question_key)
        if current_question:
            if user_response and user_response.strip().lower() == current_question.strip().lower():
                # Si la réponse de l'utilisateur est la même que la question actuelle, répéter la question
                return jsonify({"response": current_question, "next_question_key": current_question_key, "conversation_state": conversation_state})
            else:
                # Si la réponse de l'utilisateur est différente de la question actuelle, passer à la question suivante
                question_number = int(current_question_key.replace("question", ""))
                next_question_number = question_number + 1
                next_question_key = f"question{next_question_number}"
                if next_question_key in question_generator.questions:
                    next_question = question_generator.questions.get(next_question_key)
                    conversation_state["state"] = next_question_key
                    return jsonify({"response": next_question, "next_question_key": next_question_key, "conversation_state": conversation_state})
                else:
                    # Si toutes les questions ont été posées, la conversation est terminée
                    return jsonify({"response": "Merci pour les informations. Votre CV est complet.", "next_question_key": None, "conversation_state": None})
        else:
            # Si la clé de la question actuelle n'existe pas dans le dictionnaire, la conversation est interrompue
            return jsonify({"response": "Une erreur est survenue. La conversation est interrompue.", "next_question_key": None, "conversation_state": None})
    
    else:
        # Si l'état de la conversation est absent, initialiser à la première question
        next_question_key = "question1"
        next_question = question_generator.questions.get(next_question_key)
        conversation_state["state"] = next_question_key
        return jsonify({"response": next_question, "next_question_key": next_question_key, "conversation_state": conversation_state})

if __name__ == "__main__":
    app.run(debug=True)