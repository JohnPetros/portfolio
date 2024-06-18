from smtplib import SMTP
from email.message import Message
from datetime import date

from flask import Flask, render_template, url_for, request


app = Flask(__name__)


favorite_projects = [
    {
        "id": "stardust",
        "title": "StarDust",
        "description": "Aplicação web inspirada no Duolingo voltada para o ensino de lógica de programação.",
        "images": [
            "projects/stardust/space-page.png",
            "projects/stardust/challenge-page.png",
            "projects/stardust/challenges-page.png",
            "projects/stardust/lesson-page.png",
            "projects/stardust/quiz-stage.png",
            "projects/stardust/congratulations-stage.png",
            "projects/stardust/profile-page.png",
            "projects/stardust/shop-avatars-page.png",
            "projects/stardust/shop-rockets-page.png",
        ],
        "i18n": "Web application inspired by Duolingo for teaching programming logic.",
        "techs": ["React", "NextJs", "TailwindCSS", "Supabase", "Resend"],
        "github_link": "https://github.com/JohnPetros/stardust",
        "is_mobile": False,
    },
    {
        "id": "smart-farming",
        "title": "Smart Farming",
        "description": "Dashboard web que visa auxiliar o monitoramento da estufa inteligente mantida na minha faculdade.",
        "images": [
            "projects/smart-farming/last-sensors-record-page.png",
            "projects/smart-farming/sensors-records-dashboard-page.png",
            "projects/smart-farming/sensors-records-table-page.png",
            "projects/smart-farming/checklist-records-dashboard-page.png",
            "projects/smart-farming/checklist-records-form.png",
        ],
        "i18n": "Web dashboard for monitoring the smart greenhouse maintained at Fatec - São José dos Campos.",
        "techs": [
            "Python",
            "Flask",
            "MySQL",
            "HTMX",
            "ApexChart.js",
            "HTML",
            "CSS",
            "JavaScript",
        ],
        "github_link": "https://github.com/CtrI-Alt-Del/smart-farming",
        "is_mobile": False,
    },
    {
        "id": "sertton",
        "title": "Sertton",
        "description": "Aplicativo e-commerce voltado para o nicho de peças de carroceria para veículos de transporte de grande porte.",
        "images": [
            "projects/sertton/cart-screen.jpeg",
            "projects/sertton/home-screen.jpeg",
            "projects/sertton/product-details-screen.jpeg",
            "projects/sertton/products-list-screen.jpeg",
            "projects/sertton/orders-list-screen.jpeg",
        ],
        "i18n": "E-commerce mobile app for niche of body parts of large commercial vehicles.",
        "techs": ["React Native", "Expo", "Tamagui", "TypeScript"],
        "github_link": "https://github.com/JohnPetros/sertton",
        "is_mobile": True,
    },
]


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
        sender = email
        reciever = "joaopcarvalho.cds@gmail.com"

        message = Message()
        message["Subject"] = f"Contato do Portifólio 🐼 - {sender}"
        message["From"] = sender
        message["To"] = reciever
        message.add_header("Content-Type", "text/html")
        message.set_payload(f"<p>{body}</p>")
        password = "ggxdpqdbllijoymj"

        smtp = SMTP("smtp.gmail.com: 587")
        smtp.starttls()
        smtp.login(reciever, password)
        smtp.sendmail(sender, [reciever], message.as_string().encode("utf-8"))
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
    return render_template("pages/home/index.html", favorite_projects=favorite_projects)


@app.route("/projects")
def projects():
    return render_template("pages/projects/index.html")


@app.route("/about")
def about():
    duolingo_streak = date.today() - date(day=28, month=7, year=2020)
    return render_template("pages/about/index.html", duolingo_streak=duolingo_streak)


if __name__ == "__main__":
    app.run(debug=True)
