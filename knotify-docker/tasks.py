from celery import Celery
import requests
from knotify_client import KnotifyClient

app = Celery("knotify_webserver", backend='redis://redis:6379',
                                  broker='redis://redis:6379')

@app.task(name='predict')
def predict(data):
    sequence = data.get('sequence', '')
    pseudoknot_options = data.get('pseudoknot_options', {})
    hairpin_options = data.get('hairpin_options', {})
    energy_options= data.get('energy_options', {})
    model_ids = data.get('model_ids', {})

    # run the prediction
    try:
        client = KnotifyClient(pseudoknot_options, hairpin_options, energy_options, sequence)
        structure = client.predict()
    except:
        data = {'success': False, 'model_ids': model_ids}
    else:
        data = {'success': True, 'structure': structure, 'pseudoknot_options': client.validated_pseudoknot_options,
                'hairpin_options': client.validated_hairpin_options, 'energy_options': client.validated_energy_options,
                'model_ids': model_ids}
    finally:
        # return result back to django to save it to db and update frontend
        requests.post('http://web:8000/handle_task_completion/', json=data)