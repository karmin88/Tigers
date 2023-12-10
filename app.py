from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    login = False
    return render_template('public-dashboard.html', login=login)


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/sign_up')
def sign_up():
    return render_template('signup.html')


if __name__ == '__main__':
    app.run()
