# Acesse: http://127.0.0.1:5000
# Não é obrigatório para a apresentação — o jogo funciona estático.

from flask import Flask, jsonify, send_from_directory, request
import os

app = Flask(__name__, static_folder='.', static_url_path='')

DATASET = {
    "animais": [
        {"emoji": "🐶", "palavra": "cachorro"},
        {"emoji": "🐱", "palavra": "gato"},
        {"emoji": "🦁", "palavra": "leão"},
        {"emoji": "🐮", "palavra": "vaca"},
        {"emoji": "🐰", "palavra": "coelho"},
        {"emoji": "🐸", "palavra": "sapo"},
    ],
    "frutas": [
        {"emoji": "🍎", "palavra": "maçã"},
        {"emoji": "🍌", "palavra": "banana"},
        {"emoji": "🍇", "palavra": "uva"},
        {"emoji": "🍊", "palavra": "laranja"},
        {"emoji": "🍍", "palavra": "abacaxi"},
        {"emoji": "🍉", "palavra": "melancia"},
    ],
}

@app.get('/')
def home():
    return send_from_directory('.', 'index.html')

@app.get('/api/palavras')
def palavras():
    tema = request.args.get('tema', 'animais')
    fase = int(request.args.get('fase', '1'))
    data = DATASET.get(tema, DATASET["animais"])
    return jsonify({"tema": tema, "fase": fase, "itens": data})

if __name__ == '__main__':
    app.run(debug=True)
