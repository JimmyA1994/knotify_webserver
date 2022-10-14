# knotify_webserver

## Installation
The first thing we need to do is install PostgreSQL. Follow an online guide to install it on the operating system of your liking. We followed [this guide](https://www.digitalocean.com/community/tutorials/how-to-use-postgresql-with-your-django-application-on-ubuntu-20-04).

Once that's done, we enter the PostgreSQl shell by typing:
```bash
sudo -u postgres psql
```
We will create a database named 'knotify_webserver_db' and a new user 'knotify_webserver_user'. Then we adjust some connection parameters for the user we just created. Lastly, we grant all privilages of our database to the newly created user:
```
CREATE DATABASE knotify_webserver_db;
CREATE USER knotify_webserver_user WITH PASSWORD 'password';
ALTER ROLE knotify_webserver_user SET client_encoding TO 'utf8';
ALTER ROLE knotify_webserver_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE knotify_webserver_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE knotify_webserver_db TO knotify_webserver_user;
\q
```

After that, install a python virtual environment. We use pipenv, but feel free to use whatever you are comfortable with.


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

In order to have access to the admin pages, create a superuser by typing:
```bash
python manage.py createsuperuser
```
Then, navigate to: http://127.0.0.1:8000/admin/login/ and login with the credentials you just created.

### Docker Installation
We assume that you have installed docker and the docker compose plugin (or the stand alone docker-compose binary). If you need some help, head to the [docker website](https://docs.docker.com/) for a comprehensive guide on installing docker on your preferred system.

Some notes for the uninitiated: On MacOS and Windows, install the Docker Desktop, a VM where both docker and docker compose resides. On Windows select the wsl2 backend for better performance. On Linux you can install Docker Desktop, but you have an extra option. Use docker natively for a performance boost. On MacOS, just make sure you download the appropriate binary for your architecture (Intel vs Apple Silicon).

### Build docker image and run the container
First get knotify and vienna_rna wheels on this directory. Check requirements.txt for more details. Then execute the following commands:
```bash
docker build --tag knotify_webserver .
docker run --rm -i -p 8000:8000 -t knotify_webserver
```

## Run knotify_webserver
You need to run docker as root in order to start building the docker image and run the containerized application. So, on the main knotify_webserver directory, run the following command:
```bash
sudo docker compose up
```
## To Do List

### HomePage

### Results Page

### Backend
