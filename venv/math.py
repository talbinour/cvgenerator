from chatterbot import ChatBot
bot=ChatBot("Math",logic_adapters=["chatterbot.logic.MathematicalEvaluation"])
while True:
    user_text=input("type the math equation that you want to solve:")
    print("Chatbot:" +str(bot.get_response(user_text)))