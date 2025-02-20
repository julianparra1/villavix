from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, this is my first web</p>"
    return "<p><i>Hello, this is my first web</i></p>"