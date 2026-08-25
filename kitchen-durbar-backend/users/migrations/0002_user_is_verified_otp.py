# Generated manually to add User.is_verified and the OTP model

import uuid

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='OTP',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('purpose', models.CharField(choices=[('signup', 'Signup verification'), ('reset', 'Password reset')], max_length=10)),
                ('code', models.CharField(default=users.models.generate_otp_code, max_length=6)),
                ('is_used', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField(default=users.models.default_otp_expiry)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
