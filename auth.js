// User roles and data
const users = {
    Admin: [
        { id: 'admin1', name: 'Admin User', role: 'Admin', status: 'active' }
    ],
    Leader: [
        { id: 'leader1', name: 'Leader 1', role: 'Leader', status: 'active' },
        { id: 'leader2', name: 'Leader 2', role: 'Leader', status: 'active' },
        { id: 'leader3', name: 'Leader 3', role: 'Leader', status: 'active' },
        { id: 'leader4', name: 'Leader 4', role: 'Leader', status: 'active' },
        { id: 'leader5', name: 'Leader 5', role: 'Leader', status: 'active' }
    ],
    Employee: [
        { id: 'emp1', name: 'Employee 1', role: 'Employee', status: 'active' },
        { id: 'emp2', name: 'Employee 2', role: 'Employee', status: 'active' },
        { id: 'emp3', name: 'Employee 3', role: 'Employee', status: 'active' },
        { id: 'emp4', name: 'Employee 4', role: 'Employee', status: 'active' },
        { id: 'emp5', name: 'Employee 5', role: 'Employee', status: 'active' },
        { id: 'emp6', name: 'Employee 6', role: 'Employee', status: 'active' },
        { id: 'emp7', name: 'Employee 7', role: 'Employee', status: 'active' },
        { id: 'emp8', name: 'Employee 8', role: 'Employee', status: 'active' },
        { id: 'emp9', name: 'Employee 9', role: 'Employee', status: 'active' },
        { id: 'emp10', name: 'Employee 10', role: 'Employee', status: 'active' },
        { id: 'emp11', name: 'Employee 11', role: 'Employee', status: 'active' },
        { id: 'emp12', name: 'Employee 12', role: 'Employee', status: 'active' },
        { id: 'emp13', name: 'Employee 13', role: 'Employee', status: 'active' },
        { id: 'emp14', name: 'Employee 14', role: 'Employee', status: 'active' },
        { id: 'emp15', name: 'Employee 15', role: 'Employee', status: 'active' },
        { id: 'emp16', name: 'Employee 16', role: 'Employee', status: 'active' },
        { id: 'emp17', name: 'Employee 17', role: 'Employee', status: 'active' },
        { id: 'emp18', name: 'Employee 18', role: 'Employee', status: 'active' },
        { id: 'emp19', name: 'Employee 19', role: 'Employee', status: 'active' },
        { id: 'emp20', name: 'Employee 20', role: 'Employee', status: 'active' }
    ]
};

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboard = document.getElementById('dashboard');
const userList = document.getElementById('userList');
const tabButtons = document.querySelectorAll('.tab-btn');
const userSearch = document.getElementById('userSearch');
const userFilter = document.getElementById('userFilter');
const userName = document.getElementById('userName');
const userRole = document.getElementById('userRole');
const logoutBtn = document.getElementById('logoutBtn');

// Current user state
let currentUser = null;

// Initialize user selection interface
function initializeUserSelection() {
    // Set up tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Show users for selected role
            showUsersForRole(button.dataset.role);
        });
    });

    // Set up search functionality
    userSearch.addEventListener('input', () => {
        const activeRole = document.querySelector('.tab-btn.active').dataset.role;
        showUsersForRole(activeRole);
    });

    // Set up filter functionality
    userFilter.addEventListener('change', () => {
        const activeRole = document.querySelector('.tab-btn.active').dataset.role;
        showUsersForRole(activeRole);
    });

    // Show initial users (Admin tab)
    showUsersForRole('Admin');
}

// Show users for selected role
function showUsersForRole(role) {
    const searchTerm = userSearch.value.toLowerCase();
    const filterValue = userFilter.value;
    const roleUsers = users[role];

    const filteredUsers = roleUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || user.status === filterValue;
        return matchesSearch && matchesFilter;
    });

    const usersGrid = userList.querySelector('.users-grid');
    usersGrid.innerHTML = '';

    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <h4>${user.name}</h4>
                <span class="role-badge">${user.role}</span>
                <span class="status-badge ${user.status}">${user.status}</span>
            </div>
        `;
        userCard.addEventListener('click', () => handleUserSelection(user));
        usersGrid.appendChild(userCard);
    });
}

// Handle user selection
function handleUserSelection(user) {
    currentUser = user;
    userName.textContent = user.name;
    userRole.textContent = user.role;
    // Hide login section and show dashboard
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    // Initialize all dashboard features after login
    if (typeof initializeDashboardFeatures === 'function') {
        initializeDashboardFeatures();
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    dashboard.classList.add('hidden');
    loginSection.classList.remove('hidden');
    
    // Reset search and filter
    userSearch.value = '';
    userFilter.value = 'all';
    
    // Show initial users
    showUsersForRole('Admin');
}

// Initialize dashboard
function initializeDashboard() {
    // Set up logout button
    logoutBtn.addEventListener('click', handleLogout);

    // Initialize other dashboard components based on user role
    if (currentUser.role === 'Admin') {
        // Initialize admin-specific features
        initializeAdminDashboard();
    } else if (currentUser.role === 'Leader') {
        // Initialize leader-specific features
        initializeLeaderDashboard();
    } else {
        // Initialize employee-specific features
        initializeEmployeeDashboard();
    }
}

// Initialize admin dashboard
function initializeAdminDashboard() {
    // Add admin-specific initialization code here
    console.log('Initializing admin dashboard');
}

// Initialize leader dashboard
function initializeLeaderDashboard() {
    // Add leader-specific initialization code here
    console.log('Initializing leader dashboard');
}

// Initialize employee dashboard
function initializeEmployeeDashboard() {
    // Add employee-specific initialization code here
    console.log('Initializing employee dashboard');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeUserSelection();
}); 