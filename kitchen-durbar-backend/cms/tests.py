from rest_framework.test import APITestCase

from common.testing import make_image, make_user

from .models import Project, SiteImage, Solution, Testimonial


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


class FeedbackApiTests(APITestCase):
    def test_public_feedback_is_shown_immediately(self):
        res = self.client.post('/api/v1/testimonials', {'source': 'Ram', 'rating': 4, 'quote': 'Great work', 'display_order': 99})
        self.assertEqual(res.status_code, 201, res.data)
        feedback = Testimonial.objects.get()
        self.assertEqual((feedback.rating, feedback.is_active, feedback.display_order), (4, True, 0))
        self.assertEqual([t['quote'] for t in self.client.get('/api/v1/testimonials').data], ['Great work'])

    def test_rating_required_and_bounded(self):
        self.assertEqual(self.client.post('/api/v1/testimonials', {'source': 'Ram', 'quote': 'Hi'}).status_code, 400)
        self.assertEqual(
            self.client.post('/api/v1/testimonials', {'source': 'Ram', 'quote': 'Hi', 'rating': 6}).status_code, 400
        )

    def test_staff_create_is_visible(self):
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.post('/api/v1/testimonials', {'source': 'Hotel', 'quote': 'Superb', 'rating': 5}, format='json')
        self.assertEqual(res.status_code, 201, res.data)
        self.assertTrue(Testimonial.objects.get().is_active)

    def test_public_cannot_edit(self):
        t = Testimonial.objects.create(quote='Great', source='Client A')
        self.assertEqual(self.client.patch(f'/api/v1/testimonials/{t.id}', {'is_active': False}).status_code, 401)


class SolutionApiTests(APITestCase):
    def test_seeded_with_banquet_central_and_cloud_kitchen(self):
        titles = [s['title'] for s in self.client.get('/api/v1/solutions').data]
        for title in ('Banquet', 'Central Kitchen', 'Cloud Kitchen'):
            self.assertIn(title, titles)

    def test_staff_can_edit_public_cannot(self):
        solution = Solution.objects.get(title='Cloud Kitchen')
        self.assertEqual(self.client.patch(f'/api/v1/solutions/{solution.id}', {'title': 'X'}).status_code, 401)
        self.client.force_authenticate(make_user(staff=True))
        res = self.client.patch(f'/api/v1/solutions/{solution.id}', {'description': 'Delivery-first kitchens.'})
        self.assertEqual(res.status_code, 200, res.data)
        solution.refresh_from_db()
        self.assertEqual(solution.description, 'Delivery-first kitchens.')
