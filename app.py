from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def start():
    return render_template("start.html")

@app.route('/game')
def game():
    return render_template("game.html")

@app.route('/gameover')
def submit():
    score = request.args.get('score', -1)
    return render_template("gameover.html", score=score)    

if __name__ == '__main__':
    app.run(debug=True)
    
    