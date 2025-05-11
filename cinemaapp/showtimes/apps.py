from django.apps import AppConfig


class ShowTimesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'showtimes'


    def ready(self):
        import showtimes.models