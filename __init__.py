from flask import Flask

app = Flask(__name__)
app.debug = True

@app.route("/")
def hello():
    return app.send_static_file('index.html')
    #return "Hello, I love Digital Ocean!"

if __name__ == "__main__":
    app.run()
