from flask import Flask, request, jsonify
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow Cross-Origin Resource Sharing (CORS)

# Create a ChatBot instance
bot = ChatBot(
    "chatbot",
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
trainer.train("chatterbot.corpus.french")  # Train the chatbot in French

# Route for handling chat requests
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    response = str(bot.get_response(user_input))
    return jsonify({"response": response})

# Route for handling user profile data
@app.route("/profile", methods=["POST"])
def profile():
    data = request.json
    # Process and store user profile data
    # (e.g., name, experience, skills, contact info)
    # Save the data in your MongoDB database or a file
    return jsonify({"message": "User profile data saved successfully."})

if __name__ == "__main__":
    app.run(debug=True)
