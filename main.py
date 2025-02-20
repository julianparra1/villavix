from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("index.html")

@app.route('/luis')
def hello():
    return "<h1>Hola descompuse esto</h1>"