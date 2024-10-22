from django.db.models import Model, CharField, DateTimeField, ForeignKey, OneToOneField, JSONField, CASCADE, TextChoices, BooleanField
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from main.utils import custom_id

# Create your models here.
class Result(Model):
    sequence = CharField(max_length=1024)
    pseudoknot_options = JSONField(null=True, blank=True, default=dict)
    hairpin_options = JSONField(null=True, blank=True, default=dict)
    energy_options = JSONField(null=True, blank=True, default=dict)
    structure = CharField(max_length=1024)
    description = CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.sequence


class StatusChoices(TextChoices):
    ONGOING = 'ON', 'Ongoing'
    FAILED = 'FA', 'Failed'
    COMPLETED = 'CO', 'Completed'

class Run(Model):
    class Meta:
        ordering = ('completed',)

    id = CharField(primary_key=True, max_length=8, unique=True, default=custom_id)
    user = ForeignKey(User, null=False, on_delete=CASCADE)
    result = ForeignKey(Result, null=True, on_delete=CASCADE)
    submitted = DateTimeField(null=True)
    completed = DateTimeField(null=True)
    status = CharField(max_length=2,
                       choices=StatusChoices.choices,
                       default=StatusChoices.ONGOING)

    def __str__(self):
        return str(self.id)

    def is_it_completed(self):
        return self.status == self.StatusChoices.COMPLETED


class UserProfile(Model):
    user = OneToOneField(User, null=True, on_delete=CASCADE)
    guest_notified_for_conversion = BooleanField(default=False)


# define post_save signal of user to automatically create corresponding profile
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
