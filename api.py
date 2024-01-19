import json
import os
from functools import wraps
from pathlib import Path
from uuid import uuid4

from flask import render_template, flash, request, session, redirect, url_for, send_from_directory
from flask_minify import Minify, decorators as minify_decorators
from sympy import symbols, solve
from werkzeug.utils import secure_filename

import database as db
from app import app

Minify(app=app, passive=True)


def login_required(role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = session.get('user', None)
            session['intended_url'] = request.url
            if user:
                if role:
                    if role == user['role']:
                        return f(*args, **kwargs)
                    else:
                        flash('You do not have the required role to access this page.', 'danger')
                        return redirect(url_for('index'))
                return f(*args, **kwargs)
            else:
                return redirect(url_for('login'))

        return decorated_function

    return decorator


@app.before_request
def before_request():
    session.modified = True


@app.route('/logout')
@minify_decorators.minify(html=True, js=True, cssless=True)
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))


@app.route('/')
@minify_decorators.minify(html=True, js=True, cssless=True)
def index():
    user = session.get('user', None)
    session.pop('intended_url', None)
    total = db.get_tables_length()
    return render_template('public-dashboard.html', user=user, total=total)


@app.route('/login', methods=['GET', 'POST'])
@minify_decorators.minify(html=True, js=True, cssless=True)
def login():
    if not session.permanent:
        session.pop('user', None)
    if request.method == 'POST':
        role = request.form.get('role')
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember')
        user = db.find_user(email)
        if user and user['role'] == role and user['password'] == password:
            for key in ['password', 'created_date']:
                user.pop(key, None)
            session['user'] = user
            intended_url = session.pop('intended_url', None)
            session.permanent = remember
            if remember: app.config['PERMANENT_SESSION_LIFETIME'] = 1200
            flash(f"Selamat datang, pengguna {user['username']}!", 'success')
            return redirect(intended_url) if intended_url else redirect(url_for('index'))
        else:
            flash('Kelayakan log masuk tidak betul!', 'danger')
    return render_template('login.html')


@app.route('/sign_up', methods=['GET', 'POST'])
@minify_decorators.minify(html=True, js=True, cssless=True)
def sign_up():
    if not session.permanent:
        session.pop('user', None)
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        role = request.form.get('role')
        user = db.find_user(email)
        if user:
            flash('Emel sudah didaftarkan.', 'danger')
        else:
            if db.add_user(email, username, password, role):
                flash('Anda telah berjaya mendaftar.', 'success')
                return redirect(url_for('login'))
            else:
                flash('Ralat yang tidak dijangka telah berlaku. Sila cuba lagi.', 'danger')
    return render_template('signup.html', signup=True)


@app.route('/add_note', methods=['GET', 'POST'])
@login_required(role='teacher')
def add_note():
    user = session.get('user', None)
    if request.method == 'POST':
        total_sections = request.form['total_section']
        title = request.form['title']
        chapter = request.form['chapter']
        note_id = db.add_note(chapter, title, user['id'])
        for i in range(int(total_sections)):
            section_data = request.form.getlist(f's{i + 1}_data')
            title = section_data[0]
            description = section_data[1]
            section_id = db.add_note_section(i + 1, title, description, note_id)

            for file in request.files.getlist(f's{i + 1}_files'):
                if allowed_file(file.filename):
                    original_filename = secure_filename(file.filename)
                    unique_filename = make_unique(original_filename)
                    user_dir = f"user_{session.get('user')['id']}"
                    Path(f"{'notes'}/{user_dir}").mkdir(exist_ok=True)
                    file.save(os.path.join('notes', user_dir, unique_filename))
                    db.add_section_file(unique_filename, original_filename, section_id)
    return render_template('add-note.html', user=user)


@app.route('/list_note')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def list_note():
    user = session.get('user', None)
    return render_template('list-notes.html', user=user, notes=db.get_notes())


@app.route('/view_note/<int:note_id>')
@app.route('/view_note/<int:section_no>/<int:note_id>')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def view_note(section_no=None, note_id=None):
    user = session.get('user', None)
    note = db.get_notes(id=note_id)
    list_section_files = {}
    for section_id in note['section_ids']:
        sections_files = db.get_section_files(section_id)
        list_section_files[section_id] = [[f['uuid_filename'] for f in sections_files],
                                          [f['original_filename'] for f in sections_files]]
    return render_template('note.html', user=user, note=db.get_notes(id=note_id), section_no=section_no,
                           sections_files=list_section_files)


