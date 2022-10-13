from django.contrib import admin

# Register your models here.
from main.models import Result, Run

admin.site.register((Result, Run))
