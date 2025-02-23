from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "Dubidubidabadaba"

# Iba a hacer una base de datos pero olvide cual vamos a usar.
usuarios = {
    "Luis": "Matematicas",
    "Adrian": "Fisica",
    "Julian": "Computologia"
}

@app.route("/login", methods=["GET", "POST"])
def login():
    checker = False
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        
        if username in usuarios and usuarios[username] == password:
            session["username"] = username
            return redirect(url_for("dashboard"))
        else:
            checker = True
    
    return render_template("login.html", checker=checker)

# Quizas sea mejor crear una nueva zona "home" y enviarlos si tienen sesion iniciada

@app.route("/")
def dashboard():
    if "username" in session:
        return f'Bienvenido, {session["username"]}! <a href="/logout">Cerrar sesión</a>'
    return redirect(url_for("login"))

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        checker = False
        username = request.form["username"]
        password = request.form["password"]
        if username in usuarios:
            checker = True
        else:
            usuarios[username] = password
            return redirect(url_for("login"))
        
    else:
        checker = False
    return render_template("register.html", checker=checker)

@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)