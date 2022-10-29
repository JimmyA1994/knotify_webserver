import uuid

def custom_id():
    return uuid.uuid4().hex[:8]
