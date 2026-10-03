from django.db import migrations

# The storefront's original hard-coded service environments, plus Banquet and
# Cloud Kitchen - seeded so Admin -> Solutions starts with every card already
# there to edit, rather than empty.
SOLUTIONS = [
    ('Restaurants', 'रेस्टुरेन्ट',
     'Fast, ergonomic lines designed around your menu.',
     'तपाईंको मेनु अनुसार डिजाइन गरिएका छिटो र सहज लाइनहरू।'),
    ('Hotels & Resorts', 'होटल तथा रिसोर्ट',
     'Multi-outlet systems for kitchens, banquets and bars.',
     'भान्सा, भोज र बारका लागि बहु-आउटलेट प्रणाली।'),
    ('Banquet', 'ब्याङ्क्वेट',
     'High-volume cooking, holding and plating for weddings, events and functions.',
     'विवाह, कार्यक्रम र समारोहका लागि ठूलो परिमाणमा पकाउने, तातो राख्ने र पस्कने व्यवस्था।'),
    ('Bakeries & Cafés', 'बेकरी तथा क्याफे',
     'Reliable production, display and beverage workflows.',
     'भरपर्दो उत्पादन, डिस्प्ले र पेय कार्यप्रवाह।'),
    ('Hospitals & Institutions', 'अस्पताल तथा संस्था',
     'Hygienic, high-volume systems built for compliance.',
     'मापदण्ड अनुरूप स्वच्छ, ठूलो क्षमताका प्रणाली।'),
    ('Central Kitchen', 'केन्द्रीय भान्सा',
     'Scalable production, storage and dispatch planning.',
     'विस्तारयोग्य उत्पादन, भण्डारण र वितरण योजना।'),
    ('Cloud Kitchen', 'क्लाउड किचन',
     'Compact, delivery-first kitchens built for speed and multiple brands.',
     'डेलिभरीका लागि छिटो र धेरै ब्रान्ड चलाउन मिल्ने गरी बनाइएका साना भान्सा।'),
    ('Bars & Beverage', 'बार तथा पेय',
     'Compact, efficient stations shaped around service.',
     'सेवा अनुसार बनाइएका साना र प्रभावकारी स्टेसनहरू।'),
]


def seed(apps, schema_editor):
    Solution = apps.get_model('cms', 'Solution')
    if Solution.objects.exists():
        return
    Solution.objects.bulk_create(
        Solution(title=t, title_ne=t_ne, description=d, description_ne=d_ne, display_order=i)
        for i, (t, t_ne, d, d_ne) in enumerate(SOLUTIONS)
    )


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_testimonial_rating_solution'),
    ]

    operations = [
        migrations.RunPython(seed, migrations.RunPython.noop),
    ]
