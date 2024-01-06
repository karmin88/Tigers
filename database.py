import json

from app import mysql

insert_user = "INSERT INTO user (email, username, password, role) VALUES (%s, %s, %s, %s)"

query_user = "SELECT * FROM user WHERE email = %s OR id = %s"

insert_note = "INSERT INTO note (chapter, user_id) VALUES (%s, %s)"

query_note = """
SELECT
    note.id,
    note.chapter,
    note.uploaded_date,
    note.user_id,
    user.username as username,
    profile.profession,
    profile.address,
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
JOIN
    profile ON note.user_id = profile.user_id
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
WHERE TABLE_SCHEMA = %s
AND   TABLE_NAME   = %s;
"""

query_all_avatars = "SELECT * FROM avatar"

query_profile = """
SELECT
    p.*,
    a.*,
    u.role,
    u.username
FROM
    profile p
JOIN
    avatar a ON a.id = p.avatar_id
JOIN
    user u ON u.id = p.user_id
WHERE
    p.user_id = %s;
"""

create_profile_stmt = "INSERT INTO profile user_id = %s"

edit_profile = "UPDATE profile SET {column} = %s WHERE user_id = %s"

insert_experience = "INSERT INTO experience (image_url, title, description, user_id) VALUES (%s, %s, %s, %s)"

insert_tag = "INSERT INTO experience_tag (tag, experience_id) VALUES (%s, %s)"

query_experience = """
SELECT
    e.id AS id,
    e.image_url,
    e.title,
    DATE_FORMAT(e.date, '%%a, %%b %%D %%Y') AS formatted_date,
    e.description,
    CONCAT('[', GROUP_CONCAT('"', et.tag, '"'), ']') AS tags,
    u.username  -- Add the username field
FROM
    experience e
LEFT JOIN
    experience_tag et ON e.id = et.experience_id
LEFT JOIN
    user u ON e.user_id = u.id 
WHERE
    e.user_id = %s
GROUP BY
    e.id;
"""

delete_experience_stmt = "DELETE FROM experience WHERE id = %s"


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
    return execute_query(auto_increment_query, False, schema, name)['AUTO_INCREMENT']


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
    user_id = get_table_increment('skig3013_project', 'user')
    if email and username and password and role:
        return execute_statement(insert_user, email, username, password, role) and execute_statement(
            create_profile_stmt, user_id)


def find_user(email='', id=''):
    if email != '' or id != '':
        return execute_query(query_user, False, email, id)


def get_avatar(id=None):
    if not id:
        return execute_query(query_all_avatars, True)


def get_profile(id=None):
    if id:
        return execute_query(query_profile, False, id)


def set_profile(id=None, column=None, value=None):
    if id and column and value:
        return execute_statement(edit_profile.format(column=column), value, id)


def add_experience(image_url=None, title=None, description=None, user_id=None):
    if image_url and title and description:
        return execute_statement(insert_experience, image_url, title, description, user_id)


def add_tag(tag=None, experience_id=None):
    if tag and experience_id:
        return execute_statement(insert_tag, tag, experience_id)


def get_experience(user_id=None):
    if user_id:
        results = execute_query(query_experience, True, user_id)
        for row in results:
            row['tags'] = json.loads(row['tags'])
        return results


def delete_experience(id=None):
    if id:
        return execute_statement(delete_experience_stmt, id)
