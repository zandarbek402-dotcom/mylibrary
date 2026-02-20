from django.urls import path
from .views import (
    MaterialCategoryListCreateView,
    MaterialCategoryDetailView,
    MaterialListCreateView,
    MaterialDetailView,
    material_statistics,
)

urlpatterns = [
    path('categories/', MaterialCategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', MaterialCategoryDetailView.as_view(), name='category-detail'),
    path('', MaterialListCreateView.as_view(), name='material-list-create'),
    path('<int:pk>/', MaterialDetailView.as_view(), name='material-detail'),
    path('statistics/', material_statistics, name='material-statistics'),
]

