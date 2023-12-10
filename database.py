from app import mysql, app

insert_user = "INSERT INTO user (email, username, password, role) VALUES (%s, %s, %s, %s)"

query_user = "SELECT * FROM user WHERE email = %s"


def add_user(email=None, username=None, password=None, role=None):
    if email and username and password and role:
        conn = mysql.connection
        try:
            cur = conn.cursor()
            cur.execute(insert_user, (email, username, password, role))
            conn.commit()
            return True
        except Exception as e:
            print(e)
            conn.rollback()
    return False


def find_user(email=None):
    row = None
    if email:
        conn = mysql.connection
        try:
            cur = conn.cursor()
            cur.execute(query_user, (email,))
            row = cur.fetchone()
        except Exception as e:
            print(e)
            conn.rollback()
    return row

