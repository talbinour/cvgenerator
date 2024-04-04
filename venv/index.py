from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer,ChatterBotCorpusTrainer
import time

#chattrebot
#chattrebot-corpus
#pyyam!
#spacy #python -mspacy download en
#jupyter
#motebook
#pint
# Create a ChatBot instance
bot = ChatBot(
    "chatbot",
    read_only=False,
    logic_adapters=[
        {
            
            "import_path":"chatterbot.logic.BestMatch",
            "default_response":"Sorry I dont have an answer",
            "maximun_similarity_threshold":0.9
            }
        ]
)

trainer=ChatterBotCorpusTrainer(bot)
trainer.train("chatterbot.corpus.english")
# Interaction loop
while True:
    user_input = input("You: ")
    start_time = time.perf_counter()  # Start measuring time
    response = str(bot.get_response(user_input))
    end_time = time.perf_counter()  # Stop measuring time
    print("ChatBot:", response)
    print("Response time:", end_time - start_time, "seconds")
