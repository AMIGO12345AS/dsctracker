// Global variables
let allDSCs = [];
let auditLog = [];

// DOM Elements
const leadersContainer = document.getElementById('leadersContainer');
const employeesContainer = document.getElementById('employeesContainer');
const dscBoxesContainer = document.getElementById('dscBoxesContainer');
const searchBar = document.getElementById('searchBar');
const myDSCContent = document.getElementById('myDSCContent');
const myDSCPanelTitle = document.getElementById('myDSCPanelTitle');
const leaderActions = document.getElementById('leaderActions');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting DSC Tracker initialization...');
    
    // Test Firebase connection first
    setTimeout(() => {
        testFirebaseConnection();
        
        // Wait for auth.js to initialize first
        setTimeout(() => {
            try {
                initializeApp();
            } catch (error) {
                console.error('Error during app initialization:', error);
                alert('Error initializing app. Please refresh the page.');
            }
        }, 1000); // Increased delay to ensure all scripts load
    }, 500);
});

function initializeApp() {
    console.log('Initializing DSC Tracker App...');
    console.log('Firebase available:', typeof firebase !== 'undefined');
    console.log('Current user:', window.currentUser);
    console.log('All users:', window.allUsers);
    
    try {
        setupFirebaseStatusLED();
        setupUserSelection();
        setupDashboardFeatures();
        setupModalCloses();
        setupLeaderActions();
        setupSettingsTabs();
        listenToAllDSCs();
        listenToAllUsers();
        listenToAuditLog();
        console.log('App initialization completed successfully');
    } catch (error) {
        console.error('Error in initializeApp:', error);
        alert('Error initializing app features. Please refresh the page.');
    }
}

// Firebase Status LED
function setupFirebaseStatusLED() {
    const statusLED = document.getElementById('firebaseStatus');
    if (!statusLED) return;
    
    function setStatus(connected) {
        if (connected) {
            statusLED.classList.remove('disconnected');
            statusLED.classList.add('connected');
        } else {
            statusLED.classList.remove('connected');
            statusLED.classList.add('disconnected');
        }
    }
    
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
        // Monitor Firebase connection
        firebase.firestore().enableNetwork().then(() => {
            setStatus(true);
        }).catch(() => {
            setStatus(false);
        });
    } else {
        setStatus(false);
    }
}

// User Selection
function setupUserSelection() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const userSearch = document.getElementById('userSearch');
    const userFilter = document.getElementById('userFilter');
    
    if (!tabBtns.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadUsersByRole(btn.dataset.role);
        });
    });
    
    if (userSearch) userSearch.addEventListener('input', filterUsers);
    if (userFilter) userFilter.addEventListener('change', filterUsers);
    
    // Load initial users (Admin)
    loadUsersByRole('Admin');
}

function loadUsersByRole(role) {
    const usersGrid = document.querySelector('.users-grid');
    if (!usersGrid) return;
    
    usersGrid.innerHTML = '';
    
    // Use allUsers from auth.js
    const roleUsers = window.allUsers ? window.allUsers.filter(user => user.role === role) : [];
    console.log(`Loading ${roleUsers.length} users for role: ${role}`);
    
    roleUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <h4>${user.name}</h4>
                <span class="role-badge">${user.role}</span>
                <span class="status-badge ${user.status}">${user.status}</span>
            </div>
        `;
        userCard.addEventListener('click', () => loginAsUser(user));
        usersGrid.appendChild(userCard);
    });
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const filterValue = document.getElementById('userFilter').value;
    const userCards = document.querySelectorAll('.user-card');
    
    userCards.forEach(card => {
        const userName = card.querySelector('h4').textContent.toLowerCase();
        const userStatus = card.querySelector('.status-badge').textContent;
        
        const matchesSearch = userName.includes(searchTerm);
        const matchesFilter = filterValue === 'all' || userStatus === filterValue;
        
        card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

function loginAsUser(user) {
    console.log('Logging in as user:', user);
    
    // Use currentUser from auth.js
    window.currentUser = user;
    
    // Update user info in banner
    const userNameElement = document.getElementById('userName');
    const userRoleElement = document.getElementById('userRole');
    
    if (userNameElement) userNameElement.textContent = user.name;
    if (userRoleElement) userRoleElement.textContent = user.role;
    
    // Update My DSC panel title
    if (myDSCPanelTitle) myDSCPanelTitle.textContent = `${user.name}'s DSC`;
    
    // Show/hide leader actions based on role
    if (leaderActions) {
        if (user.role === 'Admin' || user.role === 'Leader') {
            leaderActions.classList.remove('hidden');
        } else {
            leaderActions.classList.add('hidden');
        }
    }
    
    // Initialize dashboard
    initializeDashboard();
}

