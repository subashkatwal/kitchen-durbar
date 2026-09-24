from django.db import migrations

# The old "left"/"right" rail positions predate the redesign; the homepage
# showed the first two ads above its content and the next two below, so map
# them onto the equivalent new placements.
FORWARD = {'left': 'home_top', 'right': 'home_bottom'}
BACKWARD = {'home_top': 'left', 'home_bottom': 'right', 'products': 'left', 'popup': 'left'}


def forward(apps, schema_editor):
    Advertisement = apps.get_model('ads', 'Advertisement')
    for old, new in FORWARD.items():
        Advertisement.objects.filter(position=old).update(position=new)


def backward(apps, schema_editor):
    Advertisement = apps.get_model('ads', 'Advertisement')
    for new, old in BACKWARD.items():
        Advertisement.objects.filter(position=new).update(position=old)


class Migration(migrations.Migration):
    dependencies = [
        ('ads', '0004_alter_advertisement_position'),
    ]

    operations = [
        migrations.RunPython(forward, backward),
    ]
