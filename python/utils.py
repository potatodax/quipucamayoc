import pandas as pd
import os.path

# Inspired and adapted from https://github.com/vega/ipyvega/blob/master/vega/base.py
# and https://github.com/vega/ipyvega/blob/master/vega/utils.py

def get_abs_path(path):
    return os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        path)

def get_file_content(path):
    with open(get_abs_path(path), "r", encoding='utf-8') as f:
        # escape single curly braces from JS file
        return f.read().replace("{", "{{").replace("}","}}")

def prepare_data(data, x, y):
    if data is None:
        raise ValueError('Missing `data` argument. Please provide a dataframe to the `data` argument.')
    elif y is None:
        raise ValueError('Missing `y` argument. Please provide name of target column to the `y` argument.')
    elif x is None:
        raise ValueError('Missing `x` argument. Please provide name of target column to the `x` argument.')
    elif not isinstance(data, pd.DataFrame):
        raise ValueError('Parameter `data` must be a Pandas DataFrame.')
    elif not isinstance(y, str):
        raise ValueError('Parameter `y` must be a string.')
    elif not isinstance(x, str):
        raise ValueError('Parameter `x` must be a string.')
    elif isinstance(data.index, pd.core.indexes.multi.MultiIndex) or isinstance(data.columns, pd.core.indexes.multi.MultiIndex):
        raise ValueError('DataFrames with hierarchical indices are not supported.')
    elif not pd.api.types.is_integer_dtype(data[y]):
        raise ValueError('The `y` column of the `data` DataFrame must be of type integer.')
    elif not pd.api.types.is_string_dtype(data[x]):
        raise ValueError('The `x` column of the `data` DataFrame must be of type string.')
    elif data.shape[0] > 1000:
        raise ValueError('DataFrame cannot have more than 1,000 rows.')
    elif data[y].max() > 99999:
        raise ValueError('Integer values above 99,999 are not supported.')
    else:
        data = data[[x, y]]
        return data.to_dict(orient='records')