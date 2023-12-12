from app import mysql

insert_user = "INSERT INTO user (email, username, password, role) VALUES (%s, %s, %s, %s)"

query_user = "SELECT * FROM user WHERE email = %s"

insert_note = "INSERT INTO note (chapter, user_id) VALUES (%s, %s)"

insert_note_section = "INSERT INTO note_section (section, title, description, note_id) VALUES (%s, %s, %s, %s)"

insert_section_file = "INSERT INTO section_file (uuid_filename, original_filename, section_id) VALUES (%s, %s, %s)"

auto_increment_query = """
SELECT `AUTO_INCREMENT`
FROM  INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = '%s'
AND   TABLE_NAME   = '%s';
"""


def execute_statement(statement, *args):
    if statement and args:
        conn = mysql.connection
        try:
            cur = conn.cursor()
            cur.execute(statement, args)
            conn.commit()
            return cur.lastrowid
        except Exception as e:
            print(e)
            conn.rollback()
    return None


def execute_query(query, *args):
    if query and args:
        conn = mysql.connection
        try:
            cur = conn.cursor()
            cur.execute(query, args)
            return cur.fetchone()
        except Exception as e:
            print(e)
            conn.rollback()
    return None


def get_table_increment(schema=None, name=None):
    return execute_query(auto_increment_query, schema, name)


def add_note(chapter, user_id):
    if chapter and user_id:
        return execute_statement(insert_note, chapter, user_id)


def add_note_section(section, title, description, note_id):
    print(section,title,description,note_id)
    if section and title and description and note_id:
        return execute_statement(insert_note_section, section, title, description, note_id)


def add_section_file(uuid_filename, original_filename, section_id):
    if uuid_filename and original_filename and section_id:
        return execute_statement(insert_section_file, uuid_filename, original_filename, section_id)


def add_user(email=None, username=None, password=None, role=None):
    if email and username and password and role:
        return execute_statement(insert_user, email, username, password, role)


def find_user(email=None):
    if email:
        return execute_query(query_user, email)
