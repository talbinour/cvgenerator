from chatterbot import ChatBot
bot=ChatBot("Math",logic_adapters=["chatterbot.logic.UnitConversion"])
while True:
      user_text=input("Ask a question(unit conversion):")
      chatbot_response=str(bot.get_response(user_text))
      print(chatbot_response)