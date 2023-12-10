from functools import wraps

from flask import render_template, flash, request, session, redirect, url_for
from app import app
from database import find_user, insert_user, add_user


@app.before_request
def permanent_session():
    session.permanent = True


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('email', None):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def index():
    return render_template('public-dashboard.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        role = request.form.get('role')
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        user = find_user(email)
        if user:
            if remember:
                session['email'] = email
            else:
                session.pop('email', None)
            flash(f"Welcome back, user {user['username']}!", 'success')
            return render_template('public-dashboard.html')
    return render_template('login.html')


@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        retype_password = request.form.get('retype-password')
        role = request.form.get('role')
        if password != retype_password:
            flash('Passwords do not match.', 'danger')
            return render_template('signup.html')
        user = find_user(email)
        if user:
            flash('Email already registered.', 'danger')
        else:
            if add_user(email, username, password, role):
                flash('User successfully registered.', 'success')
                return render_template('login.html')
            else:
                flash('Unexpected error has occurred. Please try again.', 'danger')
    return render_template('signup.html')
