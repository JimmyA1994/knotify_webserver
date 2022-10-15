"""
Django deployment settings for knotify_webserver project.

"""
from .settings import *
from pathlib import Path
import os

PRODUCTION = True
ALLOWED_HOSTS = ["knotify.dslab.ece.ntua.gr"]
CSRF_TRUSTED_ORIGINS = ['https://knotify.dslab.ece.ntua.gr']