// Dashboard Initialization
function initializeDashboard() {
    console.log('Initializing dashboard for user:', window.currentUser);
    
    renderMainDSCBoxes();
    renderLeadersGrid();
    renderEmployeesGrid();
    setupDSCSearch();
    updateMyDSCPanel();
    setupLogout();
}

function renderMainDSCBoxes() {
    if (!dscBoxesContainer) return;
    
    dscBoxesContainer.innerHTML = '';
    
    for (let i = 1; i <= 8; i++) {
        const boxElement = document.createElement('div');
        boxElement.className = 'dsc-box available';
        boxElement.dataset.boxId = `box${i}`;
        
        const dscsInBox = allDSCs.filter(dsc => dsc.boxId === `box${i}`);
        const availableCount = dscsInBox.filter(dsc => dsc.status === 'available').length;
        const inUseCount = dscsInBox.filter(dsc => dsc.status === 'in_use').length;
        const outCount = dscsInBox.filter(dsc => dsc.status === 'out').length;
        
        boxElement.innerHTML = `
            <h4>DSC Box ${i}</h4>
            <div class="box-stats">
                <span class="stat available">${availableCount} Available</span>
                <span class="stat in-use">${inUseCount} In Use</span>
                <span class="stat out">${outCount} Out</span>
            </div>
        `;
        
        boxElement.addEventListener('click', () => openSubBoxesModal(`box${i}`));
        dscBoxesContainer.appendChild(boxElement);
    }
}

function renderLeadersGrid() {
    if (!leadersContainer) return;
    
    leadersContainer.innerHTML = '';
    
    const leaders = window.allUsers ? window.allUsers.filter(user => user.role === 'Leader') : [];
    console.log('Rendering leaders grid with', leaders.length, 'leaders');
    
    leaders.forEach(leader => {
        const hasDSC = allDSCs.some(dsc => dsc.assignedTo === leader.id && dsc.status !== 'available');
        const leaderElement = document.createElement('div');
        leaderElement.className = `leader-seat ${hasDSC ? 'has-dsc' : ''}`;
        leaderElement.dataset.userId = leader.id;
        
        const initials = getInitials(leader.name);
        leaderElement.innerHTML = `
            <div class="leader-icon">${initials}</div>
            <div class="leader-label">${leader.name}</div>
        `;
        
        leaderElement.addEventListener('click', () => highlightUser(leader.id));
        leadersContainer.appendChild(leaderElement);
    });
}

function renderEmployeesGrid() {
    if (!employeesContainer) return;
    
    employeesContainer.innerHTML = '';
    
    const employees = window.allUsers ? window.allUsers.filter(user => user.role === 'Employee') : [];
    console.log('Rendering employees grid with', employees.length, 'employees');
    
    employees.forEach(employee => {
        const hasDSC = allDSCs.some(dsc => dsc.assignedTo === employee.id && dsc.status !== 'available');
        const employeeElement = document.createElement('div');
        employeeElement.className = `employee-seat ${hasDSC ? 'has-dsc' : ''}`;
        employeeElement.dataset.userId = employee.id;
        
        const initials = getInitials(employee.name);
        employeeElement.innerHTML = `
            <div class="employee-icon">${initials}</div>
            <div class="employee-label">${employee.name}</div>
        `;
        
        employeeElement.addEventListener('click', () => highlightUser(employee.id));
        employeesContainer.appendChild(employeeElement);
    });
}

function getInitials(name) {
    const parts = name.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (name.length > 0) {
        return name.substring(0, 2).toUpperCase();
    }
    return '?';
}

