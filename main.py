from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta'  # Cambia esto a una clave secreta real

# Simulación de una base de datos de usuarios
usuarios = {
    'usuario1': 'contraseña1',
    'usuario2': 'contraseña2'
}

@app.route('/')
def home():
    return 'Página de inicio. <a href="/login">Iniciar sesión</a>'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in usuarios and usuarios[username] == password:
            session['username'] = username
            flash('Inicio de sesión exitoso', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Nombre de usuario o contraseña incorrectos', 'danger')
    
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return f'Bienvenido, {session["username"]}! <a href="/logout">Cerrar sesión</a>'
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('Has cerrado sesión', 'info')
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)