// Firebase Authentication and User Management
let currentUser = null;
let allUsers = [];

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

// Initialize Firebase Auth and User Management
function initializeFirebaseAuth() {
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not initialized. Please check firebase-config.js');
        loadDemoUsers(); // Fallback to demo data
        return;
    }

    // Check if Firebase app is initialized
    try {
        if (!firebase.apps.length) {
            console.error('Firebase app not initialized. Please check firebase-config.js');
            loadDemoUsers(); // Fallback to demo data
            return;
        }
        
        console.log('Firebase initialized successfully');
        
        // Load all users for the selection interface
        loadAllUsers();
    } catch (error) {
        console.error('Error checking Firebase initialization:', error);
        loadDemoUsers(); // Fallback to demo data
    }
}

// Load all users from Firestore
function loadAllUsers() {
    if (typeof firebase === 'undefined') {
        loadDemoUsers();
        return;
    }

    try {
        firebase.firestore().collection('users').get()
            .then((querySnapshot) => {
                allUsers = [];
                querySnapshot.forEach((doc) => {
                    allUsers.push({ id: doc.id, ...doc.data() });
                });
                console.log('Loaded users from Firestore:', allUsers);
                
                // Update global window variable
                window.allUsers = allUsers;
                
                // If no users in Firestore, load demo data
                if (allUsers.length === 0) {
                    console.log('No users found in Firestore, loading demo data...');
                    loadDemoUsers();
                } else {
                    initializeUserSelection();
                }
            })
            .catch((error) => {
                console.error('Error loading users from Firestore:', error);
                // Fallback to demo data if Firebase fails
                loadDemoUsers();
            });
    } catch (error) {
        console.error('Error accessing Firestore:', error);
        loadDemoUsers();
    }
}

// Demo users for testing (fallback)
function loadDemoUsers() {
    allUsers = [
        { id: 'admin1', name: 'Admin User', role: 'Admin', status: 'active', email: 'admin@company.com' },
        { id: 'leader1', name: 'Leader 1', role: 'Leader', status: 'active', email: 'leader1@company.com' },
        { id: 'leader2', name: 'Leader 2', role: 'Leader', status: 'active', email: 'leader2@company.com' },
        { id: 'leader3', name: 'Leader 3', role: 'Leader', status: 'active', email: 'leader3@company.com' },
        { id: 'leader4', name: 'Leader 4', role: 'Leader', status: 'active', email: 'leader4@company.com' },
        { id: 'leader5', name: 'Leader 5', role: 'Leader', status: 'active', email: 'leader5@company.com' },
        { id: 'emp1', name: 'Employee 1', role: 'Employee', status: 'active', email: 'emp1@company.com' },
        { id: 'emp2', name: 'Employee 2', role: 'Employee', status: 'active', email: 'emp2@company.com' },
        { id: 'emp3', name: 'Employee 3', role: 'Employee', status: 'active', email: 'emp3@company.com' },
        { id: 'emp4', name: 'Employee 4', role: 'Employee', status: 'active', email: 'emp4@company.com' },
        { id: 'emp5', name: 'Employee 5', role: 'Employee', status: 'active', email: 'emp5@company.com' },
        { id: 'emp6', name: 'Employee 6', role: 'Employee', status: 'active', email: 'emp6@company.com' },
        { id: 'emp7', name: 'Employee 7', role: 'Employee', status: 'active', email: 'emp7@company.com' },
        { id: 'emp8', name: 'Employee 8', role: 'Employee', status: 'active', email: 'emp8@company.com' },
        { id: 'emp9', name: 'Employee 9', role: 'Employee', status: 'active', email: 'emp9@company.com' },
        { id: 'emp10', name: 'Employee 10', role: 'Employee', status: 'active', email: 'emp10@company.com' },
        { id: 'emp11', name: 'Employee 11', role: 'Employee', status: 'active', email: 'emp11@company.com' },
        { id: 'emp12', name: 'Employee 12', role: 'Employee', status: 'active', email: 'emp12@company.com' },
        { id: 'emp13', name: 'Employee 13', role: 'Employee', status: 'active', email: 'emp13@company.com' },
        { id: 'emp14', name: 'Employee 14', role: 'Employee', status: 'active', email: 'emp14@company.com' },
        { id: 'emp15', name: 'Employee 15', role: 'Employee', status: 'active', email: 'emp15@company.com' },
        { id: 'emp16', name: 'Employee 16', role: 'Employee', status: 'active', email: 'emp16@company.com' },
        { id: 'emp17', name: 'Employee 17', role: 'Employee', status: 'active', email: 'emp17@company.com' },
        { id: 'emp18', name: 'Employee 18', role: 'Employee', status: 'active', email: 'emp18@company.com' },
        { id: 'emp19', name: 'Employee 19', role: 'Employee', status: 'active', email: 'emp19@company.com' },
        { id: 'emp20', name: 'Employee 20', role: 'Employee', status: 'active', email: 'emp20@company.com' }
    ];
    console.log('Loaded demo users:', allUsers);
    
    // Update global window variable
    window.allUsers = allUsers;
    
    initializeUserSelection();
}

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
    const roleUsers = allUsers.filter(user => user.role === role);

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

