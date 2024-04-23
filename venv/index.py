import os
import json
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

# Function to load and train from custom JSON
def train_from_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        trainer = ListTrainer(bot)
        for entry in data:
            if "patterns" in entry and "responses" in entry:
                for pattern in entry["patterns"]:
                    for response in entry["responses"]:
                        trainer.train([pattern, response])

# Train from the provided conversations.json
train_from_json("conversations.json")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message") # type: ignore
    response = str(bot.get_response(user_input))
    return jsonify({"response": response})

@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    # Implement actual profile handling here
    return jsonify({"message": "User profile data saved successfully."})

if __name__ == "__main__":
    app.run(debug=True)