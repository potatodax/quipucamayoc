import json
import uuid
from IPython.display import Javascript, display
from utils import prepare_data, get_file_content

# Inspired and adapted from https://github.com/vega/ipyvega/blob/master/vega/base.py
# and https://github.com/vega/ipyvega/blob/master/vega/utils.py

class Quipu(object):
    QUIPU_JS = "../build/index.js"

    def __init__(self, data = None, x = None, y = None, options = None):
        self.options = options or {}
        self.data = prepare_data(data, x, y)
        self.x = x
        self.y = y

    def _stringify_df(self):
        stringified_df = f'const x="{self.x}"; const y="{self.y}"; const data={self.data};'
        return stringified_df

    def _create_js_string(self, id, **kwds):
        template = get_file_content(self.QUIPU_JS)
        js_payload = template.format(
            id=id,
            opt=json.dumps(self.options, **kwds),
        )
        payload = self._stringify_df() + js_payload
        return payload

    def viewdata(self):
        print(self.data)

    def display(self):
        display(Javascript(self._create_js_string(uuid.uuid4())))
