const openButton = document.getElementById("openTicketFormButton");
const ticketForm = document.getElementById("ticketForm");
const submitButton = document.getElementById("submitTicket");
const cancelButton = document.getElementById("cancelTicket");

// Function to open the form as a pop-up
openButton.addEventListener("click", () => {
    ticketForm.style.display = "block";
});

// Function to close the pop-up
cancelButton.addEventListener("click", () => {
    ticketForm.style.display = "none";
});

// Function to submit the ticket data (you'll need to customize this)
submitButton.addEventListener("click", () => {
    // Retrieve data from the form fields
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    
    // Perform an AJAX request to submit the ticket data to the server
    // You may need to customize this part to fit your project's requirements
    
    // After successful submission, you can hide the form
    ticketForm.style.display = "none";
});