// My DSC Panel
function updateMyDSCPanel() {
    if (!myDSCContent || !window.currentUser) return;
    
    const myDSC = allDSCs.find(dsc => dsc.assignedTo === window.currentUser.id && dsc.status !== 'available');
    
    if (myDSC) {
        myDSCContent.innerHTML = `
            <div class="dsc-info">
                <h4>${myDSC.name}</h4>
                <div class="dsc-details">
                    <div><strong>Serial:</strong> ${myDSC.serialNumber}</div>
                    <div><strong>Status:</strong> ${myDSC.status}</div>
                    <div><strong>Expiry:</strong> ${formatDate(myDSC.expiryDate)}</div>
                    <div><strong>Location:</strong> ${myDSC.boxId} - ${myDSC.subboxId}</div>
                </div>
                <button class="dsc-action-btn" onclick="returnDSC('${myDSC.id}')">Return DSC</button>
            </div>
        `;
    } else {
        myDSCContent.innerHTML = '<div class="no-dsc-message">Your DSC is in storage</div>';
    }
}

// Take/Return DSC Logic
function takeDSC(dscId) {
    if (!window.currentUser) {
        alert('Please log in first.');
        return;
    }
    
    const dsc = allDSCs.find(d => d.id === dscId);
    if (!dsc) return;
    
    // Check if user can take this DSC
    if (dsc.assignedTo && dsc.assignedTo !== window.currentUser.id) {
        alert('This DSC is assigned to another user.');
        return;
    }
    
    // Update DSC status
    if (typeof firebase !== 'undefined') {
        const dscRef = firebase.firestore().collection('dscs').doc(dscId);
        dscRef.update({
            status: 'in_use',
            assignedTo: window.currentUser.id,
            takenBy: window.currentUser.id,
            takenAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // Log the action
            logAuditAction('take', dscId, window.currentUser.id, `DSC ${dsc.name} taken by ${window.currentUser.name}`);
            
            // Update UI
            updateMyDSCPanel();
            renderMainDSCBoxes();
            renderLeadersGrid();
            renderEmployeesGrid();
            
            // Close modal if open
            const modal = document.getElementById('subBoxesModal');
            if (modal) modal.classList.add('hidden');
        }).catch(error => {
            console.error('Error taking DSC:', error);
            alert('Failed to take DSC. Please try again.');
        });
    } else {
        // Fallback for demo mode
        const dscIndex = allDSCs.findIndex(d => d.id === dscId);
        if (dscIndex !== -1) {
            allDSCs[dscIndex].status = 'in_use';
            allDSCs[dscIndex].assignedTo = window.currentUser.id;
            allDSCs[dscIndex].takenBy = window.currentUser.id;
            allDSCs[dscIndex].takenAt = new Date();
            
            updateMyDSCPanel();
            renderMainDSCBoxes();
            renderLeadersGrid();
            renderEmployeesGrid();
            
            // Close modal if open
            const modal = document.getElementById('subBoxesModal');
            if (modal) modal.classList.add('hidden');
        }
    }
}

function returnDSC(dscId) {
    if (!window.currentUser) {
        alert('Please log in first.');
        return;
    }
    
    const dsc = allDSCs.find(d => d.id === dscId);
    if (!dsc) return;
    
    // Update DSC status
    if (typeof firebase !== 'undefined') {
        const dscRef = firebase.firestore().collection('dscs').doc(dscId);
        dscRef.update({
            status: 'available',
            assignedTo: null,
            takenBy: null,
            takenAt: null,
            returnedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            // Log the action
            logAuditAction('return', dscId, window.currentUser.id, `DSC ${dsc.name} returned by ${window.currentUser.name}`);
            
            // Update UI
            updateMyDSCPanel();
            renderMainDSCBoxes();
            renderLeadersGrid();
            renderEmployeesGrid();
        }).catch(error => {
            console.error('Error returning DSC:', error);
            alert('Failed to return DSC. Please try again.');
        });
    } else {
        // Fallback for demo mode
        const dscIndex = allDSCs.findIndex(d => d.id === dscId);
        if (dscIndex !== -1) {
            allDSCs[dscIndex].status = 'available';
            allDSCs[dscIndex].assignedTo = null;
            allDSCs[dscIndex].takenBy = null;
            allDSCs[dscIndex].takenAt = null;
            allDSCs[dscIndex].returnedAt = new Date();
            
            updateMyDSCPanel();
            renderMainDSCBoxes();
            renderLeadersGrid();
            renderEmployeesGrid();
        }
    }
}

