from flask import render_template, flash, session
from app import app
from app import mysql


@app.route('/')
def index():
    login = False
    return render_template('public-dashboard.html', login=login)


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')


@app.route('/sign_up')
def sign_up():
    return render_template('signup.html')
