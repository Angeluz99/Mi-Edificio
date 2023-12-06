from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from django.test import TestCase
from django.test import LiveServerTestCase

from .models import CustomUser
import time

class GuestRegisterLogSeleniumTest(TestCase): #using LiveServerTestCase instead TestCase removes all the data from the test user automlly. SUPOSELLY
    def setUp(self):
        # Set up the Selenium WebDriver using Chrome without specifying executable_path
        self.driver = Chrome()

    def tearDown(self):

        self.driver.quit()

    def test_register_and_login_user(self):

        testGuestUsername = "TestUsername3"
        testGuestPassword = "TestPassword3"
        # Open the registration page
        self.driver.get("http://127.0.0.1:8000/register/")
        self.driver.maximize_window()


        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys(testGuestUsername)
        self.driver.find_element(By.ID, "password").send_keys(testGuestPassword)

        # Explicitly wait for the user_type element to be present
        try:
            user_type_element = WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.ID, "user_type"))
            )
        except TimeoutException:
            self.fail("Timed out waiting for user_type element to be present")

        # Select user type from the dropdown
        user_type_dropdown = Select(user_type_element)
        user_type_dropdown.select_by_visible_text("Guest")  # Replace "Guest" with the desired option text

        # Submit the form
        time.sleep(4)
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        

        # Now, it should redirect to the login page
        time.sleep(5)

        # Fill in the login form
        self.driver.find_element(By.ID, "username").send_keys(testGuestUsername)
        self.driver.find_element(By.ID, "password").send_keys(testGuestPassword)

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the login to complete 
        time.sleep(1)

        # Assert that the login was successful
        print(f"Current URL: {self.driver.current_url}")
        # Print a message before the assertion
        print("Checking if the user is correctly registered and logged in...")

        # Assert that the login was successful
        self.assertTrue(self.driver.current_url == 'http://127.0.0.1:8000/guest_index/', "Test user was not correctly registered and logged")

        # Optional: Print a message after the assertion
        print("Test completed.")

        

class MaintenanceRegisterLogSeleniumTest(TestCase):
    def setUp(self):
        # Set up the Selenium WebDriver using Chrome without specifying executable_path
        self.driver = Chrome()

    def tearDown(self):
        # Close the Selenium WebDriver
        self.driver.quit()

    def test_register_and_login_user(self):

        testMaintenanceUsername = "MTestUsername3"
        testMaintenancePassword = "MTestPassword3"
        # Open the registration page
        self.driver.get("http://127.0.0.1:8000/register/")
        self.driver.maximize_window()


        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys(testMaintenanceUsername)
        self.driver.find_element(By.ID, "password").send_keys(testMaintenancePassword)

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
        time.sleep(2)
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        #Redirect to login

        time.sleep(5) #important give time to the elemnts to load.

        # Fill in the login form
        self.driver.find_element(By.ID, "username").send_keys(testMaintenanceUsername)
        self.driver.find_element(By.ID, "password").send_keys(testMaintenancePassword)

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        # Wait for the login to complete
        time.sleep(2)

        # Assert that the login was successful
        self.assertTrue(self.driver.current_url == 'http://127.0.0.1:8000/maintenance_index/', "Test user was not correctly registered and logged")

        # Optional: Print a message after the assertion
        print("Test completed.")


#test to create ticket and ensure it appears on maintenance


class TickeFlowSeleniumTest(TestCase):

    def setUp(self):
    # Set up the Selenium WebDriver using Chrome without specifying executable_path
        self.driver = Chrome()

    def tearDown(self):
        # Close the Selenium WebDriver
        self.driver.quit()

    def test_login_user(self):

        GuestUserNForTKTest = "Daniel"
        GuestPassWForTKTest = "password"
        #log in as guest
        self.driver.get("http://127.0.0.1:8000/")
        self.driver.maximize_window()


        time.sleep(1)
        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys(GuestUserNForTKTest)
        self.driver.find_element(By.ID, "password").send_keys(GuestPassWForTKTest)

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(1)
        # Open ticket
        self.driver.find_element(By.ID, "openTicketFormButton").click()
        time.sleep(1)
        # Fill in the ticket submission form
        title_input = self.driver.find_element(By.ID,"title")
        title_input.send_keys("Test Ticket title")

        title_description = self.driver.find_element(By.ID,"description")
        title_description.send_keys("Test Ticket description")

        title_description = self.driver.find_element(By.ID,"contact")
        title_description.send_keys("Test number")
        time.sleep(1)

     # Attach a picture (if applicable)
        picture_input = self.driver.find_element(By.ID,"picture")
        picture_input.send_keys("C:\\Users\\angel\\Downloads\\tool.jpg")
        time.sleep(1)

        # Submit the form
        submit_button = self.driver.find_element(By.ID, "submitTicket")
        submit_button.click()

        # Wait for the success notification
        time.sleep(3)  # Adjust the sleep duration as needed

        # log out
        logout_button = self.driver.find_element(By.ID, "logout-link")
        logout_button.click()

        #login as maintenance
        time.sleep(1)
        MaintenanceUserNForTKTest = "Contractor-1"
        MaintenancePassWForTKTest = "password"
        self.driver.get("http://127.0.0.1:8000/")
        self.driver.find_element(By.ID, "username").send_keys(MaintenanceUserNForTKTest)
        self.driver.find_element(By.ID, "password").send_keys(MaintenancePassWForTKTest)

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()

        time.sleep(1)

        rearrange_button = self.driver.find_element(By.ID, "oldestFirst")
        rearrange_button.click()



        # Verify that the new ticket is added to the list
        user_tickets = self.driver.find_element(By.ID,"allusersTickets")
        self.assertIn("Test Ticket title", user_tickets.text)
        time.sleep(5)
        

        # log out
        logout_button = self.driver.find_element(By.ID, "logout-link")
        logout_button.click()

        # log in back as guest
        time.sleep(1)
        # Fill in the registration form
        self.driver.find_element(By.ID, "username").send_keys(GuestUserNForTKTest)
        self.driver.find_element(By.ID, "password").send_keys(GuestPassWForTKTest)
        time.sleep(1)

        # Submit the login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        time.sleep(3)

        # delete test ticket
        delete_button = self.driver.find_element(By.ID,"delete-button")

        self.driver.execute_script("arguments[0].click();", delete_button)


        time.sleep(5)