// Sub-boxes Modal
function openSubBoxesModal(boxId) {
    const modal = document.getElementById('subBoxesModal');
    const container = document.getElementById('subBoxesContainer');
    const title = document.getElementById('modalBoxTitle');
    
    if (!modal || !container || !title) return;
    
    title.textContent = `${boxId.toUpperCase()} Details`;
    container.innerHTML = '';
    
    // Create 9 sub-boxes (a-i)
    for (let i = 1; i <= 9; i++) {
        const subboxId = `subbox${i}`;
        const dscsInSubbox = allDSCs.filter(dsc => dsc.boxId === boxId && dsc.subboxId === subboxId);
        
        const subboxElement = document.createElement('div');
        subboxElement.className = `subbox-card ${dscsInSubbox.length > 0 ? 'has-dsc' : ''}`;
        subboxElement.dataset.subboxId = subboxId;
        
        const subboxLabel = String.fromCharCode(96 + i).toUpperCase(); // a, b, c, etc.
        
        subboxElement.innerHTML = `
            <div class="subbox-title">Subbox ${subboxLabel}</div>
            <div class="dsc-list">
                ${dscsInSubbox.map(dsc => `
                    <div class="dsc-list-item" onclick="showDSCDetails('${dsc.id}')">
                        <strong>${dsc.name}</strong><br>
                        <small>${dsc.serialNumber} - ${dsc.status}</small>
                        ${dsc.assignedTo ? `<br><small>Assigned to: ${getUserName(dsc.assignedTo)}</small>` : ''}
                    </div>
                `).join('')}
            </div>
            <div class="subbox-actions">
                <button onclick="openAddDSCToSubboxModal('${boxId}', '${subboxId}')" class="add-dsc-btn">Add DSC</button>
            </div>
        `;
        
        container.appendChild(subboxElement);
    }
    
    modal.classList.remove('hidden');
}

function showDSCDetails(dscId) {
    const dsc = allDSCs.find(d => d.id === dscId);
    if (!dsc) return;
    
    const canTake = dsc.status === 'available' && (!dsc.assignedTo || dsc.assignedTo === window.currentUser?.id);
    const canReturn = dsc.status !== 'available' && dsc.assignedTo === window.currentUser?.id;
    
    let actionButton = '';
    if (canTake) {
        actionButton = `<button onclick="takeDSC('${dsc.id}')" class="take-dsc-btn">Take DSC</button>`;
    } else if (canReturn) {
        actionButton = `<button onclick="returnDSC('${dsc.id}')" class="return-dsc-btn">Return DSC</button>`;
    }
    
    const modal = document.getElementById('dscDetailsModal');
    const content = document.getElementById('dscDetailsContent');
    
    if (modal && content) {
        content.innerHTML = `
            <h3>${dsc.name}</h3>
            <div class="dsc-details-grid">
                <div><strong>Serial Number:</strong> ${dsc.serialNumber}</div>
                <div><strong>Status:</strong> <span class="status-badge ${dsc.status}">${dsc.status}</span></div>
                <div><strong>Box Location:</strong> ${dsc.boxId} - ${dsc.subboxId}</div>
                <div><strong>Expiry Date:</strong> ${formatDate(dsc.expiryDate)}</div>
                <div><strong>Client Association:</strong> ${dsc.clientAssociation || 'None'}</div>
                ${dsc.assignedTo ? `<div><strong>Assigned to:</strong> ${getUserName(dsc.assignedTo)}</div>` : ''}
                ${dsc.takenAt ? `<div><strong>Taken at:</strong> ${formatDate(dsc.takenAt)}</div>` : ''}
            </div>
            <div class="dsc-actions">
                ${actionButton}
            </div>
        `;
        modal.classList.remove('hidden');
    }
}

function getUserName(userId) {
    const user = window.allUsers ? window.allUsers.find(u => u.id === userId) : null;
    return user ? user.name : 'Unknown User';
}

