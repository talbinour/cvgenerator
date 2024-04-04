from flask import Flask, request, jsonify
from flask_cors import CORS
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.storage import MongoDatabaseAdapter

app = Flask(__name__)
CORS(app)  # Activer CORS pour tous les domaines


# Create a ChatBot instance
bot = ChatBot(
    "chatbot",
    storage_adapter="chatterbot.storage.MongoDatabaseAdapter",
    database_uri="mongodb://localhost:27017/database",
    logic_adapters=[
        {
            "import_path": "chatterbot.logic.BestMatch",
            "default_response": "Désolé, je n'ai pas de réponse.",
            "maximum_similarity_threshold": 0.9
        }
    ]
)

# Train the chatbot
trainer = ChatterBotCorpusTrainer(bot)
trainer.train("chatterbot.corpus.english")

# Route for handling chat requests
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    response = str(bot.get_response(user_input))
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
