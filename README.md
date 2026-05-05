# EMS Pro - Employee Management System (Web Application)

EMS Pro is a **fully functional**, responsive, client-side web-based Employee Management System designed to simplify HR operations such as user registration, role-based login, task assignment, and progress tracking — all without a backend server. Built using HTML5, CSS3, JavaScript (Vanilla), and LocalStorage, it supports three types of users: **Admin**, **Manager**, and **Employee** with complete role-based access control.

## 🔗 Live Demo

> GitHub Pages: https://kashish-008.github.io/Summer-Training-Project/

---

## 📂 Project Structure

```bash
/College-major-project/
│
├── index.html                          # Home page with hero section
├── login.html                          # Unified login page for all roles
├── register.html                       # User registration
├── admin-dashboard.html                # Admin dashboard
├── manager-dashboard.html              # Manager dashboard
├── employee-dashboard.html             # Employee dashboard
├── about.html                          # About the project
├── contact.html                        # Contact form (submissions visible to admin)
├── features.html                       # Product features page
│
├── css/
│   ├── main.css                        # Core stylesheet
│   ├── dashboard-bundle.css            # Dashboard-specific styles
│   ├── resp.css                        # Responsive design (mobile-first)
│   └── animations.css                  # Animations and transitions
│
├── js/
│   ├── auth.js                         # Authentication & session management
│   ├── dashboard-bundle.js             # All dashboard logic (Admin, Manager, Employee)
│   ├── login-bundle.js                 # Login page logic for all roles
│   ├── forms-bundle.js                 # Registration & contact form logic
│   ├── public-bundle.js                # Home page & public pages logic
│   └── [bundled] GSAP animations       # Scroll animations (CDN-loaded)
│
├── images/                             # Logo and assets
├── unused-files/                       # Original separate JS files (before bundling)
└── README.md                           # This file
```

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**

- ✅ **Unified Login System** – Single login page for all three roles
- ✅ **Role-Based Access Control** – Admin, Manager, and Employee with unique dashboards
- ✅ **Access Codes** – Admin requires "ADMIN123", Manager requires "MANAGER456" (security layer)
- ✅ **Session Management** – Secure session handling with LocalStorage
- ✅ **User Registration** – Create new employees with role assignment

### 👥 **Admin Dashboard**

- ✅ View all registered users and employees
- ✅ Assign tasks to employees with details (name, assignee, technology, timeline, description, status)
- ✅ Track task progress (Active, Completed, Failed)
- ✅ View all company contacts and messages from employees
- ✅ Send messages to "All Employees" or "All Managers"
- ✅ Export contact data to CSV
- ✅ Message badge notifications

### 👔 **Manager Dashboard**

- ✅ View all employees in the organization
- ✅ Track all company tasks and their status
- ✅ Receive messages from Admin
- ✅ Send messages to Admin
- ✅ Dashboard statistics (Total Users, Tasks, Active, Completed)

### 👨‍💼 **Employee Dashboard**

- ✅ View assigned tasks
- ✅ Update task status (Mark as Completed or Failed)
- ✅ Send messages to Admin
- ✅ View received messages from Admin
- ✅ Track task statistics (Total, Active, Completed, Failed)

### 🎨 **UI/UX Features**

- ✅ **Dark/Light Mode Toggle** – Persistent theme preference (saved in LocalStorage)
- ✅ **Responsive Design** – Mobile-first approach, works on all devices (320px - 2560px)
- ✅ **Mobile Sidebar Navigation** – Hamburger menu for mobile devices
- ✅ **Smooth Animations** – GSAP-powered scroll animations on home page
- ✅ **Professional Design** – Modern card-based layouts with hover effects
- ✅ **Password Visibility Toggle** – Show/hide password on login

### 💾 **Data Storage**

- ✅ **LocalStorage Database** – All data persisted in browser (no backend required)
- ✅ **JSON Format** – Structured data storage for users, tasks, messages, contacts
- ✅ **Data Persistence** – Data survives page refreshes and browser restarts

---

## 🧑‍💻 Technologies Used

- **Frontend Framework:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling & Animation:**
  - CSS3 (Flexbox, Grid, Media Queries)
  - GSAP 3.11.4 (Scroll animations)
  - Font Awesome 6.4.0 (Icons)
  - Google Fonts (Typography)