@app.route('/request_file/<folder>/<string:uploader_id>/<string:filename>')
@login_required()
def request_file(folder, uploader_id, filename):
    return send_from_directory(os.path.join(folder, f"user_{uploader_id}"), filename)


@app.route('/profile/<string:user_id>')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def profile(user_id=None):
    current_user = session.get('user', None)
    target_user = db.find_user(id=user_id)
    avatars = db.get_avatar()
    profile = db.get_profile(user_id)
    experiences = db.get_experience(user_id)
    return render_template('profile.html', user=current_user, profile_user=target_user,  avatars=avatars, profile=profile,
                           experiences=experiences)


@app.route('/edit_profile', methods=['POST'])
@login_required()
def edit_profile():
    user = session.get('user', None)
    data = request.form.to_dict().popitem()
    type = data[0]
    value = data[1]
    db.set_profile(user['id'], type, value)
    return 'success'


@app.route('/new_experience', methods=['POST'])
@login_required('teacher')
def new_experience():
    user = session.get('user', None)
    image_url = request.form.get('image_url')
    title = request.form.get('title')
    description = request.form.get('description')
    tags = request.form.getlist('tag')
    experience_id = db.get_table_increment('skig3013_project', 'experience')
    db.add_experience(image_url, title, description, user['id'])
    for tag in tags:
        db.add_tag(tag, experience_id)
    return 'success'


@app.route('/remove_experience', methods=['POST'])
def remove_experience():
    db.delete_experience(request.form.get('id'))
    return 'success'


@app.route('/add_quiz', methods=['GET', 'POST'])
@login_required('teacher')
def add_quiz():
    user = session.get('user', None)
    if request.method == 'POST':
        total_ques = request.form['total-ques']
        title = request.form['title']
        chapter = request.form['chapter']
        quiz_id = db.add_quiz(chapter, title, user['id'])
        for i in range(int(total_ques)):
            question_data = json.loads(request.form[f'q{i}_data'])
            file = request.files.get(f'q{i}_file', None)
            unique_filename = None
            if file and allowed_file(file.filename):
                original_filename = secure_filename(file.filename)
                unique_filename = make_unique(original_filename)
                user_dir = f"user_{session.get('user')['id']}"
                Path(f"quiz/{user_dir}").mkdir(exist_ok=True)
                file.save(os.path.join('quiz', user_dir, unique_filename))
            db.add_question(question_data['question'], json.dumps(question_data['option[]']), question_data['answer'],
                            quiz_id, unique_filename)
    return render_template('add-quiz.html', user=user)


@app.route('/note/<num>')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def note(num):
    user = session.get('user', None)
    return render_template(f'note{num}.html', user=user)


def make_unique(string):
    ident = uuid4().__str__()
    return f"{ident}-{string}"


@app.route('/list_quiz')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def list_quiz():
    user = session.get('user', None)
    quizzes = db.get_quiz()
    return render_template('list_quiz.html', user=user, quizzes=quizzes)


@app.route('/memo')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def memo():
    user = session.get('user', None)
    return render_template('memo.html', user=user)


@app.route('/view_quiz/<id>')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def view_quiz(id):
    user = session.get('user', None)
    quiz = db.get_quiz(id)[0]
    questions_str = quiz['questions']
    questions_list = json.loads('[' + questions_str + ']')

    for question in questions_list:
        options_str = question['options'][0]  # Extract options string
        options_list = json.loads(options_str)  # Convert options string to list
        question['options'] = options_list

    quiz['questions'] = questions_list
    return render_template('quiz.html', user=user, quiz=quiz)


@app.route('/quiz/<num>')
@minify_decorators.minify(html=True, js=True, cssless=True)
@login_required()
def quiz(num):
    user = session.get('user', None)
    return render_template(f'quiz{num}.html', user=user)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


from latex2sympy2 import latex2sympy
import sympy as sym


@app.route('/get_math_expr/', methods=['GET'])
def get_math_expr():
    try:
        x = symbols('x')
        latex = request.args.get('latex')
        result = latex2sympy(latex)
        xIntercept = str(sym.latex(solve(result, x)))
        yIntercept = str(sym.latex(result.subs(x, 0)))
        return json.dumps(
            {'success': True, 'result': str(result).replace('**', '^'), 'yIntercept': yIntercept,
             'xIntercept': xIntercept})
    except Exception as e:
        return json.dumps({'success': True, 'error': str(e)})
