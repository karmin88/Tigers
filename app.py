from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
from flask_login import current_user
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
# Database configuration (update with your details)
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'quiz'
}


@app.route('/base')
def entry():
    login = True
    return render_template('base.html', login=login)



@app.route("/")
def sd():
    return render_template('teacherdashboard.html')

def get_student_quizzes(sort_by):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    sort_query = "title" if sort_by != "questions" else "question_count"
    user_id = current_user.id

    cursor.execute(f"""
        SELECT qz.id, qz.title, COUNT(qs.id) AS question_count, 
               COALESCE(sp.progress, 0) AS progress
        FROM quizzes qz
        LEFT JOIN questions qs ON qz.id = qs.quiz_id
        LEFT JOIN student_progress sp ON qz.id = sp.quiz_id AND sp.student_id = %s
        GROUP BY qz.id
        ORDER BY {sort_query}
    """, (user_id,))
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return quizzes

@app.route("/studentquizdashboard", defaults={'sort_by': 'title'})
@app.route("/studentquizdashboard/<sort_by>")
def student_quiz_dashboard(sort_by):
    quizzes = get_student_quizzes(sort_by)
    return render_template('studentquizdashboard.html', quizzes=quizzes, sort_by=sort_by)


def get_quizzes(sort_by):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    sort_query = "title" if sort_by != "questions" else "question_count"
    cursor.execute(f"""
        SELECT qz.id, qz.title, COUNT(qs.id) AS question_count
        FROM quizzes qz
        LEFT JOIN questions qs ON qz.id = qs.quiz_id
        GROUP BY qz.id
        ORDER BY {sort_query}
    """)
    quizzes = cursor.fetchall()
    cursor.close()
    conn.close()
    return quizzes


@app.route("/teacherquizdashboard", defaults={'sort_by': 'title'})
@app.route("/teacherquizdashboard/<sort_by>")
def teacher_quiz_dashboard(sort_by):
    quizzes = get_quizzes(sort_by)
    return render_template('teacherquizdashboard.html', quizzes=quizzes, sort_by=sort_by)


@app.route("/delete_quizdashboard", defaults={'sort_by': 'title'})
@app.route("/delete_quizdashboard/<sort_by>")
def delete_quiz_dashboard(sort_by):
    quizzes = get_quizzes(sort_by)
    return render_template('deletequizdashboard.html', quizzes=quizzes, sort_by=sort_by)


@app.route("/edit_quizdashboard", defaults={'sort_by': 'title'})
@app.route("/edit_quizdashboard/<sort_by>")
def edit_quiz_dashboard(sort_by):
    quizzes = get_quizzes(sort_by)
    return render_template('editquizdashboard.html', quizzes=quizzes, sort_by=sort_by)


@app.route('/add_quiz', methods=['GET', 'POST'])
def add_quiz():
    if request.method == 'POST':
        title = request.form['title']
        question_count = int(request.form['question_count'])

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("INSERT INTO quizzes (title) VALUES (%s)", (title,))
        quiz_id = cursor.lastrowid

        conn.commit()
        cursor.close()
        conn.close()

        return redirect(url_for('add_questions', quiz_id=quiz_id, question_count=question_count))

    return render_template('add_quiz.html')


@app.route('/add_questions', methods=['GET', 'POST'])
def add_questions():
    quiz_id = request.args.get('quiz_id', type=int)
    question_count = request.args.get('question_count', type=int)

    if request.method == 'POST' and quiz_id and question_count:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        for i in range(question_count):
            question_text = request.form[f'question_text_{i}']
            option_a = request.form[f'option_a_{i}']
            option_b = request.form[f'option_b_{i}']
            option_c = request.form[f'option_c_{i}']
            option_d = request.form[f'option_d_{i}']
            correct_answer = request.form[f'correct_answer_{i}']

            cursor.execute("""
                INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer))

        conn.commit()
        cursor.close()
        conn.close()

        flash("Questions added successfully!", "success")
        return redirect(url_for('teacher_quiz_dashboard', success='true'))

    elif request.method == 'GET' and quiz_id is not None and question_count is not None:
        return render_template('add_questions.html', quiz_id=quiz_id, question_count=question_count)

    return 'Invalid request method or missing parameters'


@app.route('/edit_quiz/<int:quiz_id>', methods=['GET', 'POST'])
def edit_quiz(quiz_id):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':

        new_title = request.form['title']
        cursor.execute("UPDATE quizzes SET title = %s WHERE id = %s", (new_title, quiz_id))

        for question_id in request.form.getlist('question_ids'):
            question_text = request.form[f'question_text_{question_id}']
            option_a = request.form[f'option_a_{question_id}']
            option_b = request.form[f'option_b_{question_id}']
            option_c = request.form[f'option_c_{question_id}']
            option_d = request.form[f'option_d_{question_id}']
            correct_answer = request.form[f'correct_answer_{question_id}']

            cursor.execute("""
                UPDATE questions SET
                question_text = %s, 
                option_a = %s, 
                option_b = %s, 
                option_c = %s, 
                option_d = %s, 
                correct_answer = %s
                WHERE id = %s
            """, (question_text, option_a, option_b, option_c, option_d, correct_answer, question_id))

        conn.commit()
        cursor.close()
        conn.close()
        flash("Quiz updated successfully!", "success")
        return redirect(url_for('edit_quiz_dashboard'))

    try:
        cursor.execute("SELECT id, title FROM quizzes WHERE id = %s", (quiz_id,))
        quiz = cursor.fetchone()

        if not quiz:
            cursor.close()
            conn.close()
            return "Quiz not found", 404

        cursor.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
        questions = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return render_template('editquiz.html', quiz=quiz, questions=questions)


@app.route('/delete_quiz/<int:quiz_id>', methods=['POST'])
def delete_quiz(quiz_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM quizzes WHERE id = %s", (quiz_id,))
        conn.commit()
        flash("Quiz successfully deleted!", "success")
    except Exception as e:
        flash("An error occurred: " + str(e), "danger")
    finally:
        cursor.close()
        conn.close()

    return redirect(url_for('delete_quiz_dashboard'))


if __name__ == '__main__':
    app.run()
