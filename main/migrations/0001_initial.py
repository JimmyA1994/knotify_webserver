from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sequence', models.CharField(max_length=1024)),
                ('pseudoknot_options', models.JSONField(blank=True, default=dict, null=True)),
                ('hairpin_options', models.JSONField(blank=True, default=dict, null=True)),
                ('energy_options', models.JSONField(blank=True, default=dict, null=True)),
                ('structure', models.CharField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guest_notified_for_conversion', models.BooleanField(default=False)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Run',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('submitted', models.DateTimeField(null=True)),
                ('completed', models.DateTimeField(null=True)),
                ('status', models.CharField(choices=[('ON', 'Ongoing'), ('FA', 'Failed'), ('CO', 'Completed')], default='ON', max_length=2)),
                ('result', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.result')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('completed',),
            },
        ),
    ]