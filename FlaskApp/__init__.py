from flask import Flask, render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/iphone6')
def iphone6():
    return app.send_static_file('iphone6.html')

@app.route('/ebola')
def ebola():
    return app.send_static_file('storyline.html')

if __name__ == "__main__":
    app.run()
