from flask import Flask, render_template

app = Flask(__name__)
app.debug = True

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/iphone6')
def iphone6():
    return render_template('iphone6.html')

@app.route('/hannah-graham')
def hannahGraham():
    return render_template('hannah-graham.html')

@app.route('/ebola')
def ebola():
    return render_template('ebola.html')

if __name__ == "__main__":
    app.run()
