from django.test import TestCase, Client
from django.contrib.auth.models import User
from main.models import Result, Run
from guest_user.models import is_guest_user

class LoginPage(TestCase):
    def setUp(self):
        self.url = '/login/'
        self.client = Client()
        self.username = 'test'
        self.email='test@test.ts'
        self.password='test_password'
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password
        )

    def test_template(self):
        self.response = self.client.get(self.url)
        self.assertTemplateUsed(self.response, 'login.html')

    def test_login_user(self):
        data = {'email': self.email,
                'password': self.password}
        response = self.client.post(self.url, data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response_json = response.json()
        self.assertIn('status', response_json)
        self.assertEqual(response_json['status'], 'OK')

    def test_login_non_existing_user(self):
        data = {'email': 'test_user@test.ts',
                'password': 'test_password'}
        response = self.client.post(self.url, data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertIsNotNone(response_json)

        self.assertIn('status', response_json)
        self.assertEqual(response_json['status'], 'ERROR')
        self.assertIn('reason', response_json)
        self.assertEqual(response_json['reason'], 'user_not_found')


class SignupPage(TestCase):
    def setUp(self):
        self.url = '/signup/'
        self.client = Client()
        self.username = 'test'
        self.email='test@test.ts'
        self.password='test_password'

    def test_template(self):
        self.response = self.client.get(self.url)
        self.assertTemplateUsed(self.response, 'login.html')

    def test_create_new_user(self):
        data = {'email': self.email,
                'password': self.password}
        response = self.client.post(self.url, data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response_json = response.json()

        self.assertIsNotNone(response_json)
        self.assertIn('status', response_json)
        self.assertEqual(response_json['status'], 'OK')

        user = User.objects.filter(email=self.email).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.email, self.email)

class GetHomePageCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'test'
        self.email='test@test.ts'
        self.password='test_password'
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password
        )
        self.response = self.client.get('/')

    def test_homepage(self):
        assert self.response.status_code == 200

    def test_template(self):
        self.assertTemplateUsed(self.response, 'home.html')

    def test_html(self):
        self.assertContains(self.response, '<form')
        self.assertContains(self.response, 'home.js')
        self.assertContains(self.response, 'home.css')

    def test_csrf(self):
        self.assertContains(self.response, 'csrfmiddlewaretoken')

    def test_guest_user(self):
        username = self.response.context.get('user')
        user = User.objects.get(username=username)
        assert is_guest_user(user)

    def test_existing_user(self):
        self.client.force_login(user=self.user)
        self.response = self.client.get('/')
        username = self.response.context.get('user')
        retrieved_user = User.objects.get(username=username)
        self.assertEqual(retrieved_user, self.user)


class ResultsCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'test'
        self.email='test@test.ts'
        self.password='test_password'
        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password
        )
        self.client.force_login(user=self.user)
        self.sequence = 'AAAAAACUAAUAGAGGGGGGACUUAGCGCCCCCCAAACCGUAACCCC'
        self.structure = '..............((((((.....[[[))))))....]]]......'
        self.result = Result.objects.create(sequence=self.sequence,
                                            structure=self.structure)
        self.run = Run.objects.create(user=self.user, result=self.result, status='CO')
        self.response = self.client.get('/results/?id='+self.run.id)


    def test_results_page(self):
        assert self.response.status_code == 200

    def test_template(self):
        self.assertTemplateUsed(self.response, 'results.html')

    def test_csrf(self):
        self.assertContains(self.response, 'csrfmiddlewaretoken')

    def test_html(self):
        self.assertContains(self.response, 'base.css')
        self.assertContains(self.response, 'results.css')
        self.assertContains(self.response, 'fornac.css')
        self.assertContains(self.response, 'download.js')
        self.assertContains(self.response, 'results.js')
        self.assertContains(self.response, 'fornac.js')

class GetTeamPageCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.response = self.client.get('/team/')

    def test_page(self):
        assert self.response.status_code == 200

    def test_template(self):
        self.assertTemplateUsed(self.response, 'team.html')

    def test_html(self):
        self.assertContains(self.response, 'base.css')
        self.assertContains(self.response, 'home.css')


class GetResearchPageCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.response = self.client.get('/research/')

    def test_page(self):
        assert self.response.status_code == 200

    def test_template(self):
        self.assertTemplateUsed(self.response, 'research.html')

    def test_html(self):
        self.assertContains(self.response, 'base.css')
        self.assertContains(self.response, 'home.css')
