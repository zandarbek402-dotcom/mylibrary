from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Sum, Avg
from django.db.models.functions import TruncDate
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
    total_quantity = Material.objects.aggregate(Sum('quantity'))['quantity__sum'] or 0
    total_value = Material.objects.aggregate(
        total=Sum('quantity') * Avg('price_per_unit')
    )['total'] or 0
    
    by_status = {}
    for status_code, status_name in Material.STATUS_CHOICES:
        count = Material.objects.filter(status=status_code).count()
        quantity = Material.objects.filter(status=status_code).aggregate(
            Sum('quantity')
        )['quantity__sum'] or 0
        by_status[status_name] = {
            'count': count,
            'quantity': float(quantity)
        }
    
    by_category = {}
    for category in MaterialCategory.objects.annotate(
        material_count=Count('materials'),
        total_quantity=Sum('materials__quantity')
    ):
        by_category[category.name] = {
            'count': category.material_count,
            'quantity': float(category.total_quantity or 0)
        }
    
    # Материалдардың күнделікті қосылу статистикасы
    daily_additions = Material.objects.annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        count=Count('id')
    ).order_by('-date')[:30]
    
    # Ең көп материалдары бар санаттар
    top_categories = MaterialCategory.objects.annotate(
        material_count=Count('materials')
    ).order_by('-material_count')[:5]
    
    return Response({
        'total_materials': total_materials,
        'total_quantity': float(total_quantity),
        'total_value': float(total_value),
        'by_status': by_status,
        'by_category': by_category,
        'daily_additions': list(daily_additions),
        'top_categories': [
            {'name': cat.name, 'count': cat.material_count}
            for cat in top_categories
        ],
    })


@api_view(['GET'])
@permission_classes([IsAdminOrReadOnly])
def material_export(request):
    """Export materials to CSV format"""
    from django.http import HttpResponse
    import csv
    
    materials = Material.objects.select_related('category').all()
    
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="materials.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Атауы', 'Санаты', 'Саны', 'Өлшем бірлігі', 
        'Бағасы', 'Күйі', 'Орналасқан жері', 'Жеткізуші'
    ])
    
    for material in materials:
        writer.writerow([
            material.name,
            material.category.name if material.category else '',
            material.quantity,
            material.get_unit_display(),
            material.price_per_unit or '',
            material.get_status_display(),
            material.location or '',
            material.supplier or '',
        ])
    
    return response
