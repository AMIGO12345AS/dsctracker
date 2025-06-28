// Firebase Setup Script for DSC Tracker
// Run this script in the browser console to populate your Firestore collections

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

// Function to populate users collection
async function populateUsers() {
    console.log('Populating users collection...');
    const batch = firebase.firestore().batch();
    
    sampleUsers.forEach(user => {
        const userRef = firebase.firestore().collection('users').doc(user.id);
        batch.set(userRef, user);
    });
    
    try {
        await batch.commit();
        console.log('✅ Users collection populated successfully!');
    } catch (error) {
        console.error('❌ Error populating users:', error);
    }
}

// Function to populate DSCs collection
async function populateDSCs() {
    console.log('Populating DSCs collection...');
    const batch = firebase.firestore().batch();
    
    sampleDSCs.forEach(dsc => {
        const dscRef = firebase.firestore().collection('dscs').doc(dsc.id);
        batch.set(dscRef, dsc);
    });
    
    try {
        await batch.commit();
        console.log('✅ DSCs collection populated successfully!');
    } catch (error) {
        console.error('❌ Error populating DSCs:', error);
    }
}

// Function to populate settings collection
async function populateSettings() {
    console.log('Populating settings collection...');
    
    try {
        await firebase.firestore().collection('settings').doc('main').set(sampleSettings);
        console.log('✅ Settings collection populated successfully!');
    } catch (error) {
        console.error('❌ Error populating settings:', error);
    }
}

// Function to populate all collections
async function populateAllCollections() {
    console.log('🚀 Starting Firebase setup...');
    
    if (typeof firebase === 'undefined') {
        console.error('❌ Firebase is not initialized. Please check firebase-config.js');
        return;
    }
    
    try {
        await populateUsers();
        await populateDSCs();
        await populateSettings();
        console.log('🎉 All collections populated successfully!');
        console.log('📊 Summary:');
        console.log(`   - Users: ${sampleUsers.length}`);
        console.log(`   - DSCs: ${sampleDSCs.length}`);
        console.log(`   - Settings: 1 document`);
        console.log('🔄 Refresh the page to see the changes!');
    } catch (error) {
        console.error('❌ Error during setup:', error);
    }
}

// Function to clear all collections (use with caution!)
async function clearAllCollections() {
    console.log('⚠️ Clearing all collections...');
    
    if (!confirm('Are you sure you want to delete all data? This action cannot be undone!')) {
        console.log('❌ Operation cancelled');
        return;
    }
    
    try {
        // Clear users
        const usersSnapshot = await firebase.firestore().collection('users').get();
        const userBatch = firebase.firestore().batch();
        usersSnapshot.docs.forEach(doc => userBatch.delete(doc.ref));
        await userBatch.commit();
        
        // Clear DSCs
        const dscsSnapshot = await firebase.firestore().collection('dscs').get();
        const dscBatch = firebase.firestore().batch();
        dscsSnapshot.docs.forEach(doc => dscBatch.delete(doc.ref));
        await dscBatch.commit();
        
        // Clear audit log
        const auditSnapshot = await firebase.firestore().collection('auditLog').get();
        const auditBatch = firebase.firestore().batch();
        auditSnapshot.docs.forEach(doc => auditBatch.delete(doc.ref));
        await auditBatch.commit();
        
        // Clear settings
        await firebase.firestore().collection('settings').doc('main').delete();
        
        console.log('✅ All collections cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing collections:', error);
    }
}

// Export functions to global scope
window.populateAllCollections = populateAllCollections;
window.clearAllCollections = clearAllCollections;
window.populateUsers = populateUsers;
window.populateDSCs = populateDSCs;
window.populateSettings = populateSettings;

console.log('🔥 Firebase Setup Script Loaded!');
console.log('Available functions:');
console.log('  - populateAllCollections() - Populate all collections with sample data');
console.log('  - clearAllCollections() - Clear all collections (use with caution!)');
console.log('  - populateUsers() - Populate only users collection');
console.log('  - populateDSCs() - Populate only DSCs collection');
console.log('  - populateSettings() - Populate only settings collection');
console.log('');
console.log('💡 Run populateAllCollections() to set up your Firebase database!'); 