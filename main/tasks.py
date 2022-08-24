from celery import Celery

app = Celery('tasks', broker='redis://redis:6379/0')

@app.tasks
def predict_structure(sequence, pseudoknot_options, hairpin_options, energy_options):
    ...