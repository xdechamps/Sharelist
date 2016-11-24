from bottle import route, run, template

@route('/index')
def index():
    return index.php

run(host='localhost', port=8080)