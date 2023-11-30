from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from django.test import TestCase
from django.test import LiveServerTestCase

from .models import CustomUser
import time

class GuestInterfaceSeleniumTest(TestCase):
    def setUp(self):
        # Set up the Selenium WebDriver using Chrome without specifying executable_path
        self.driver = Chrome()

    def tearDown(self):
        # Delete the test user
        CustomUser.objects.filter(username="TestUser").delete()
        # Close the Selenium WebDriver
        self.driver.quit()

    def test_register_and_login_user(self):
        # Open the registration page
        self.driver.get("http://127.0.0.1:8000/register/")

        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys("TestUser")
        self.driver.find_element(By.ID, "password").send_keys("TestPassword")

        # Explicitly wait for the user_type element to be present
        try:
            user_type_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "user_type"))
            )
        except TimeoutException:
            self.fail("Timed out waiting for user_type element to be present")

        # Select user type from the dropdown
        user_type_dropdown = Select(user_type_element)
        user_type_dropdown.select_by_visible_text("Guest")  # Replace "Guest" with the desired option text

        # Submit the form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the success notification
        time.sleep(2)

        # Verify the success notification
        # notification = self.driver.find_element(By.ID, "successNotification")
        # self.assertIn("User registered successfully.", notification.text)

        # Now, navigate to the login page
        self.driver.get("http://127.0.0.1:8000/")
        time.sleep(2)

        # Fill in the login form
        self.driver.find_element(By.ID, "username").send_keys("TestUser")
        self.driver.find_element(By.ID, "password").send_keys("TestPassword")

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the login to complete (you might need to wait for a redirect or a success message)
        time.sleep(2)

       
        # Assert that the login was successful
        print(f"Current URL: {self.driver.current_url}")
        # Print a message before the assertion
        print("Checking if the user is correctly registered and logged in...")

        # Assert that the login was successful
        self.assertTrue(self.driver.current_url == 'http://127.0.0.1:8000/guest_index/', "Test user was not correctly registered and logged")

        # Optional: Print a message after the assertion
        print("Test completed.")

        

class MaintenanceInterfaceSeleniumTest(LiveServerTestCase):
    def setUp(self):
        # Set up the Selenium WebDriver using Chrome without specifying executable_path
        self.driver = Chrome()

    def tearDown(self):
        # Close the Selenium WebDriver
        self.driver.quit()

    def test_register_and_login_user(self):
        # Open the registration page
        self.driver.get(self.live_server_url + "/register/")

        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys("TestMaintenanceUser")
        self.driver.find_element(By.ID, "password").send_keys("TestMaintenancePassword")

        # Explicitly wait for the user_type element to be present
        try:
            user_type_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "user_type"))
            )
        except TimeoutException:
            self.fail("Timed out waiting for user_type element to be present")

        # Select user type from the dropdown
        user_type_dropdown = Select(user_type_element)
        user_type_dropdown.select_by_visible_text("Maintenance")  

        # Submit the form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the success notification
        time.sleep(2)

        # Now, navigate to the login page
        self.driver.get(self.live_server_url + "/")
        time.sleep(2)

        # Fill in the login form
        self.driver.find_element(By.ID, "username").send_keys("TestMaintenanceUser")
        self.driver.find_element(By.ID, "password").send_keys("TestMaintenancePassword")

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the login to complete
        time.sleep(2)

        # Assert that the login was successful
        self.assertEqual(self.driver.current_url, self.live_server_url + '/maintenance_index/', "Test user was not correctly registered and logged")

        # Optional: Print a message after the assertion
        print("Test completed.")