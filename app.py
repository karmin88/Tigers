import secrets

from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__, static_folder='static', template_folder='templates')

app.secret_key = secrets.token_hex(32)

# Database connection setup
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_DB'] = 'skig3013_project'

mysql = MySQL(app)
