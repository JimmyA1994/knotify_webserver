# Generated by Django 4.0.3 on 2022-09-25 21:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_run_status'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='run',
            options={'ordering': ('completed',)},
        ),
    ]