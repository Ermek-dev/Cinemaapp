import logging
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_logging_error(caplog):
    client = APIClient()

    with caplog.at_level(logging.WARNING, logger="django.request"):
        response = client.get("/movies/9999/")
        assert response.status_code == 404
        assert any("not found" in r.message.lower() for r in caplog.records)