from flask import Flask, render_template, url_for


app = Flask(__name__)


@app.template_global("get_file")
def get_file(file_path):
    return url_for("static", filename=file_path)


@app.route("/")
def home():
    return render_template("pages/home/index.html")


@app.route("/projects")
def projects():
    return render_template("pages/projects/index.html")


if __name__ == "__main__":
    app.run(debug=True)