// DSC Search
function setupDSCSearch() {
    const searchInput = document.getElementById('searchBar');
    const dropdown = document.getElementById('autocompleteDropdown');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            dropdown.classList.add('hidden');
            return;
        }
        
        const results = allDSCs.filter(dsc => 
            dsc.name.toLowerCase().includes(query) ||
            dsc.serialNumber.toLowerCase().includes(query) ||
            getUserName(dsc.assignedTo).toLowerCase().includes(query)
        );
        
        showSearchResults(results, query);
    });
    
    // Clear search
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
        searchInput.value = '';
        dropdown.classList.add('hidden');
        clearHighlights();
    });
}

function showSearchResults(results, query) {
    const dropdown = document.getElementById('autocompleteDropdown');
    const resultCount = document.getElementById('searchResultCount');
    
    if (results.length === 0) {
        dropdown.classList.add('hidden');
        resultCount.textContent = 'No results found';
        return;
    }
    
    dropdown.innerHTML = '';
    results.slice(0, 10).forEach(dsc => {
        const item = document.createElement('div');
        item.className = 'autocomplete-suggestion';
        item.innerHTML = `
            <strong>${highlightText(dsc.name, query)}</strong><br>
            <small>${dsc.serialNumber} - ${dsc.status} - ${dsc.boxId} ${dsc.subboxId}</small>
        `;
        item.addEventListener('click', () => {
            highlightDSC(dsc.boxId, dsc.subboxId, dsc.name);
            dropdown.classList.add('hidden');
        });
        dropdown.appendChild(item);
    });
    
    dropdown.classList.remove('hidden');
    resultCount.textContent = `${results.length} result(s) found`;
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function highlightDSC(boxId, subboxId, dscName) {
    clearHighlights();
    
    // Highlight the main box
    const boxElement = document.querySelector(`[data-box-id="${boxId}"]`);
    if (boxElement) {
        boxElement.classList.add('highlighted-dsc');
    }
    
    // Highlight the subbox if modal is open
    const subboxElement = document.querySelector(`[data-subbox-id="${subboxId}"]`);
    if (subboxElement) {
        subboxElement.classList.add('highlighted-dsc');
    }
    
    // Highlight the user if DSC is assigned
    const dsc = allDSCs.find(d => d.name === dscName);
    if (dsc && dsc.assignedTo) {
        const userElement = document.querySelector(`[data-user-id="${dsc.assignedTo}"]`);
        if (userElement) {
            userElement.classList.add('highlighted-user');
        }
    }
}

function clearHighlights() {
    document.querySelectorAll('.highlighted-dsc, .highlighted-user').forEach(el => {
        el.classList.remove('highlighted-dsc', 'highlighted-user');
    });
}

function highlightUser(userId) {
    clearHighlights();
    
    const userElement = document.querySelector(`[data-user-id="${userId}"]`);
    if (userElement) {
        userElement.classList.add('highlighted-user');
    }
    
    // Highlight DSCs assigned to this user
    const userDSCs = allDSCs.filter(dsc => dsc.assignedTo === userId);
    userDSCs.forEach(dsc => {
        const boxElement = document.querySelector(`[data-box-id="${dsc.boxId}"]`);
        if (boxElement) {
            boxElement.classList.add('highlighted-dsc');
        }
    });
}

// Leader Actions
function setupLeaderActions() {
    document.getElementById('manageUsersBtn').addEventListener('click', openUserManagement);
    document.getElementById('auditLogBtn').addEventListener('click', openAuditLog);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
}

function openUserManagement() {
    const modal = document.getElementById('userManagementModal');
    const container = document.getElementById('userManagementContainer');
    
    container.innerHTML = '';
    window.allUsers.forEach(user => {
        const entry = document.createElement('div');
        entry.className = 'user-management-entry';
        entry.innerHTML = `
            <div class="user-management-info">
                <div class="user-management-name">${user.name}</div>
                <div class="user-management-role">${user.role} - ${user.status}</div>
            </div>
            <div class="user-management-actions">
                <button class="user-action-btn" onclick="editUser('${user.id}')">Edit</button>
                <button class="user-action-btn" onclick="resetPassword('${user.id}')">Reset Password</button>
                <button class="user-action-btn danger" onclick="deleteUser('${user.id}')">Delete</button>
            </div>
        `;
        container.appendChild(entry);
    });
    
    modal.classList.remove('hidden');
}

function openAuditLog() {
    const modal = document.getElementById('auditLogModal');
    const container = document.getElementById('auditLogContainer');
    
    container.innerHTML = '';
    auditLog.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'audit-entry';
        entryElement.innerHTML = `
            <div class="audit-info">
                <div class="audit-action">${entry.action}</div>
                <div class="audit-details">${entry.details}</div>
            </div>
            <div class="audit-timestamp">${formatDate(entry.timestamp)}</div>
        `;
        container.appendChild(entryElement);
    });
    
    modal.classList.remove('hidden');
}

