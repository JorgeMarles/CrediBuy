"""
URL configuration for credibuy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from products.views import ProductTypeViewSet, ProductViewSet

from payments.views import CreditCreationView, CreditViewSet, PaymentViewSet

from users.views import ClientViewSet

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = routers.DefaultRouter()
router.register(r'credit', CreditViewSet, basename='credits')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'product-type', ProductTypeViewSet, basename='producttype')
router.register(r'product', ProductViewSet, basename='product')
router.register(r'clients', ClientViewSet, basename='client')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    path('api/credits/create/', CreditCreationView.as_view(), name="credit-create"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]   
