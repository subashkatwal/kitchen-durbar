from unittest import mock

from django.core import mail
from rest_framework.test import APITestCase


class RegisterApiTests(APITestCase):
    payload = {'email': 'new@example.com', 'full_name': 'New User', 'password': 'Str0ng-pass!'}

    def test_register_sends_otp(self):
        res = self.client.post('/api/v1/register', self.payload)
        self.assertEqual(res.status_code, 201, res.data)
        self.assertTrue(res.data['otp_sent'])
        self.assertEqual(len(mail.outbox), 1)

    def test_register_succeeds_when_email_fails(self):
        with mock.patch('users.emails.send_mail', side_effect=OSError('SMTP blocked')):
            res = self.client.post('/api/v1/register', self.payload)
        self.assertEqual(res.status_code, 201, res.data)
        self.assertFalse(res.data['otp_sent'])
        login = self.client.post('/api/v1/login', {'email': self.payload['email'], 'password': self.payload['password']})
        self.assertEqual(login.status_code, 200, login.data)

    def test_brevo_used_when_configured(self):
        with self.settings(BREVO_API_KEY='key'), mock.patch('users.emails.requests.post') as post:
            res = self.client.post('/api/v1/register', self.payload)
        self.assertTrue(res.data['otp_sent'])
        self.assertEqual(post.call_args.kwargs['json']['to'], [{'email': 'new@example.com'}])
        self.assertEqual(len(mail.outbox), 0)
