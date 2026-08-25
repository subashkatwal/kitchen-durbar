from decimal import Decimal

from rest_framework import serializers

from products.models import Product

from .models import FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']
        read_only_fields = ['id', 'product_name', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'subtotal', 'shipping', 'total', 'status', 'created_at', 'items',
        ]
        read_only_fields = ['id', 'user', 'subtotal', 'shipping', 'total', 'status', 'created_at']


class OrderCreateItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    """Accepts {items:[{product_id, quantity}]}; server computes all pricing."""

    items = OrderCreateItemSerializer(many=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Order must contain at least one item.')
        return value

    def create(self, validated_data):
        request = self.context['request']
        items_data = validated_data['items']
        product_ids = [item['product_id'] for item in items_data]
        products = Product.objects.in_bulk(product_ids)

        missing = [str(pid) for pid in product_ids if pid not in products]
        if missing:
            raise serializers.ValidationError({'items': f'Unknown product id(s): {", ".join(missing)}'})

        subtotal = Decimal('0')
        line_items = []
        for item in items_data:
            product = products[item['product_id']]
            qty = item['quantity']
            subtotal += product.price * qty
            line_items.append((product, qty))

        shipping = Decimal('0') if subtotal > FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
        total = subtotal + shipping

        order = Order.objects.create(
            user=request.user,
            subtotal=subtotal,
            shipping=shipping,
            total=total,
        )
        OrderItem.objects.bulk_create([
            OrderItem(order=order, product=product, product_name=product.name, price=product.price, quantity=qty)
            for product, qty in line_items
        ])
        return order

    def to_representation(self, instance):
        return OrderSerializer(instance, context=self.context).data
