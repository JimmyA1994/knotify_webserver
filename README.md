# knotify_webserver

## Installation

Firstly, install a python virtual environment. We use pipenv, but feel free to use whatever you are comfortable with.

So on the main directory run:
```bash
sudo apt install pipenv
pipenv shell
pipenv install django
pipenv install celery
```

Run the server locally as follows:
```
python manage.py runserver
```
