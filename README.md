# Quipucamayoc

A high-level quipu visualization library for Python

The `quipucamayoc` data visualization library reimagines the modern data science toolkit as one that includes indigenous modes of data communication. This library is based on Incan numeric quipus and works with Python in a Jupyter Notebook environment. I hope `quipucamayoc` inspires data scientists to approach their discipline as the weaving together of historical modes of representation with historical problems

:sparkles: For more information on this library and quipus, visit the [`quipucamayoc` wiki page](https://github.com/potatodax/quipucamayoc/wiki/Quipucamayoc). :sparkles:

# Project Structure

```
|--assets/        <-- SVG elements that make the quipu chart
|--quipucamayoc/  <-- Python files that interface with Jupyter Notebook
|--src/           <-- TypeScript files that build the quipu chart
|--MANIFEST.in    <-- combines JavaScript with the Python build
|--pyproject.toml <-- tells Python library `build` to use setuptools
|--setup.py       <-- defines the Python build
|--tsconfig.json  <-- TypeScript settings
```

`quipucamayoc` Data Flow
<img width="1000" alt="Purple and pink diagram of how data flows through the system" src="https://user-images.githubusercontent.com/86934143/206129010-bd283324-d79b-4203-bd6b-7d8eeafd84a6.png">

# Installation

First, go to https://github.com/potatodax/quipucamayoc/releases/tag/v0.1.0 and download the [quipucamayoc-0.1.0.tar.gz](https://github.com/potatodax/quipucamayoc/releases/download/v0.1.0/quipucamayoc-0.1.0.tar.gz) file.

Then run:

```
cd <directory where you downloaded the tar.gz file>
pip3 install quipucamayoc-0.1.0.tar.gz
```

If successful, you should see the following at the end of the terminal output:

```
[...]
Successfully installed quipucamayoc-0.1.0
```

---

:recycle: _Note_: To uninstall later, simply use:

```
pip3 uninstall quipucamayoc
```

# Usage

The [wiki page](https://github.com/potatodax/quipucamayoc/wiki/Quipucamayoc#demonstration) and the [demo notebook](https://github.com/potatodax/quipucamayoc/tree/main/demo) also show how `quipucamayoc` builds quipu charts.

Here is a small example of how this library works in a Jupyter Notebook:

```
import quipucamayoc as qp
import pandas as pd
```

```
data = {'item': ['item_a', 'item_b', 'item_c', 'item_d', 'item_e'],
        'amount': [1200, 150, 300, 450, 201],
        }
df = pd.DataFrame(data)

new_quipu = qp.Quipu(data=df, label='item', value='amount')
new_quipu.display()
```

<img width="202" alt="Small quipu with five pendant cords" src="https://user-images.githubusercontent.com/86934143/206374898-9d785392-e911-4ccd-a77e-4372ff899bec.png">
