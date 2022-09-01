from django.db.models import Model, CharField, UUIDField, DateTimeField, ForeignKey, JSONField, CASCADE, TextChoices
from django.contrib.auth.models import User
import uuid

# Create your models here.
class Result(Model):
    sequence = CharField(max_length=1024)
    pseudoknot_options = JSONField(null=True, blank=True, default=dict)
    hairpin_options = JSONField(null=True, blank=True, default=dict)
    energy_options = JSONField(null=True, blank=True, default=dict)
    structure = CharField(max_length=1024)

    def __str__(self):
        return self.sequence

class StatusChoices(TextChoices):
    ONGOING = 'ON', 'Ongoing'
    FAILED = 'FA', 'Failed'
    COMPLETED = 'CO', 'Completed'
class Run(Model):

    class Meta:
        ordering = ('completed',)

    uuid = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = ForeignKey(User, null=False, on_delete=CASCADE)
    result = ForeignKey(Result, null=True, on_delete=CASCADE)
    submitted = DateTimeField(null=True)
    completed = DateTimeField(null=True)
    status = CharField(max_length=2,
                       choices=StatusChoices.choices,
                       default=StatusChoices.ONGOING)

    def __str__(self):
        return str(self.uuid)

    def is_it_completed(self):
        return self.status == self.StatusChoices.COMPLETED
