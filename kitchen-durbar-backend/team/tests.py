from rest_framework.test import APITestCase

from common.testing import make_image, make_user

from .models import TeamMember


class TeamApiTests(APITestCase):
    def setUp(self):
        self.visible = TeamMember.objects.create(name='Asha', role='Planner', display_order=1)
        self.first = TeamMember.objects.create(name='Bikash', role='Fabricator', display_order=0)
        self.hidden = TeamMember.objects.create(name='Hidden', role='Tech', is_active=False)

    def test_public_list_only_active_in_display_order(self):
        res = self.client.get('/api/v1/team')
        self.assertEqual(res.status_code, 200)
        self.assertEqual([m['name'] for m in res.data], ['Bikash', 'Asha'])

    def test_staff_sees_hidden_members(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.get('/api/v1/team')
        self.assertEqual(len(res.data), 3)

    def test_non_staff_cannot_create(self):
        self.client.force_authenticate(make_user())
        res = self.client.post('/api/v1/team', {'name': 'X', 'role': 'Y'})
        self.assertEqual(res.status_code, 403)

    def test_staff_can_create_with_photo(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post(
            '/api/v1/team', {'name': 'New', 'role': 'Installer', 'photo': make_image()}, format='multipart'
        )
        self.assertEqual(res.status_code, 201, res.data)
        self.assertTrue(res.data['photo'])
