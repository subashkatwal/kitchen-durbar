from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    list: own orders for a normal user, all orders for staff
    create: place an order from the current cart (IsAuthenticated)
    partial_update: staff-only status change
    destroy: staff-only order deletion
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Order.objects.all() if user.is_staff else Order.objects.filter(user=user)
        return qs.select_related('user').prefetch_related('items')

    def get_serializer_class(self):
        return OrderCreateSerializer if self.action == 'create' else OrderSerializer

    def partial_update(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Only staff can update order status.'}, status=403)

        instance = self.get_object()
        status_value = request.data.get('status')
        valid_statuses = dict(Order.Status.choices)
        if status_value not in valid_statuses:
            return Response({'status': f'Must be one of {list(valid_statuses)}.'}, status=400)

        instance.status = status_value
        instance.save(update_fields=['status'])
        return Response(OrderSerializer(instance).data)

    def update(self, request, *args, **kwargs):
        # Only partial status updates are supported.
        return self.partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Only staff can delete orders.'}, status=403)
        return super().destroy(request, *args, **kwargs)
