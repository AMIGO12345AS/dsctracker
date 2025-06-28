# DSC Workflow Tracker

A comprehensive Digital Signature Certificate (DSC) management system for office environments with real-time tracking, role-based access, and visual organization.

## Features

### 🏢 Four-Quadrant Dashboard
- **Top Left**: My DSC Panel + Leaders Grid (2x3)
- **Top Right**: DSC Boxes Grid (2x4) with 9 sub-boxes each
- **Bottom Left**: Employees Grid (5x4) with visual status indicators
- **Bottom Right**: Live Search + Leader Actions

### 👥 Role-Based Access
- **Admin/Leader**: Full control, user management, audit logs, settings
- **Employee**: View all info, take/return only their assigned DSCs

### 🔍 Core Functionality
- **Take/Return Logic**: Visual DSC movement between storage and users
- **Live Search**: Real-time DSC search with instant location highlighting
- **Status Tracking**: Visual indicators for DSC possession
- **Audit Trail**: Complete history of all DSC movements and changes

### 🛠️ Advanced Features (Leaders Only)
- **User Management**: Create, edit, delete users, password resets
- **Audit Log**: Comprehensive action tracking with filtering
- **Settings Panel**: Customizable notification templates and system settings
- **Bulk Operations**: CSV import/export for DSC data
- **Data Export**: Complete system backup and reporting

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Auth
- **Hosting**: Netlify
- **Real-time**: Firebase Realtime Database

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Authentication (Email/Password)
4. Create a `firebase-config.js` file with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);
```

### 2. Firestore Collections

The app uses the following Firestore collections:

- `users` - User accounts with roles and status
- `dscs` - DSC certificates with location and assignment data
- `auditLog` - Action history and tracking
- `settings` - System configuration

### 3. Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/dsc-tracker.git
cd dsc-tracker

# Add your Firebase config
# Copy firebase-config.js with your credentials

# Open index.html in a web server
# Use Live Server (VS Code) or any local server
```

### 4. Netlify Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/dsc-tracker.git
git push -u origin main
```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: (leave empty for static site)
   - Set publish directory: `/` (root)
   - Add environment variables for Firebase config if needed

## Usage

### For Employees
1. Select your user account from the login screen
2. View your assigned DSC in the "My DSC" panel
3. Click on DSC boxes to see sub-boxes and take/return DSCs
4. Use the search bar to find specific DSCs

### For Leaders/Admins
1. Access additional features in the bottom-right quadrant
2. Manage users through the "Manage Users" button
3. View audit logs for complete system history
4. Configure settings and notification templates
5. Export data for reporting and backup

## Data Structure

### User Object
```javascript
{
  id: "user-id",
  name: "John Doe",
  role: "Employee|Leader|Admin",
  status: "active|inactive",
  email: "john@company.com"
}
```

### DSC Object
```javascript
{
  id: "dsc-id",
  name: "DSC Name",
  serialNumber: "SN123456",
  status: "available|in_use|out",
  boxId: "box1",
  subboxId: "subbox1",
  assignedTo: "user-id",
  expiryDate: "2024-12-31",
  clientAssociation: "Client Name",
  takenBy: "user-id",
  takenAt: "timestamp",
  returnedAt: "timestamp"
}
```

### Audit Log Entry
```javascript
{
  id: "audit-id",
  action: "take|return|create|update|delete",
  dscId: "dsc-id",
  userId: "user-id",
  details: "Action description",
  timestamp: "timestamp"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Email notifications for DSC expiry
- [ ] Mobile app version
- [ ] Advanced reporting and analytics
- [ ] Integration with external DSC providers
- [ ] Multi-office support
- [ ] API endpoints for external integrations 