import logging
import json
import time
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse, Http404
from django.utils.deprecation import MiddlewareMixin
from rest_framework.exceptions import ValidationError as DRFValidationError, NotAuthenticated, AuthenticationFailed

logger = logging.getLogger('cinemaapp')


class LoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()


    def process_exception(self, request, exception):
        duration = round(time.time() - getattr(request,'start_time', time.time()), 3)

        status_code = 500
        message = "Внутренняя ошибка сервера"

        if isinstance(exception,Http404):
            status_code = 404
            message = "Ресурс не найден"
        elif isinstance(exception, PermissionDenied):
            status_code = 403
            message = "Доступ запрещен"
        elif isinstance(exception,NotAuthenticated):
            status_code = 401
            message = "Требуется аутентификация"
        elif isinstance(exception,AuthenticationFailed):
            status_code = 401
            message = "Ошибка аутентификация"
        elif isinstance(exception, DRFValidationError):
            status_code = 400
            message = exception.detail
            if isinstance(message,(dict,list)):
                return JsonResponse(message,status=status_code)
        else:
            message = str(exception)


        log_data = {
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                "level": "error",
                "message": str(exception),
                "method": request.method,
                "path": request.get_full_path(),
                "statusCode": status_code,
                "duration": duration,
        }

        logger.error(json.dumps(log_data))
        return JsonResponse({"error": message}, status=status_code)


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