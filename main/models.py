from django.db.models import Model, CharField, UUIDField, DateTimeField, ForeignKey, OneToOneField, JSONField, CASCADE, TextChoices, BooleanField
from django.contrib.auth.models import User
from django.db.models.signals import post_save
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


class UserProfile(Model):
    user = OneToOneField(User, null=True, on_delete=CASCADE)
    guest_notified_for_conversion = BooleanField(default=False)


# define post_save signal of user to automatically create coressponding profile
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
