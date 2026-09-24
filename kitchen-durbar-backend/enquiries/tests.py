from unittest import mock

from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

from common.testing import make_user

from .models import Enquiry

VALID = {
    'name': 'Sita',
    'company': 'Himalayan Hotel',
    'phone': '+977 9800000000',
    'email': 'sita@example.com',
    'message': 'We need a 6-burner range and prep tables.',
}


class EnquiryApiTests(APITestCase):
    def setUp(self):
        cache.clear()  # throttle history lives in the cache

    def test_anyone_can_submit(self):
        res = self.client.post('/api/v1/enquiries', VALID)
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(Enquiry.objects.count(), 1)
        self.assertFalse(res.data['is_handled'])

    def test_company_is_optional_but_message_is_not(self):
        res = self.client.post('/api/v1/enquiries', {**VALID, 'company': ''})
        self.assertEqual(res.status_code, 201)
        res = self.client.post('/api/v1/enquiries', {**VALID, 'message': '   '})
        self.assertEqual(res.status_code, 400)

    def test_visitor_cannot_mark_handled_on_create(self):
        res = self.client.post('/api/v1/enquiries', {**VALID, 'is_handled': True})
        self.assertFalse(res.data['is_handled'])

    def test_list_requires_staff(self):
        Enquiry.objects.create(**VALID)
        self.assertEqual(self.client.get('/api/v1/enquiries').status_code, 401)
        self.client.force_authenticate(make_user())
        self.assertEqual(self.client.get('/api/v1/enquiries').status_code, 403)
        self.client.force_authenticate(make_user('admin@example.com', staff=True))
        res = self.client.get('/api/v1/enquiries')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)

    def test_staff_can_toggle_handled(self):
        enquiry = Enquiry.objects.create(**VALID)
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.patch(f'/api/v1/enquiries/{enquiry.id}', {'is_handled': True})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data['is_handled'])
        self.assertEqual(res.data['message'], VALID['message'])  # full record returned

    def test_submissions_are_throttled(self):
        with mock.patch('enquiries.views.EnquiryCreateThrottle.rate', '2/hour'):
            codes = [self.client.post('/api/v1/enquiries', VALID).status_code for _ in range(3)]
        self.assertEqual(codes, [201, 201, 429])

    @override_settings(ENQUIRY_NOTIFY_EMAIL='team@example.com')
    def test_notifies_staff_when_configured(self):
        self.client.post('/api/v1/enquiries', VALID)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Sita', mail.outbox[0].subject)

    def test_no_email_when_not_configured(self):
        self.client.post('/api/v1/enquiries', VALID)
        self.assertEqual(len(mail.outbox), 0)
