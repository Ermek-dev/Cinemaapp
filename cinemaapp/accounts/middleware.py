from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser


ROLE_PROTECTED_PATHS = {
    'A': ['/admin-only/'],
    'U': ['/user-only/']
}


class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if any(request.path.startswith(p) for p  in ['/swagger','/swagger.json', '/openai','/docs', '/redoc']):
            print(f"[JWTMiddleware] Bypassing auth for: {request.path}")
            request.user = AnonymousUser()
            return None
        if request.path.startswith('/admin'):
            return None
        jwt_authenticator = JWTAuthentication()
        try:
            user_auth_tuple = jwt_authenticator.authenticate(request)
            if user_auth_tuple is not None:
                request.user, _ = user_auth_tuple
                user_role = getattr(request.user, 'role', None)
                for role, paths in ROLE_PROTECTED_PATHS.items():
                    if any(request.path.startswith(p) for p in paths):
                        if user_role != role:
                            return JsonResponse(
                            {'detail': 'Access denied: insufficient role'}, status=403
                            )
            else:
                request.user = AnonymousUser()
        except Exception as e:
            request.user = AnonymousUser()
