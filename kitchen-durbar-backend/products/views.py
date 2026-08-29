from rest_framework import filters, viewsets
from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAdminOrReadOnly

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    list/retrieve: public, with ?search=&category=&ordering=price,-price,name
    create/update/partial_update/destroy: admin only
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name', 'created_at']
