from celery import shared_task
from main.models import Run, Result, StatusChoices
from django.utils import timezone
from django.contrib.auth.models import User
from .utils import KnotifyClient

@shared_task
def predict_structure(sequence, pseudoknot_options, hairpin_options, energy_options, model_ids):
    '''Task for predicting the sequence's structure provided by the user'''

    # retrieve unserializable objects
    run_id = model_ids.get('run_id', '')
    run = Run.objects.get(pk=run_id)
    result_id = model_ids.get('result_id', '')
    result = Result.objects.get(pk=result_id)

    # run the prediction
    try:
        client = KnotifyClient(pseudoknot_options, hairpin_options, energy_options, sequence)
        structure = client.predict()
        completed = timezone.now()
    except:
        run.status = StatusChoices.FAILED
        run.save(update_fields=('status'))
        return

    # update result
    result.pseudoknot_options = client.validated_pseudoknot_options
    result.hairpin_options = client.validated_hairpin_options
    result.energy_options = client.validated_energy_options
    result.structure = structure
    result.save(update_fields=('pseudoknot_options', 'hairpin_options', 'energy_options', 'structure'))

    # update run
    completed = timezone.now()
    run.status = StatusChoices.COMPLETED
    run.completed = completed
    run.save(update_fields=('status', 'completed'))
