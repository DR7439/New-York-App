from locust import HttpUser, TaskSet, task, between
import random

class WebsiteTasks(TaskSet):
    def on_start(self):
        self.register()
        self.login()

    def register(self):
        username = f"user{random.randint(1000, 9999)}"
        response = self.client.post("/api/register/", json={"username": username, "email": f"{username}@example.com", "password": "blahblah"})
        if response.status_code != 201:
            print("Registration failed", response.status_code, response.text)

    def login(self):
        response = self.client.post("/api/login/", json={"username": "test", "password": "1234"})
        if response.status_code == 200:
            data = response.json()
            self.token = data['token']
            self.sessionid = data['sessionid']

            # Update headers with the Authorization token
            self.client.headers.update({'Authorization': f'Bearer {self.token}'})

            # Set the session ID cookie
            self.client.cookies.set('sessionid', self.sessionid)
        else:
            print("Login failed", response.status_code, response.text)

    @task
    def view_interests(self):
        response = self.client.get("/api/interests/")
        if response.status_code != 200:
            print("Failed to get interests", response.status_code, response.text)

    @task
    def search(self):
        response = self.client.post("/api/search/", json={
            "id": 9,
            "name": "123",
            "user": 1,
            "start_date": "2024-03-12",
            "end_date": "2024-04-12",
            "date_search_made_on": "0121-04-24",
            "target_market_interests": ["Music", "Technology"],
            "target_age": [8, 3, 6],
            "gender": "M"
        })
        if response.status_code != 201:
            print("Search creation failed", response.status_code, response.text)

    @task
    def view_searches(self):
        response = self.client.get("/api/search/")
        if response.status_code != 200:
            print("Failed to get searches", response.status_code, response.text)

    @task
    def single_search(self):
        response = self.client.get("/api/search/5/")
        if response.status_code != 200:
            print("Failed to get single search", response.status_code, response.text)

    @task
    def delete_search(self):
        response = self.client.delete("/api/search/5/")
        if response.status_code != 204:
            print("Failed to delete search", response.status_code, response.text)

    @task
    def search_scores(self):
        response = self.client.get("/api/searches/2/scores/")
        if response.status_code != 200:
            print("Failed to get search scores", response.status_code, response.text)

    @task
    def top_scores(self):
        response = self.client.get("/api/searches/2/top-scores/10/")
        if response.status_code != 200:
            print("Failed to get top scores", response.status_code, response.text)

    @task
    def zone_details(self):
        response = self.client.get("/api/zones/4/details/")
        if response.status_code != 200:
            print("Failed to get zone details", response.status_code, response.text)

    @task
    def zones(self):
        response = self.client.get("/api/zones/")
        if response.status_code != 200:
            print("Failed to get zones", response.status_code, response.text)

    @task
    def password_reset(self):
        response = self.client.post("/api/password-reset/", json={"email": "blah@blahmail.com"})
        if response.status_code != 200:
            print("Password reset failed", response.status_code, response.text)

    @task
    def password_reset_confirm(self):
        # Mocking token and uid for the example
        uidb64 = "dummy_uid"
        token = "dummy_token"
        response = self.client.post(f"/api/reset-password/{uidb64}/{token}/", json={"password": "newpword"})
        if response.status_code != 200:
            print("Password reset confirm failed", response.status_code, response.text)

class WebsiteUser(HttpUser):
    tasks = [WebsiteTasks]
    wait_time = between(1, 5)
