# knotify_webserver
This repository hosts the code for the knotify webserver application. It is the subject of my diploma thesis which aims to provide a web interface for [knotify](https://github.com/ntua-dslab/knotify). Knotify is a pseudoknot prediction tool for RNA sequences that was developed by the DSLab at the school of Electrical and Computer Engineering in the National and Technological University of Athens.

For the installation process, we used docker, as it is the most straight-forward, compartmentalized and consistent way to run software.

### Docker Installation
We assume that you have installed docker and the docker compose plugin (or the stand alone docker-compose binary). If you need some help, head to the [docker website](https://docs.docker.com/) for a comprehensive guide on installing docker on your preferred system.

Some notes for the uninitiated: On MacOS and Windows, install the Docker Desktop, a VM where both docker and docker compose resides. On Windows select the wsl2 backend for better performance. On Linux you can install Docker Desktop, but you have an extra option. Use docker natively for a performance boost. On MacOS, just make sure you download the appropriate binary for your architecture (Intel vs Apple Silicon).

## Run knotify_webserver
On the main knotify_webserver directory, run the following command:
```bash
sudo docker compose up -d
```
The -d option will run the services on the background leaving your terminal session free for use, once all the individual services have started. If skipped, the logs of the services will be displayed. Once completed, navigate to http://127.0.0.1:8000 and you should see the local instance of the web application.

### Access to the django admin page
As it is customery with django applications, you can access the admin page where all the database tables can be edited. For that to happen, you first need a superuser that will have the appropriate permisions. To create one, type the following command under the local directory of this repository.

```bash
docker-compose exec django python3 manage.py createsuperuser
```

More details about the configuration of the superuser will be provided in the form of text prompts. Once completed, navigate to: http://127.0.0.1:8000/admin/login/ and login with the credentials you just created.
