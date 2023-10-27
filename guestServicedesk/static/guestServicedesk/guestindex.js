const openButton = document.getElementById("openTicketFormButton");
const ticketForm = document.getElementById("ticketForm");
const submitButton = document.getElementById("submitTicket");
const cancelButton = document.getElementById("cancelTicket");
const userTicketsContainer = document.getElementById("userTickets"); // Moved this outside the function

/// Function to load and display the user's tickets, including titles and descriptions
function loadUserTickets() {
    const userTicketsContainer = document.getElementById("userTickets");

    // Make an AJAX request to the server to get user-specific tickets
    fetch('/get_user_tickets/') // Adjust the URL if necessary
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tickets = data.tickets; // Assuming the response contains user-specific tickets

                // Clear any previous content in the container
                userTicketsContainer.innerHTML = '';

                // Loop through the tickets and add them to the container
                tickets.forEach(ticket => {
                    const ticketDiv = document.createElement("div");

                    ticketDiv.innerHTML = `
                        <h3>${ticket.title}</h3>
                        <p>Description: ${ticket.description}</p>
                        <p>Category: ${ticket.category}</p>
                        <p>Apartment: ${ticket.apartment}</p>
                        <p>Status: ${ticket.status}</p> <!-- Display status -->
                        <p>Comments: ${ticket.comments}</p>

                        <p>Created At: ${ticket.created_at}</p>
                    `;
                    userTicketsContainer.appendChild(ticketDiv);
                });
            } else {
                // Handle errors
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}


// Function to fetch and display status for a specific ticket
function displayTicketStatus(ticketID) {
    // Make an AJAX request to the server to get status for the specified ticket
    fetch(`/get_ticket_status/?ticket_id=${ticketID}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const status = data.status; // Assuming the response contains status
                // Display the status in a popup or modal
                alert(`Status for Ticket ID ${ticketID}:\n${status}`);
            } else {
                // Handle errors
                console.error(data.message);
            }
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });
}

// Function to open the form as a pop-up
openButton.addEventListener("click", () => {
    ticketForm.style.display = "block";
});

// Function to close the pop-up
cancelButton.addEventListener("click", () => {
    ticketForm.style.display = "none";
});

// Function to submit a new ticket
submitButton.addEventListener("click", () => {
    // Retrieve data from the form fields
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const apartment = document.getElementById("apartment").value;
    const pictureInput = document.getElementById("picture"); // Get the file input element
    const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

    // Check if a file was selected
    if (pictureInput.files.length === 0) {
        alert("Please select a picture to upload.");
        return; // Do not submit the form without a picture
    }

    // Create a FormData object and append all form fields
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('apartment', apartment);
    formData.append('picture', pictureInput.files[0]); // Append the selected file

    // Send the form data to the server
    fetch('/submit_ticket/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // The ticket was successfully submitted
            console.log(data.message);

            // You can close the form here if needed
            ticketForm.style.display = "none";

            // Call loadUserTickets to update the ticket list
            loadUserTickets();
        } else {
            // Handle errors
            console.error(data.message);
        }
    })
    .catch(error => {
        // Handle any errors, e.g., display an error message
        console.error(error);
    });
});

// Call the function when the page loads
loadUserTickets(); // Now called when the page loads

