import uuid

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='testimonial',
            name='rating',
            field=models.PositiveSmallIntegerField(default=5, help_text='Star rating, 1-5.', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('title_ne', models.CharField(blank=True, max_length=100)),
                ('description', models.CharField(max_length=300)),
                ('description_ne', models.CharField(blank=True, max_length=300)),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['display_order', 'created_at'],
            },
        ),
    ]
