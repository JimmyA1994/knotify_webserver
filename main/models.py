from django.db.models import Model, CharField, UUIDField, DateTimeField, ForeignKey, CASCADE
from django.contrib.auth.models import User
import uuid

# Create your models here.
class Result(Model):
    sequence = CharField(max_length=256, unique=True)
    result = CharField(max_length=256)

    def __str__(self):
        return self.sequence

class Run(Model):
    uuid = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = ForeignKey(User, null=False, on_delete=CASCADE)
    result = ForeignKey(Result, null=False, on_delete=CASCADE)
    submitted = DateTimeField(null=True)
    completed = DateTimeField(null=True)

    def __str__(self):
        return str(self.uuid)