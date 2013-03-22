"""
Picture It

Usage:
  run.py
  run.py <interface:port>
  run.py -h | --help

Options:
  -h --help    Show this help
"""

import re

from docopt import docopt
#from raven.contrib.flask import Sentry

from pictureit import app

if __name__ == '__main__':
    # try to parse host and port, to listen to, from command line
    arguments = docopt(__doc__, help=True)
    listen_to = arguments.get("<interface:port>")
    app_kwargs = {}
    if listen_to:
        matches = re.match("([0-9A-z.-]+):(\d{1,5})", listen_to)
        if matches:
            app_kwargs["host"] = matches.group(1)
            app_kwargs["port"] = int(matches.group(2))
    
    # run app
    app.run(debug=True, **app_kwargs)
else:
    #sentry = Sentry(app)
    pass

