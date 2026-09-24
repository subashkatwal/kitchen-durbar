from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from common.testing import make_image, make_user

from .models import Advertisement


class AdvertisementApiTests(APITestCase):
    def ad(self, title, **kwargs):
        return Advertisement.objects.create(title=title, image=make_image(), **kwargs)

    def test_filter_by_placement(self):
        self.ad('Top', position='home_top')
        self.ad('Catalogue', position='products')
        res = self.client.get('/api/v1/promotions', {'position': 'products'})
        self.assertEqual([a['title'] for a in res.data], ['Catalogue'])

    def test_public_only_sees_live_ads(self):
        now = timezone.now()
        self.ad('Live')
        self.ad('Off', is_active=False)
        self.ad('Future', start_date=now + timedelta(days=1))
        self.ad('Expired', end_date=now - timedelta(days=1))
        res = self.client.get('/api/v1/promotions')
        self.assertEqual([a['title'] for a in res.data], ['Live'])

    def test_staff_can_create_popup_ad(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post(
            '/api/v1/promotions',
            {'title': 'Festival offer', 'position': 'popup', 'image': make_image()},
            format='multipart',
        )
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(res.data['position'], 'popup')

    def test_legacy_rail_value_rejected(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post(
            '/api/v1/promotions', {'title': 'Old', 'position': 'left', 'image': make_image()}, format='multipart'
        )
        self.assertEqual(res.status_code, 400)
