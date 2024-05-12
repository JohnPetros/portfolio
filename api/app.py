from smtplib import SMTP
from email.message import Message
from datetime import date

from flask import Flask, render_template, url_for, request


app = Flask(__name__)


@app.template_global("get_file")
def get_file(file_path):
    return url_for("static", filename=file_path)


@app.route("/email", methods=["POST"])
def send_email():
    email = request.form.get("email")
    body = request.form.get("body")

    if not email or not body:
        return

    try:
        message = Message()
        message["Subject"] = "Contato do Portifólio 🐼"
        message["From"] = email
        message["To"] = "joaopcarvalho.cds@gmail.com"
        message.add_header("Content-Type", "text/html")
        message.set_payload(f"<p>{body}</p>")
        password = "ggxdpqdbllijoymj"

        smtp = SMTP("smtp.gmail.com: 587")
        smtp.starttls()
        smtp.login(message["From"], password)
        smtp.sendmail(
            message["From"], [message["To"]], message.as_string().encode("utf-8")
        )
        return render_template(
            "components/toast.html",
            message="Seu e-mail foi enviado com sucesso 😁",
            category="success",
        )

    except Exception as exception:
        print(exception)
        return render_template(
            "components/toast.html",
            message="Infelizmente não foi possível enviar seu e-mail 😢",
            category="error",
        )


@app.route("/")
def home():
    return render_template("pages/home/index.html")


@app.route("/projects")
def projects():
    return render_template("pages/projects/index.html")


@app.route("/about")
def about():
    duolingo_streak = date.today() - date(day=28, month=7, year=2020)
    return render_template("pages/about/index.html", duolingo_streak=duolingo_streak)


if __name__ == "__main__":
    app.run(debug=True)
