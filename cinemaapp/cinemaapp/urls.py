"""
URL configuration for cinemaapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="Cinema API",
        default_version='v1',
        description="Документация для REST API системы бронирования",
    ),
    public=True,
    permission_classes=(AllowAny,),  # ✅ важно!
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('movies.urls')),
    path('accounts/',include('accounts.urls')),
    path('',include('halls.urls')),
    path('showtimes/',include('showtimes.urls')),
    path('booking/',include('booking.urls')),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

                  # 👇 Добавь эти два маршрута 👇
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('redoc.json', schema_view.without_ui(cache_timeout=0), name='schema-redoc-json'),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)