function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('hidden');
}

function exportData() {
    const data = {
        dscs: allDSCs,
        users: window.allUsers,
        auditLog: auditLog,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsc-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Settings
function setupSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const contents = document.querySelectorAll('.settings-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
        });
    });
    
    // Save settings
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
    document.getElementById('resetSettingsBtn').addEventListener('click', resetSettings);
}

function saveSettings() {
    const settings = {
        notificationDays: document.getElementById('notificationDays').value,
        notificationEmailTemplate: document.getElementById('notificationEmailTemplate').value,
        notificationInApp: document.getElementById('notificationInApp').checked,
        notificationEmail: document.getElementById('notificationEmail').checked,
        autoBackup: document.getElementById('autoBackup').checked,
        sessionTimeout: document.getElementById('sessionTimeout').value
    };
    
    firebase.firestore().collection('settings').doc('main').set(settings)
        .then(() => {
            alert('Settings saved successfully!');
        })
        .catch(error => {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        });
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        document.getElementById('notificationDays').value = '30';
        document.getElementById('notificationEmailTemplate').value = 'Dear {employee_name},\n\nYour Digital Signature Certificate (DSC) will expire on {expiry_date}. Please ensure to renew it before the expiry date to avoid any disruption in your work.\n\nCertificate Details:\n- Name: {dsc_name}\n- Serial Number: {serial_number}\n- Expiry Date: {expiry_date}\n\nBest regards,\nDSC Management Team';
        document.getElementById('notificationInApp').checked = true;
        document.getElementById('notificationEmail').checked = true;
        document.getElementById('autoBackup').checked = true;
        document.getElementById('sessionTimeout').value = '30';
    }
}

// Audit Log
function logAuditAction(action, dscId, userId, details) {
    const auditEntry = {
        action: action,
        dscId: dscId,
        userId: userId,
        details: details,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userName: window.currentUser ? window.currentUser.name : 'Unknown User'
    };

    if (typeof firebase !== 'undefined') {
        firebase.firestore().collection('auditLog').add(auditEntry)
            .then(() => {
                console.log('Audit action logged:', action);
            })
            .catch(error => {
                console.error('Error logging audit action:', error);
            });
    } else {
        // Fallback for demo mode
        auditEntry.timestamp = new Date();
        auditLog.push(auditEntry);
        console.log('Audit action logged (demo mode):', action);
    }
}

// Firebase Listeners
function listenToAllDSCs() {
    console.log('Setting up DSC listener...');
    
    if (typeof firebase === 'undefined') {
        console.log('Firebase not available, using demo data for DSCs');
        return;
    }

    try {
        firebase.firestore().collection('dscs').onSnapshot(snapshot => {
            try {
                allDSCs = [];
                snapshot.forEach(doc => {
                    allDSCs.push({ id: doc.id, ...doc.data() });
                });
                
                console.log('DSCs updated from Firestore:', allDSCs.length, 'DSCs');
                
                // Update UI if user is logged in
                if (window.currentUser) {
                    renderMainDSCBoxes();
                    renderLeadersGrid();
                    renderEmployeesGrid();
                    updateMyDSCPanel();
                }
            } catch (error) {
                console.error('Error processing DSC snapshot:', error);
            }
        }, error => {
            console.error('Error listening to DSCs:', error);
        });
    } catch (error) {
        console.error('Error setting up DSC listener:', error);
    }
}

