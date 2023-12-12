import os
from functools import wraps
from pathlib import Path
from uuid import uuid4

from flask import render_template, flash, request, session, redirect, url_for
from werkzeug.utils import secure_filename

from app import app
from database import find_user, add_user, add_note, add_note_section, add_section_file


def login_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = session.get('user', None)
            if user:
                user_role = user['role']
                if user and user_role == role:
                    return f(*args, **kwargs)
            return redirect(url_for('login'))

        return decorated_function

    return decorator


@app.before_request
def before_request():
    session.modified = True


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route('/')
def index():
    if not session.permanent:
        session.pop('user', None)
    return render_template('public-dashboard.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if not session.permanent:
        session.pop('user', None)
    if request.method == 'POST':
        role = request.form.get('role')
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        user = find_user(email)
        if user and user['role'] == role and user['password'] == password:
            for key in ['password', 'created_date']:
                user.pop(key, None)
            session['user'] = user
            session.permanent = remember
            flash(f"Welcome back, user {user['username']}!", 'success')
            route = f"{role}_dashboard"
            return redirect(url_for(route))
        else:
            flash('Login credentials were not correct!', 'danger')
    return render_template('login.html')


@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    if not session.permanent:
        session.pop('user', None)
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


@app.route('/teacher_dashboard')
@login_required(role='teacher')
def teacher_dashboard():
    user = session.get('user', None)
    return render_template('teacher-dashboard.html', user=user)


@app.route('/student_dashboard')
@login_required(role='student')
def student_dashboard():
    user = session.get('user', None)
    return render_template('student-dashboard.html', user=user)


@app.route('/teacher_note', methods=['GET', 'POST'])
@login_required(role='teacher')
def teacher_note():
    user = session.get('user', None)
    if request.method == 'POST':
        total_sections = request.form['total_section']
        chapter = request.form['chapter']
        note_id = add_note(chapter, user['id'])

        for i in range(int(total_sections)):
            section_data = request.form.getlist(f's{i + 1}_data')
            title = section_data[0]
            description = section_data[1]
            section_id = add_note_section(i + 1, title, description, note_id)

            for file in request.files.getlist(f's{i + 1}_files'):
                if allowed_file(file.filename):
                    original_filename = secure_filename(file.filename)
                    unique_filename = make_unique(original_filename)
                    user_dir = f"user_{session.get('user')['id']}"
                    Path(f"{app.config['UPLOAD_FOLDER']}/{user_dir}").mkdir(exist_ok=True)
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], user_dir, unique_filename))
                    add_section_file(unique_filename, original_filename, section_id)
    return render_template('add-note.html', user=user)


@app.route('/student_note')
@login_required(role='student')
def student_note():
    user = session.get('user', None)
    return render_template('all-notes.html', user=user)


def make_unique(string):
    ident = uuid4().__str__()
    return f"{ident}-{string}"


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']