- **Client-Side Storage:** LocalStorage API
- **Build & Bundling:** Module bundling (dashboard-bundle.js, login-bundle.js, etc.)
- **Development Tools:** VS Code, Chrome DevTools, Git

---

## 🚀 Default User Credentials (Pre-Loaded)

Use these credentials to test different roles:

| Role         | Username   | Password      | Access Code          |
| ------------ | ---------- | ------------- | -------------------- |
| **Admin**    | `admin`    | `admin123`    | `ADMIN123`           |
| **Manager**  | `manager`  | `manager123`  | `MANAGER456`         |
| **Employee** | `employee` | `employee123` | _(No code required)_ |

---

## 📋 How to Use

1. **Clone or Download** this repository
2. **Open `index.html`** in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **Explore the Features:**
   - Click "Login" to access the login page
   - Use credentials from the table above
   - Navigate through different sections using the sidebar
   - Try admin features like assigning tasks or sending messages
   - Switch between dark and light mode
4. **Test Responsiveness:**
   - Open DevTools (F12) and toggle device toolbar
   - Test on mobile, tablet, and desktop views

---

## 🔄 Workflow Example

### Admin Workflow:

1. Login as Admin (admin / admin123 / ADMIN123)
2. Go to "Employees" section → View all registered users
3. Go to "Tasks" section → Assign a new task to an employee
4. Go to "Messages" section → Send announcement to all employees
5. Go to "Contacts" section → View contact form submissions

### Manager Workflow:

1. Login as Manager (manager / manager123 / MANAGER456)
2. Go to "Employees" → View team members
3. Go to "Tasks" → Track project progress
4. Go to "Messages" → Communicate with Admin

### Employee Workflow:

1. Login as Employee (employee / employee123)
2. Go to "My Tasks" → See assigned work
3. Mark tasks as "Completed" or "Failed"
4. Go to "Message Admin" → Send updates and receive feedback

---

## ✅ Testing & Quality Assurance

### ✓ Verified Features:

- ✅ Login authentication for all three roles works perfectly
- ✅ Separate dashboards with role-specific features
- ✅ Task assignment, updates, and deletion
- ✅ Message sending/receiving system
- ✅ Contact form submission and export
- ✅ Dark/Light theme toggle with persistence
- ✅ Mobile responsive on all screen sizes
- ✅ LocalStorage data persistence
- ✅ No console JavaScript errors (all null checks implemented)
- ✅ Session management and logout functionality
- ✅ GSAP scroll animations on public pages

### 📝 Known Notes:

- CSS file `animations.css` was merged with other stylesheets (intentional optimization)
- GSAP library is loaded via CDN for scroll animations
- All functionality is client-side (no backend API required)

---

## 🌟 Highlights

- **Zero Backend Dependency** – Completely front-end application
- **Persistent Data** – All data stored locally, survives browser restarts
- **Modular Code** – Bundled JavaScript for better organization
- **Accessibility** – Keyboard navigation, ARIA labels (where applicable)
- **Performance** – Optimized CSS bundles, efficient JavaScript
- **Security** – Role-based access codes, session tokens

---

## 📌 Future Scope

- Integrate backend (Node.js/Express, Python/Flask)
- Add database (Firebase, MongoDB, PostgreSQL)
- Implement email notifications
- Real-time data synchronization across users
- Advanced analytics and reporting dashboards
- Mobile app version (React Native/Flutter)
- Two-factor authentication
- Attendance tracking
- Payroll management integration

---

## 🐛 Bug Fixes & Improvements (Latest)

### v1.1.0 (Current)

- ✅ Added GSAP library to login.html for consistent animations
- ✅ Implemented null checks in dashboard-bundle.js (7 functions)
- ✅ Cleaned up unused code in unused-files/ directory
- ✅ Optimized CSS bundling
- ✅ All console errors resolved
- ✅ Mobile responsiveness enhanced

---

## 📬 Contact & Credits

**Project Author:** Kashish Thakur  
**Trainer/Mentor:** Shaina Guru  
**Institution:** Chandigarh Group of Colleges, Landran, Mohali  
**Course:** Summer Training Program  
**Project Type:** College Major Project

---

## 📄 License

This project is created for educational purposes as part of a college curriculum.

---

## 🙌 Acknowledgments

- GSAP for smooth scroll animations
- Font Awesome for icons
- Google Fonts for typography
- HTML5 LocalStorage API for client-side persistence
