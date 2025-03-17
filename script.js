// Login Function
function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('Please enter both username and password.');
    }
}

// Toggle Password Visibility
document.getElementById('togglePassword')?.addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.textContent = '🙈'; // Change icon
    } else {
        passwordField.type = 'password';
        this.textContent = '👁️'; // Change back
    }
});

// Create Ticket
function createTicket() {
    const customerName = document.getElementById('customerName').value.trim();
    const ticketTitle = document.getElementById('ticketTitle').value.trim();
    const ticketStatus = document.getElementById('ticketStatus').value;

    if (!customerName || !ticketTitle) {
        alert("Please fill out all fields.");
        return;
    }

    const ticket = document.createElement('div');
    ticket.classList.add('ticket');
    ticket.setAttribute('draggable', true);
    ticket.innerHTML = `<strong>${ticketTitle}</strong><br>${customerName} <button class='delete-btn' onclick='deleteTicket(this)'>❌</button>`;
    ticket.addEventListener('dragstart', drag);

    document.getElementById(ticketStatus).appendChild(ticket);
    saveTickets();
}

// Delete Ticket
function deleteTicket(button) {
    button.parentElement.remove();
    saveTickets();
}

// Drag Functions
function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.outerHTML);
    setTimeout(() => event.target.remove(), 0);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const targetColumn = event.target.closest('.ticket-column');

    if (targetColumn && targetColumn.id !== 'Closed') {
        targetColumn.innerHTML += data;
        saveTickets();
    } else {
        alert("Tickets cannot be moved to 'Closed'.");
    }
}

// Save & Load Tickets
function saveTickets() {
    localStorage.setItem('tickets', document.querySelector('.ticket-sections').innerHTML);
}

function loadTickets() {
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
        document.querySelector('.ticket-sections').innerHTML = savedTickets;
        document.querySelectorAll('.ticket').forEach(ticket => {
            ticket.setAttribute('draggable', true);
            ticket.addEventListener('dragstart', drag);
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '❌';
            deleteBtn.onclick = function () { deleteTicket(this); };
            ticket.appendChild(deleteBtn);
        });
    }
}

// Load Data on Page Load
window.onload = function () {
    if (document.querySelector('.ticket-sections')) {
        loadTickets();
    }
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    } else if (isLoggedIn && window.location.href.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    // Login page specific
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        togglePassword.addEventListener('click', function () {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ?
                '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Dashboard specific
    const ticketFormContainer = document.getElementById('ticketFormContainer');
    if (ticketFormContainer) {
        const showFormBtn = document.getElementById('showFormBtn');
        const closeFormBtn = document.getElementById('closeFormBtn');

        showFormBtn.addEventListener('click', function () {
            ticketFormContainer.classList.add('active');
        });

        closeFormBtn.addEventListener('click', function () {
            ticketFormContainer.classList.remove('active');
        });
    }
});
