from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Material, MaterialCategory
from .serializers import (
    MaterialSerializer,
    MaterialCreateSerializer,
    MaterialCategorySerializer,
)
from accounts.permissions import IsAdminOrReadOnly


class MaterialCategoryListCreateView(generics.ListCreateAPIView):
    """List and create material categories"""
    queryset = MaterialCategory.objects.all()
    serializer_class = MaterialCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class MaterialCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete material category"""
    queryset = MaterialCategory.objects.all()
    serializer_class = MaterialCategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class MaterialListCreateView(generics.ListCreateAPIView):
    """List and create materials"""
    queryset = Material.objects.select_related('category', 'created_by').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'unit']
    search_fields = ['name', 'description', 'location', 'supplier']
    ordering_fields = ['name', 'quantity', 'created_at', 'delivery_date']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MaterialCreateSerializer
        return MaterialSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by location if provided
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        return queryset


class MaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete material"""
    queryset = Material.objects.select_related('category', 'created_by').all()
    serializer_class = MaterialSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return MaterialCreateSerializer
        return MaterialSerializer


@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def material_statistics(request):
    """Get material statistics"""
    total_materials = Material.objects.count()
    by_status = {}
    for status_code, status_name in Material.STATUS_CHOICES:
        by_status[status_name] = Material.objects.filter(status=status_code).count()
    
    by_category = {}
    for category in MaterialCategory.objects.all():
        by_category[category.name] = Material.objects.filter(category=category).count()
    
    return Response({
        'total_materials': total_materials,
        'by_status': by_status,
        'by_category': by_category,
    })

