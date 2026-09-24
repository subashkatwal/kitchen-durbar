from rest_framework.test import APITestCase

from common.testing import make_image, make_user

from .models import Project, SiteImage, Testimonial


class SiteImageApiTests(APITestCase):
    def test_public_can_list(self):
        SiteImage.objects.create(key='home_hero', image=make_image())
        res = self.client.get('/api/v1/site-images')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data[0]['key'], 'home_hero')
        self.assertEqual(res.data[0]['label'], 'Home - hero')

    def test_post_is_an_upsert_per_key(self):
        self.client.force_authenticate(make_user(staff=True))
        first = self.client.post('/api/v1/site-images', {'key': 'about_hero', 'image': make_image()}, format='multipart')
        self.assertEqual(first.status_code, 201, first.data)
        second = self.client.post('/api/v1/site-images', {'key': 'about_hero', 'image': make_image('b.png')}, format='multipart')
        self.assertEqual(second.status_code, 200, second.data)
        self.assertEqual(SiteImage.objects.filter(key='about_hero').count(), 1)
        self.assertEqual(first.data['id'], second.data['id'])

    def test_unknown_slot_rejected(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post('/api/v1/site-images', {'key': 'nope', 'image': make_image()}, format='multipart')
        self.assertEqual(res.status_code, 400)

    def test_delete_by_key_reverts_slot(self):
        SiteImage.objects.create(key='contact_hero', image=make_image())
        self.client.force_authenticate(make_user(staff=True))
        self.assertEqual(self.client.delete('/api/v1/site-images/contact_hero').status_code, 204)
        self.assertFalse(SiteImage.objects.exists())

    def test_non_staff_cannot_upload(self):
        self.client.force_authenticate(make_user())
        res = self.client.post('/api/v1/site-images', {'key': 'home_hero', 'image': make_image()}, format='multipart')
        self.assertEqual(res.status_code, 403)


class ProjectAndTestimonialApiTests(APITestCase):
    def test_projects_public_hides_inactive(self):
        Project.objects.create(title='Live', sector='Hotel', image=make_image())
        Project.objects.create(title='Draft', sector='Hotel', image=make_image(), is_active=False)
        res = self.client.get('/api/v1/projects')
        self.assertEqual([p['title'] for p in res.data], ['Live'])
        self.client.force_authenticate(make_user(staff=True))
        self.assertEqual(len(self.client.get('/api/v1/projects').data), 2)

    def test_staff_creates_project(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post(
            '/api/v1/projects',
            {'title': 'Bakery line', 'sector': 'Bakery', 'image': make_image()},
            format='multipart',
        )
        self.assertEqual(res.status_code, 201, res.data)

    def test_testimonials_public_hides_inactive(self):
        Testimonial.objects.create(quote='Great', source='Client A')
        Testimonial.objects.create(quote='Hidden', source='Client B', is_active=False)
        res = self.client.get('/api/v1/testimonials')
        self.assertEqual([t['source'] for t in res.data], ['Client A'])
