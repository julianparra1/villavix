from flask import Flask, render_template, request, redirect, url_for, session, flash

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

@app.route("/")
def dashboard():
    if "username" in session:
        return f'Bienvenido, {session["username"]}! <a href="/logout">Cerrar sesión</a>'
    return redirect(url_for("login"))

@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)