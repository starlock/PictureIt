import json
from math import floor
from flask import Blueprint, render_template, Response, request

from .image_index import ImageColorIndex

mod = Blueprint("Search", __name__)
image_index = ImageColorIndex()

@mod.route("/")
def index():
    return render_template("index.html")


@mod.route("/search", methods=["post"])
def search():
    print "data:", request.data
    data = json.loads(request.data)
    
    images = []
    
    for color in data["colors"]:
        for image_name in image_index.search(color[0], color[1], color[2], data.get("count", 10)):
            images.append("/static/data/i/product/100/0/%s" % image_name)
    
    response = Response(json.dumps({"images":images}))
    response.content_type = "application/json"
    return response
        
