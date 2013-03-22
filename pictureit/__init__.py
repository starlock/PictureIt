import os
from flask import Flask

from . import search

ROOT_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "..")

app = Flask(
    __name__,
    static_folder=os.path.join(ROOT_DIR, "static"),
    template_folder=os.path.join(ROOT_DIR, "templates")
)
#app.config['SENTRY_DSN'] = ''

# register blueprints
app.register_blueprint(search.mod)
