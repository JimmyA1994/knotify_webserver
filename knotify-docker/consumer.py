from redis import Redis
from tasks import predict
import json

redis_connection = Redis.from_url('redis://redis:6379', decode_responses=True)
ps = redis_connection.pubsub()
ps.subscribe('Django2Celery')


for message in ps.listen():
    if message["type"] == "message":
        msg = json.loads(message['data'])
        predict.apply_async((msg,))
