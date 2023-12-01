from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def entry():
    login = True
    return render_template('base.html', login=login)


if __name__ == '__main__':
    app.run()
