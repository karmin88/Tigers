from app import mysql

insert_user = "INSERT INTO user (email, username, password, role) VALUES (%s, %s, %s, %s)"

query_user = "SELECT * FROM user WHERE email = %s"

insert_note = "INSERT INTO note (chapter, user_id) VALUES (%s, %s)"

query_note = """
SELECT
    note.id,
    note.chapter,
    note.uploaded_date,
    note.user_id,
    user.username,
    GROUP_CONCAT(note_section.id SEPARATOR '|') AS section_ids,
    GROUP_CONCAT(note_section.section SEPARATOR '|') AS sections,
    GROUP_CONCAT(note_section.title SEPARATOR '|') AS section_titles,
    GROUP_CONCAT(note_section.description SEPARATOR '|') AS section_descriptions
FROM
    note
JOIN
    note_section ON note.id = note_section.note_id
JOIN
    user ON note.user_id = user.id
{}
GROUP BY
    note.id;
"""

query_sections_files = "SELECT * FROM section_file WHERE section_id = %s"

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
            conn.rollback()
            raise e
    return None


def execute_query(query, all=False, *args):
    if query:
        conn = mysql.connection
        try:
            cur = conn.cursor()
            if args:
                cur.execute(query, args)
            else:
                cur.execute(query)
            return cur.fetchone() if not all else cur.fetchall()
        except Exception as e:
            conn.rollback()
            raise e
    return None


def get_table_increment(schema=None, name=None):
    return execute_query(auto_increment_query, schema, name)


def add_note(chapter, user_id):
    if chapter and user_id:
        return execute_statement(insert_note, chapter, user_id)


def get_notes(id=None):
    if id:
        note = execute_query(query_note.format(f"WHERE note.id = {id}"), False)
        note['section_ids'] = note['section_ids'].split('|')
        note['sections'] = note['sections'].split('|')
        note['section_titles'] = note['section_titles'].split('|')
        note['section_descriptions'] = note['section_descriptions'].split('|')
        return note
    else:
        notes = execute_query(query_note.format(""), True)
        for note in notes:
            note['section_ids'] = note['section_ids'].split('|')
            note['sections'] = note['sections'].split('|')
            note['section_titles'] = note['section_titles'].split('|')
            note['section_descriptions'] = note['section_descriptions'].split('|')
        return notes


def add_note_section(section, title, description, note_id):
    if section and title and description and note_id:
        return execute_statement(insert_note_section, section, title, description, note_id)


def add_section_file(uuid_filename, original_filename, section_id):
    if uuid_filename and original_filename and section_id:
        return execute_statement(insert_section_file, uuid_filename, original_filename, section_id)


def get_section_files(id):
    if id:
        return execute_query(query_sections_files, True, id)


def add_user(email=None, username=None, password=None, role=None):
    if email and username and password and role:
        return execute_statement(insert_user, email, username, password, role)


def find_user(email=None):
    if email:
        return execute_query(query_user, False, email)
