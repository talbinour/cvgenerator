import json
import os
import re
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from python_question_generator import QuestionGenerator

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

question_generator = QuestionGenerator()

# Définir la classe QuestionGenerator avant de l'utiliser
class QuestionGenerator:
    def __init__(self):
        self.questions = []

    def load_questions(self, questions):
        self.questions = questions

    def generate_experience_questions(self, cv_content):
        # Liste de questions sur l'expérience
        experience_questions = []

        # Recherche de motifs spécifiques dans le texte du CV
        experience_keywords = ["expérience professionnelle", "poste", "entreprise"]

        # Recherche de chaque mot clé dans le contenu du CV
        for keyword in experience_keywords:
            matches = re.findall(keyword, cv_content, re.IGNORECASE)
            if matches:
                # Génération de questions spécifiques en fonction des mots clés trouvés
                if "expérience professionnelle" in keyword.lower():
                    question = "Pouvez-vous nous parler de votre expérience professionnelle ?"
                    experience_questions.append(question)
                elif "poste" in keyword.lower():
                    question = "Quels étaient vos postes précédents ?"
                    experience_questions.append(question)
                elif "entreprise" in keyword.lower():
                    question = "Dans quelles entreprises avez-vous travaillé auparavant ?"
                    experience_questions.append(question)

        return experience_questions

    def generate_education_questions(self, cv_content):
        # Liste de questions sur l'éducation
        education_questions = []

        # Recherche de motifs spécifiques dans le texte du CV
        education_keywords = ["formation", "diplôme", "établissement"]

        # Recherche de chaque mot clé dans le contenu du CV
        for keyword in education_keywords:
            matches = re.findall(keyword, cv_content, re.IGNORECASE)
            if matches:
                # Génération de questions spécifiques en fonction des mots clés trouvés
                if "formation" in keyword.lower():
                    question = "Pouvez-vous nous parler de votre formation ?"
                    education_questions.append(question)
                elif "diplôme" in keyword.lower():
                    question = "Quel(s) diplôme(s) avez-vous obtenu(s) ?"
                    education_questions.append(question)
                elif "établissement" in keyword.lower():
                    question = "Dans quel(s) établissement(s) avez-vous étudié ?"
                    education_questions.append(question)

        return education_questions

    def generate_skills_questions(self, cv_content):
        # Liste de questions sur les compétences
        skills_questions = []

        # Recherche de motifs spécifiques dans le texte du CV
        skills_keywords = ["compétences", "connaissances", "aptitudes"]

        # Recherche de chaque mot clé dans le contenu du CV
        for keyword in skills_keywords:
            matches = re.findall(keyword, cv_content, re.IGNORECASE)
            if matches:
                # Génération de questions spécifiques en fonction des mots clés trouvés
                if "compétences" in keyword.lower():
                    question = "Quelles sont vos compétences principales ?"
                    skills_questions.append(question)
                elif "connaissances" in keyword.lower():
                    question = "Quelles sont vos connaissances dans votre domaine d'expertise ?"
                    skills_questions.append(question)
                elif "aptitudes" in keyword.lower():
                    question = "Quelles sont vos aptitudes particulières ?"
                    skills_questions.append(question)

        return skills_questions


@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

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




@app.route("/extract-cv-title", methods=["POST"])
def get_cv_title():
    data = request.json
    cv_content = data.get("cv_content")
    # Implémentez la logique pour extraire le titre du CV à partir de son contenu
    # Remplacez cette logique par votre propre méthode de détection automatique du titre du CV
    title = "Titre du CV"
    return jsonify({"title": title})

def generate_next_question(next_question_key):
    # Code pour générer la prochaine question en fonction de next_question_key
    pass

@app.route("/new-question", methods=["POST"])
def generate_questions():
    data = request.json
    cv_title = data.get("cv_title")
    cv_content = data.get("cv_content")
    conversation_state = data.get("conversation_state")

    if not conversation_state:
        # État initial de la conversation
        next_question_key = 'start'
        bot_response = "Bonjour! Comment puis-je vous aider aujourd'hui ?"
    else:
        state = conversation_state.get('state')
        if state == 'start':
            # Retourner la première question
            next_question_key = 'question1'
            bot_response = "Quel est votre expérience professionnelle ?"
            # Supprimer la variable conversation_state après le message de bienvenue
            del data["conversation_state"]
        elif state.startswith('question'):
            # Gérer la réponse de l'utilisateur à la question actuelle
            user_response = data.get("message")  # Modification ici pour récupérer la réponse de l'utilisateur
            next_question_number = int(state.replace('question', '')) + 1
            next_question_key = f"question{next_question_number}"
            if user_response.lower() == "terminer" or next_question_key not in questions:
                bot_response = "Merci pour les informations. Votre CV est complet."
                conversation_state.clear()  # Effacer l'état de la conversation
            else:
                # Poser la question suivante
                bot_response = generate_next_question(next_question_key)  # Appeler une fonction pour générer la prochaine question
                next_question_key = next_question_key

    return jsonify({"response": bot_response, "next_question_key": next_question_key})

if __name__ == "__main__":
    app.run(debug=True)
