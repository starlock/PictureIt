from collections import defaultdict
from math import floor
from PIL import Image

from .redis_connection import redis_connection

BIN_COUNT = 4

def get_color_histogram(image):
    _constant = 256 / (BIN_COUNT + 1.0)
    histogram_colors = defaultdict(int)
    for r, g, b in image.getdata():
        histogram_colors[(
            floor(r / _constant), 
            floor(g / _constant), 
            floor(b / _constant),
        )] += 1
    return histogram_colors


class ImageColorIndex(object):
    PREFIX = "pictureit"
    
    def __init__(self, name="histogram_image"):
        """
        name is used as part of the redis key prefix
        """
        self.name = name
    
    def _get_key_prefix(self):
        return "%s_%s" % (self.PREFIX, self.name)
    
    def get_key(self, r, g, b):
        return "%s_%i_%i_%i" % (self._get_key_prefix(), r, g, b)
    
    def clear(self):
        """
        Clear the index
        """
        for key in redis_connection.keys(self._get_key_prefix() + "*"):
            redis_connection.delete(key)
    
    def add_image(self, image_path, name):
        """
        Add an image to the color index
        
        image_path is full file path to the image that is to be indexed
        name is the name or reference that will be stored in redis
        """
        with file(image_path) as f:
            im = Image.open(f)
            try:
                hi = get_color_histogram(im)
                for color, pixel_count in hi.iteritems():
                    key_name = self.get_key(color[0], color[1], color[2])
                    redis_connection.zadd(key_name, name, float(pixel_count))
            except (ValueError, TypeError), e:
                print "error: %r" % (e)
    
    def search(self, r, g, b, count=10):
        """
        Search the index for images with the specified color
        """
        color_constant = 256 / (BIN_COUNT + 1.0)
        r = floor(r / color_constant)
        g = floor(g / color_constant)
        b = floor(b / color_constant)
        return redis_connection.zrevrange(self.get_key(r, g, b), 0, count)
