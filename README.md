# knotify_webserver

## Installation

Firstly, install a python virtual environment. We use pipenv, but feel free to use whatever you are comfortable with.

So on the main directory run:
```bash
sudo apt install pipenv
pipenv install
pipenv shell
pip install knotify-0.0.1.dev71-py3-none-any.whl
pip install -r wheel-requirements.txt
```

Run the server locally as follows:
```
python manage.py runserver
```

## Build docker image and run the container
First get knotify and vienna_rna wheels on this directory. Check requirements.txt for more details. Then execute the following commands:
```bash
docker build --tag knotify_webserver .
docker run --rm -i -p 8000:8000 -t knotify_webserver
```



## To Do List

### HomePage

### Results Page

### Backend