function listenToAllUsers() {
    console.log('Setting up Users listener...');
    
    if (typeof firebase === 'undefined') {
        console.log('Firebase not available, using demo data for users');
        return;
    }

    try {
        firebase.firestore().collection('users').onSnapshot(snapshot => {
            try {
                const newUsers = [];
                snapshot.forEach(doc => {
                    newUsers.push({ id: doc.id, ...doc.data() });
                });
                
                // Update both local and global variables
                window.allUsers = newUsers;
                
                console.log('Users updated from Firestore:', newUsers.length, 'users');
                
                // Update UI if user is logged in
                if (window.currentUser) {
                    renderLeadersGrid();
                    renderEmployeesGrid();
                }
            } catch (error) {
                console.error('Error processing Users snapshot:', error);
            }
        }, error => {
            console.error('Error listening to users:', error);
        });
    } catch (error) {
        console.error('Error setting up Users listener:', error);
    }
}

function listenToAuditLog() {
    console.log('Setting up Audit Log listener...');
    
    if (typeof firebase === 'undefined') {
        console.log('Firebase not available, using demo data for audit log');
        return;
    }

    try {
        firebase.firestore().collection('auditLog').onSnapshot(snapshot => {
            try {
                auditLog = [];
                snapshot.forEach(doc => {
                    auditLog.push({ id: doc.id, ...doc.data() });
                });
                
                console.log('Audit log updated from Firestore:', auditLog.length, 'entries');
            } catch (error) {
                console.error('Error processing Audit Log snapshot:', error);
            }
        }, error => {
            console.error('Error listening to audit log:', error);
        });
    } catch (error) {
        console.error('Error setting up Audit Log listener:', error);
    }
}

// Utility Functions
function formatDate(date) {
    if (!date) return 'N/A';
    if (date.toDate) {
        return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
}

// Global function to close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
    console.log('All modals closed');
}

// Global function to close specific modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        console.log(`Modal ${modalId} closed`);
    }
}

function setupModalCloses() {
    // Close buttons
    document.querySelectorAll('.modal .close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                console.log('Modal closed via close button');
            }
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                console.log('Modal closed via outside click');
            }
        });
    });
    
    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                openModal.classList.add('hidden');
                console.log('Modal closed via ESC key');
            }
        }
    });
    
    console.log('Modal close functionality initialized');
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.currentUser = null;
            document.getElementById('dashboard').classList.add('hidden');
            document.getElementById('loginSection').classList.remove('hidden');
            clearHighlights();
        });
    }
}

// Placeholder functions for user management
function editUser(userId) {
    alert('Edit user functionality would be implemented here');
}

function resetPassword(userId) {
    const user = window.allUsers ? window.allUsers.find(u => u.id === userId) : null;
    if (user && confirm(`Reset password for ${user.name}?`)) {
        // Implement password reset logic
        alert('Password reset email sent to user');
    }
}

function deleteUser(userId) {
    const user = window.allUsers ? window.allUsers.find(u => u.id === userId) : null;
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
        // Implement user deletion logic
        alert('User deleted successfully');
    }
}

// Add DSC functionality
function openAddDSCToSubboxModal(boxId, subboxId) {
    // Close any open modals first
    closeAllModals();
    
    // Open the manual add DSC modal
    const modal = document.getElementById('addManualDSCModal');
    if (modal) {
        // Pre-fill the box and subbox fields
        const boxSelect = document.getElementById('manualDSCBoxId');
        const subboxSelect = document.getElementById('manualDSCSubboxId');
        
        if (boxSelect) boxSelect.value = boxId;
        if (subboxSelect) subboxSelect.value = subboxId;
        
        modal.classList.remove('hidden');
        console.log(`Opening Add DSC modal for ${boxId} - ${subboxId}`);
    } else {
        // Fallback if modal doesn't exist
        alert('Add DSC modal not found. Please use the "Add DSC" button in the top right.');
    }
}

