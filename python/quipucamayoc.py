import json
import uuid
from IPython.display import Javascript, display
# import codecs
import os.path

# Inspired from https://github.com/vega/ipyvega/blob/master/vega/base.py
# and https://github.com/vega/ipyvega/blob/master/vega/utils.py

def get_abs_path(path):
    return os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        path)

def get_file_content(path):
    # with codecs.open(get_abs_path(path), encoding='utf-8') as f:
    with open(get_abs_path(path), "r", encoding='utf-8') as f:
        return f.read()

def talk():
    print("hello cat world")

class Quipu(object):
    QUIPU_JS = "../build/index.js"

    def __init__(self, data = None, options = None):
        self.options = options or {}

    def _create_js_string(self, id, **kwds):
        template = get_file_content(self.QUIPU_JS)
        # print(template)
        payload = template.format(
            id=id,
            opt=json.dumps(self.options, **kwds),
        )
        return payload

    def display(self):
        display(Javascript(self._create_js_string(uuid.uuid4())))

# quipu = Quipu()
# quipu.display()