// Handle user selection (simulated login)
function handleUserSelection(user) {
    currentUser = user;
    window.currentUser = user; // Update global variable
    userName.textContent = user.name;
    userRole.textContent = user.role;
    
    // Hide login section and show dashboard
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Initialize dashboard features
    if (typeof initializeDashboard === 'function') {
        initializeDashboard();
    }
}

// Show login section
function showLoginSection() {
    currentUser = null;
    window.currentUser = null; // Update global variable
    dashboard.classList.add('hidden');
    loginSection.classList.remove('hidden');
    
    // Reset search and filter
    userSearch.value = '';
    userFilter.value = 'all';
    
    // Show initial users
    showUsersForRole('Admin');
}

// Show dashboard
function showDashboard() {
    userName.textContent = currentUser.name;
    userRole.textContent = currentUser.role;
    
    loginSection.classList.add('hidden');
    dashboard.classList.remove('hidden');
    
    // Initialize dashboard features
    if (typeof initializeDashboard === 'function') {
        initializeDashboard();
    }
}

// Handle logout
function handleLogout() {
    // Sign out from Firebase if available
    if (typeof firebase !== 'undefined') {
        firebase.auth().signOut().then(() => {
            console.log('User signed out successfully');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }
    
    // Reset local state
    currentUser = null;
    window.currentUser = null; // Update global variable
    showLoginSection();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase Auth
    initializeFirebaseAuth();
    
    // Set up logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Set up Firebase setup button
    const setupBtn = document.getElementById('setupFirebaseBtn');
    if (setupBtn) {
        setupBtn.addEventListener('click', handleFirebaseSetup);
    }
    
    // Set up Firebase test button
    const testBtn = document.getElementById('testFirebaseBtn');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            if (typeof testFirebaseConnection === 'function') {
                testFirebaseConnection();
            } else {
                alert('Firebase test function not available. Please check console for errors.');
            }
        });
    }
});

// Handle Firebase setup
async function handleFirebaseSetup() {
    const setupBtn = document.getElementById('setupFirebaseBtn');
    if (!setupBtn) return;
    
    // Disable button and show loading
    setupBtn.disabled = true;
    setupBtn.textContent = '⏳ Setting up...';
    
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            alert('Firebase is not initialized. Please check your configuration.');
            return;
        }
        
        // Check if populateAllCollections function exists
        if (typeof window.populateAllCollections === 'function') {
            await window.populateAllCollections();
            alert('✅ Firebase data setup completed successfully!\n\nYou can now log in and see the DSCs.');
        } else {
            // Fallback: manually populate data
            await populateFirebaseData();
            alert('✅ Firebase data setup completed successfully!\n\nYou can now log in and see the DSCs.');
        }
        
        // Refresh the page to show new data
        setTimeout(() => {
            location.reload();
        }, 1000);
        
    } catch (error) {
        console.error('Error setting up Firebase data:', error);
        alert('❌ Error setting up Firebase data. Please check the console for details.');
    } finally {
        // Re-enable button
        setupBtn.disabled = false;
        setupBtn.textContent = '🔧 Setup Firebase Data';
    }
}