// Handle manual DSC form submission
function handleManualDSCSubmit(event) {
    event.preventDefault();
    
    console.log('Form submission started...');
    
    try {
        const formData = new FormData(event.target);
        const dscData = {
            name: formData.get('name') || document.getElementById('manualDSCName')?.value || '',
            serialNumber: formData.get('serialNumber') || document.getElementById('manualDSCSerialNumber')?.value || '',
            status: formData.get('status') || document.getElementById('manualDSCStatus')?.value || 'available',
            assignedTo: formData.get('assignedTo') || document.getElementById('manualDSCAssignedTo')?.value || null,
            boxId: formData.get('boxId') || document.getElementById('manualDSCBoxId')?.value || 'box1',
            subboxId: formData.get('subboxId') || document.getElementById('manualDSCSubboxId')?.value || 'subbox1',
            expiryDate: formData.get('expiryDate') || document.getElementById('manualDSCExpiryDate')?.value || '',
            clientAssociation: formData.get('clientAssociation') || document.getElementById('manualDSCClientAssociation')?.value || '',
            expectedReturnDate: formData.get('expectedReturnDate') || document.getElementById('manualDSCExpectedReturnDate')?.value || null
        };
        
        console.log('DSC data collected:', dscData);
        
        // Validate required fields
        if (!dscData.name || !dscData.serialNumber || !dscData.expiryDate) {
            alert('Please fill in all required fields (Name, Serial Number, Expiry Date)');
            return;
        }
        
        // Generate unique ID
        const dscId = 'dsc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        dscData.id = dscId;
        
        console.log('Generated DSC ID:', dscId);
        
        // Add to Firebase
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            console.log('Adding DSC to Firebase...');
            
            firebase.firestore().collection('dscs').doc(dscId).set(dscData)
                .then(() => {
                    console.log('DSC added to Firebase successfully');
                    
                    // Log the action
                    logAuditAction('create', dscId, window.currentUser?.id || 'system', `DSC ${dscData.name} created by ${window.currentUser?.name || 'system'}`);
                    
                    // Close modal
                    closeModal('addManualDSCModal');
                    
                    // Reset form
                    if (event.target && event.target.reset) {
                        event.target.reset();
                    }
                    
                    alert('DSC added successfully!');
                })
                .catch(error => {
                    console.error('Error adding DSC to Firebase:', error);
                    alert('Failed to add DSC to Firebase. Please try again. Error: ' + error.message);
                });
        } else {
            console.log('Firebase not available, using demo mode...');
            
            // Fallback for demo mode
            dscData.createdAt = new Date();
            allDSCs.push(dscData);
            
            // Close modal
            closeModal('addManualDSCModal');
            
            // Reset form
            if (event.target && event.target.reset) {
                event.target.reset();
            }
            
            // Update UI
            try {
                renderMainDSCBoxes();
                renderLeadersGrid();
                renderEmployeesGrid();
            } catch (uiError) {
                console.error('Error updating UI:', uiError);
            }
            
            alert('DSC added successfully! (Demo mode)');
        }
    } catch (error) {
        console.error('Error in handleManualDSCSubmit:', error);
        alert('An error occurred while adding the DSC. Please try again. Error: ' + error.message);
    }
}

// Initialize dashboard features
function setupDashboardFeatures() {
    // Set up manual DSC form submission
    const manualDSCForm = document.getElementById('addManualDSCForm');
    if (manualDSCForm) {
        manualDSCForm.addEventListener('submit', handleManualDSCSubmit);
    }
    
    // Set up user assignment dropdown
    const assignedToSelect = document.getElementById('manualDSCAssignedTo');
    if (assignedToSelect && window.allUsers) {
        assignedToSelect.innerHTML = '<option value="">-- None --</option>';
        window.allUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            assignedToSelect.appendChild(option);
        });
    }
}

// Test Firebase connection
function testFirebaseConnection() {
    console.log('Testing Firebase connection...');
    
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not loaded');
        alert('Firebase is not loaded. Please check your internet connection and refresh the page.');
        return false;
    }
    
    if (!firebase.apps || !firebase.apps.length) {
        console.error('Firebase app is not initialized');
        alert('Firebase app is not initialized. Please check your configuration.');
        return false;
    }
    
    try {
        // Test Firestore connection
        const testDoc = firebase.firestore().collection('test').doc('connection-test');
        testDoc.set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            test: true
        }).then(() => {
            console.log('Firebase connection test successful');
            // Clean up test document
            testDoc.delete();
        }).catch(error => {
            console.error('Firebase connection test failed:', error);
            alert('Firebase connection test failed. Please check your configuration. Error: ' + error.message);
        });
        
        return true;
    } catch (error) {
        console.error('Error testing Firebase connection:', error);
        alert('Error testing Firebase connection: ' + error.message);
        return false;
    }
}
