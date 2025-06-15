import logging
import json
import time
from django.utils.deprecation import MiddlewareMixin


logger = logging.getLogger('cinemaapp')


class LoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()


    def process_response(self, request, response):
        duration = round(time.time() - getattr(request,'start_time', time.time()), 3)

        log_data = {
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                "level": "info",
                "message": "Request received",
                "method": request.method,
                "path": request.get_full_path(),
                "statusCode": response.status_code,
                "duration": duration,
        }

        logger.info(json.dumps(log_data))
        return response