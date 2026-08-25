from django.core.management.base import BaseCommand

from products.models import Product

CATALOG = [
    ('4-Burner Gas Range', 'Burner', 45000, 'Heavy-duty 4 burner gas range with oven, stainless steel body.'),
    ('6-Burner Chinese Range', 'Burner', 78000, 'High flame Chinese burner range for commercial kitchens.'),
    ('Stainless Steel Prep Table', 'Table', 22000, 'SS 304 prep table with undershelf, 4x2 feet.'),
    ('Work Table with Sink', 'Table', 35000, 'Combined work table with integrated sink unit.'),
    ('Dish Rack 3-Tier', 'Rack', 18000, '3-tier stainless steel dish drying rack.'),
    ('Pot Storage Rack', 'Rack', 25000, 'Wall-mounted pot and pan storage rack.'),
    ('Double Bowl Sink', 'Sink', 28000, 'Double bowl stainless steel sink with drainboard.'),
    ('Hand Wash Sink', 'Sink', 12000, 'Foot-operated hand wash basin, SS 304.'),
    ('Glass Display Showcase', 'Showcase', 65000, 'Refrigerated glass display showcase for pastries.'),
    ('Hot Food Display', 'Showcase', 42000, 'Heated food display counter with glass panels.'),
    ('Undercounter Chiller', 'Chiller', 95000, '2-door undercounter refrigerator, 300L capacity.'),
    ('Upright Freezer', 'Chiller', 120000, 'Commercial upright freezer, 500L, energy efficient.'),
    ('Deep Fryer 20L', 'Fryer', 38000, 'Electric deep fryer with thermostat control, 20L tank.'),
    ('Gas Fryer Twin Tank', 'Fryer', 55000, 'Twin tank gas fryer for high-volume frying.'),
    ('Wall Mounted Shelves', 'Shelves', 15000, 'Adjustable wall-mounted SS shelving unit.'),
    ('Corner Shelf Unit', 'Shelves', 20000, 'Triangular corner shelf for maximizing space.'),
    ('Exhaust Chimney Hood', 'Chimney', 85000, 'Commercial exhaust hood with grease filters.'),
    ('Ductless Chimney', 'Chimney', 45000, 'Ductless chimney with charcoal filters.'),
    ('Tandoor Oven', 'Others', 110000, 'Clay tandoor oven for authentic naan and kebabs.'),
    ('Dough Mixer 20L', 'Others', 72000, 'Spiral dough mixer, 20L bowl capacity.'),
]


class Command(BaseCommand):
    help = 'Seed the product catalog with the initial Kitchen Durbar lineup (idempotent).'

    def handle(self, *args, **options):
        created = 0
        for name, category, price, description in CATALOG:
            _, was_created = Product.objects.get_or_create(
                name=name,
                defaults={'category': category, 'price': price, 'description': description},
            )
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(
            f'Seeded {created} new product(s); {len(CATALOG)} total in catalog definition.'
        ))
