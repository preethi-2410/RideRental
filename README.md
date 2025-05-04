# 🚗 RIDERENTAL - Vehicle Rental Service Website

A modern, scalable, and fully-featured **vehicle rental platform**, built with **React.js**, **Tailwind CSS**, and **Firebase**, designed for both customers and administrators to simplify and enhance the vehicle rental experience.

## ✨ Key Features

### For Customers
- **Vehicle Browsing & Filtering**: Explore vehicles with filters by type, category, price, and availability.
- **Easy Booking**: Calendar-based date selection for pick-up and drop-off.
- **User Accounts**: Register, login, update profiles, and view booking history.
- **Secure Payments**: Integration with Stripe or Razorpay for smooth transactions.
- **Email Confirmations**: Booking details sent automatically to the registered email.

### For Administrators
- **Admin Dashboard**: Real-time analytics on users, bookings, and revenues.
- **Fleet Management**: Add, edit, or delete vehicle listings easily.
- **Booking Management**: Update booking statuses and monitor fleet usage.
- **User Management**: Assign admin roles, manage customer data, and handle support tickets.
- **Reports & Data Export**: Generate, view, and export detailed reports.

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Firebase Firestore (Database & Authentication)
- **Hosting**: Firebase Hosting
- **Visualization**: Chart.js for admin dashboards
- **Deployment Tools**: Vite for development server and production builds

## 🧰 Development Tools & Dependencies

- Node.js (v16+ recommended)
- NPM (Node Package Manager)
- Firebase Console
- Stripe / Razorpay accounts (for payment integration)

## 🔒 Security Features
- Email-password authentication with email verification.
- Role-based access control for Admins and Customers.
- Firestore security rules for protecting sensitive data.

## 📱 Responsive Design
Fully mobile-responsive:
- Desktop
- Tablet
- Mobile Phones

## 📈 Admin Analytics Dashboard
- Revenue tracking (daily, weekly, monthly, yearly)
- Popular vehicle insights
- Booking status distributions
- Downloadable reports (CSV export)

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- A Firebase project set up

### Installation

1. Clone the repository
```bash
git clone https://github.com/preethi-2410/vehicle_rental_website.git
cd vehicle-rental
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Initialize Firestore, Authentication, and Hosting
   - Replace Firebase configuration in `src/services/firebase.js` with your project credentials
   - Set up appropriate Firestore security rules

4. Configure payment gateway
   - Set your Stripe or Razorpay keys in a `.env` file

5. Start the development server
```bash
npm run dev
```

6. Open in browser
```
http://localhost:5173
```

### Admin Setup
- Create a user account.
- Manually update the role to "admin" via Firebase Firestore under the `users` collection.

## 🛒 Database Structure (Firestore)

| Collection | Description |
|:-----------|:------------|
| **users**   | Stores user profiles and roles |
| **vehicles** | Details about available vehicles |
| **bookings** | Customer booking records |

## 🚀 Future Enhancements

- Mobile app version (Progressive Web App)
- Chat support via chatbot integration
- Advanced business analytics dashboards
- GPS tracking of vehicles
- Multi-language support

## 📚 Knowledge Gained

- React state management (Hooks, Context API)
- Firebase Firestore real-time database
- Responsive design using Tailwind CSS
- Deployment with Vite and Firebase Hosting
- Role-based secure authentication
- Payment gateway integration

## ⚡ Challenges Faced

- Cross-browser responsiveness
- Role-based routing setup
- Real-time data handling without conflicts
- Managing Firestore nested data structures
- Securely integrating payment APIs

## 👩‍💻 Team Contributions

- **G Preethi** – Frontend Development, UI/UX Design, Payment Integration
- **D Vijay Kumar** – Backend Services, Firebase Functions
- **V Akhila** – Firestore Database Design, Admin Panel

## 📝 References

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Official Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [NPM Documentation](https://docs.npmjs.com)

---

© 2025 RIDERENTAL. All rights reserved.