from celery import Celery
import requests
import redis
from knotify_client import KnotifyClient

app = Celery("knotify", backend="redis://redis:6379", broker="redis://redis:6379")
redis_client = redis.Redis(host="redis", port=6379, db=0)


@app.task(name="predict")
def predict(sequence, pseudoknot_options, hairpin_options, energy_options, model_ids):
    # run the prediction
    try:
        client = KnotifyClient(
            pseudoknot_options, hairpin_options, energy_options, sequence
        )
        # check if the same request has already run
        key = client.get_hashed_key()
        structure = (redis_client.get(key) or b"").decode("utf-8")
        if not structure:
            structure = client.predict()
            redis_client.set(key, structure)  # cache result for future reference

    except Exception:
        data = {"success": False, "model_ids": model_ids}
    else:
        data = {
            "success": True,
            "structure": structure,
            "pseudoknot_options": client.validated_pseudoknot_options,
            "hairpin_options": client.validated_hairpin_options,
            "energy_options": client.validated_energy_options,
            "model_ids": model_ids,
        }
    finally:
        # return result back to django to save it to db and update frontend
        requests.post("http://django:8000/handle_task_completion/", json=data)
