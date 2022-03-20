from django.test import TestCase, Client

# Create your tests here.
class GetHomePageCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_homepage(self):
        response = self.client.get('/')
        assert response.status_code == 200
        # test ideas: 
        # * cross origin
