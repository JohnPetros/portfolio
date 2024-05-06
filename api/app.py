from flask import Flask, render_template, url_for


app = Flask(__name__)


@app.template_global("get_image")
def get_image(image_name):
    return url_for("static", filename=f"images/{image_name}")


@app.route("/")
def home():
    return render_template("pages/home/index.html")


if __name__ == "__main__":
    app.run(debug=True)