// Manual Firebase data population (fallback)
async function populateFirebaseData() {
    console.log('🚀 Starting manual Firebase setup...');
    
    // Sample Users Data
    const sampleUsers = [
        { id: 'admin1', name: 'Admin User', role: 'Admin', status: 'active', email: 'admin@company.com' },
        { id: 'leader1', name: 'Leader 1', role: 'Leader', status: 'active', email: 'leader1@company.com' },
        { id: 'leader2', name: 'Leader 2', role: 'Leader', status: 'active', email: 'leader2@company.com' },
        { id: 'leader3', name: 'Leader 3', role: 'Leader', status: 'active', email: 'leader3@company.com' },
        { id: 'leader4', name: 'Leader 4', role: 'Leader', status: 'active', email: 'leader4@company.com' },
        { id: 'leader5', name: 'Leader 5', role: 'Leader', status: 'active', email: 'leader5@company.com' },
        { id: 'emp1', name: 'Employee 1', role: 'Employee', status: 'active', email: 'emp1@company.com' },
        { id: 'emp2', name: 'Employee 2', role: 'Employee', status: 'active', email: 'emp2@company.com' },
        { id: 'emp3', name: 'Employee 3', role: 'Employee', status: 'active', email: 'emp3@company.com' },
        { id: 'emp4', name: 'Employee 4', role: 'Employee', status: 'active', email: 'emp4@company.com' },
        { id: 'emp5', name: 'Employee 5', role: 'Employee', status: 'active', email: 'emp5@company.com' },
        { id: 'emp6', name: 'Employee 6', role: 'Employee', status: 'active', email: 'emp6@company.com' },
        { id: 'emp7', name: 'Employee 7', role: 'Employee', status: 'active', email: 'emp7@company.com' },
        { id: 'emp8', name: 'Employee 8', role: 'Employee', status: 'active', email: 'emp8@company.com' },
        { id: 'emp9', name: 'Employee 9', role: 'Employee', status: 'active', email: 'emp9@company.com' },
        { id: 'emp10', name: 'Employee 10', role: 'Employee', status: 'active', email: 'emp10@company.com' },
        { id: 'emp11', name: 'Employee 11', role: 'Employee', status: 'active', email: 'emp11@company.com' },
        { id: 'emp12', name: 'Employee 12', role: 'Employee', status: 'active', email: 'emp12@company.com' },
        { id: 'emp13', name: 'Employee 13', role: 'Employee', status: 'active', email: 'emp13@company.com' },
        { id: 'emp14', name: 'Employee 14', role: 'Employee', status: 'active', email: 'emp14@company.com' },
        { id: 'emp15', name: 'Employee 15', role: 'Employee', status: 'active', email: 'emp15@company.com' },
        { id: 'emp16', name: 'Employee 16', role: 'Employee', status: 'active', email: 'emp16@company.com' },
        { id: 'emp17', name: 'Employee 17', role: 'Employee', status: 'active', email: 'emp17@company.com' },
        { id: 'emp18', name: 'Employee 18', role: 'Employee', status: 'active', email: 'emp18@company.com' },
        { id: 'emp19', name: 'Employee 19', role: 'Employee', status: 'active', email: 'emp19@company.com' },
        { id: 'emp20', name: 'Employee 20', role: 'Employee', status: 'active', email: 'emp20@company.com' }
    ];

    // Sample DSCs Data
    const sampleDSCs = [
        { id: 'dsc1', name: 'DSC for Employee 1', serialNumber: 'SN001', status: 'in_use', boxId: 'box1', subboxId: 'subbox1', assignedTo: 'emp1', expiryDate: '2024-12-31', clientAssociation: 'Client A' },
        { id: 'dsc2', name: 'DSC for Employee 2', serialNumber: 'SN002', status: 'in_use', boxId: 'box1', subboxId: 'subbox2', assignedTo: 'emp2', expiryDate: '2024-12-31', clientAssociation: 'Client B' },
        { id: 'dsc3', name: 'DSC for Employee 3', serialNumber: 'SN003', status: 'available', boxId: 'box1', subboxId: 'subbox3', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc4', name: 'DSC for Employee 4', serialNumber: 'SN004', status: 'available', boxId: 'box1', subboxId: 'subbox4', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc5', name: 'DSC for Employee 5', serialNumber: 'SN005', status: 'available', boxId: 'box1', subboxId: 'subbox5', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc6', name: 'DSC for Employee 6', serialNumber: 'SN006', status: 'available', boxId: 'box1', subboxId: 'subbox6', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc7', name: 'DSC for Employee 7', serialNumber: 'SN007', status: 'available', boxId: 'box1', subboxId: 'subbox7', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc8', name: 'DSC for Employee 8', serialNumber: 'SN008', status: 'available', boxId: 'box1', subboxId: 'subbox8', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc9', name: 'DSC for Employee 9', serialNumber: 'SN009', status: 'available', boxId: 'box1', subboxId: 'subbox9', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc10', name: 'DSC for Employee 10', serialNumber: 'SN010', status: 'available', boxId: 'box2', subboxId: 'subbox1', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc11', name: 'DSC for Employee 11', serialNumber: 'SN011', status: 'available', boxId: 'box2', subboxId: 'subbox2', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc12', name: 'DSC for Employee 12', serialNumber: 'SN012', status: 'available', boxId: 'box2', subboxId: 'subbox3', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc13', name: 'DSC for Employee 13', serialNumber: 'SN013', status: 'available', boxId: 'box2', subboxId: 'subbox4', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc14', name: 'DSC for Employee 14', serialNumber: 'SN014', status: 'available', boxId: 'box2', subboxId: 'subbox5', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc15', name: 'DSC for Employee 15', serialNumber: 'SN015', status: 'available', boxId: 'box2', subboxId: 'subbox6', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc16', name: 'DSC for Employee 16', serialNumber: 'SN016', status: 'available', boxId: 'box2', subboxId: 'subbox7', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc17', name: 'DSC for Employee 17', serialNumber: 'SN017', status: 'available', boxId: 'box2', subboxId: 'subbox8', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' },
        { id: 'dsc18', name: 'DSC for Employee 18', serialNumber: 'SN018', status: 'available', boxId: 'box2', subboxId: 'subbox9', assignedTo: null, expiryDate: '2024-12-31', clientAssociation: '' }
    ];

    // Sample Settings Data
    const sampleSettings = {
        notificationDays: 30,
        notificationEmailTemplate: 'Dear {employee_name},\n\nYour Digital Signature Certificate (DSC) will expire on {expiry_date}. Please ensure to renew it before the expiry date to avoid any disruption in your work.\n\nCertificate Details:\n- Name: {dsc_name}\n- Serial Number: {serial_number}\n- Expiry Date: {expiry_date}\n\nBest regards,\nDSC Management Team',
        notificationInApp: true,
        notificationEmail: true,
        autoBackup: true,
        sessionTimeout: 30
    };

    try {
        // Populate users
        console.log('Populating users collection...');
        const userBatch = firebase.firestore().batch();
        sampleUsers.forEach(user => {
            const userRef = firebase.firestore().collection('users').doc(user.id);
            userBatch.set(userRef, user);
        });
        await userBatch.commit();
        console.log('✅ Users collection populated successfully!');

        // Populate DSCs
        console.log('Populating DSCs collection...');
        const dscBatch = firebase.firestore().batch();
        sampleDSCs.forEach(dsc => {
            const dscRef = firebase.firestore().collection('dscs').doc(dsc.id);
            dscBatch.set(dscRef, dsc);
        });
        await dscBatch.commit();
        console.log('✅ DSCs collection populated successfully!');

        // Populate settings
        console.log('Populating settings collection...');
        await firebase.firestore().collection('settings').doc('main').set(sampleSettings);
        console.log('✅ Settings collection populated successfully!');

        console.log('🎉 All collections populated successfully!');
        console.log('📊 Summary:');
        console.log(`   - Users: ${sampleUsers.length}`);
        console.log(`   - DSCs: ${sampleDSCs.length}`);
        console.log(`   - Settings: 1 document`);

    } catch (error) {
        console.error('❌ Error during setup:', error);
        throw error;
    }
}

// Export functions for use in other modules
window.handleUserSelection = handleUserSelection;
window.handleLogout = handleLogout;
window.currentUser = currentUser;
window.allUsers = allUsers;
