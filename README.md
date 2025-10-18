
# Zealthy EMR - Electronic Medical Records System

A full-stack Electronic Medical Records (EMR) system with patient portal, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 🌟 Features

### Admin Panel (`/admin`)
- **Patient Management**: Create, view, and delete patient records
- **Appointment Scheduling**: 
  - Create appointments with recurring schedules (daily, weekly, bi-weekly, monthly)
  - Edit and delete appointments
  - Set end dates for recurring appointments
- **Prescription Management**:
  - Create, edit, and delete prescriptions
  - Track medication, dosage, quantity, and refill schedules
- **Patient Drill-Down**: Click on patient names to view detailed records

### Patient Portal
- **Secure Login**: Email and password authentication
- **Dashboard (`/patient`)**: 
  - 7-day view of upcoming appointments
  - 7-day view of upcoming prescription refills
  - Quick navigation to full schedules
- **Full Appointments View (`/appointments`)**: All appointments for the next 3 months
- **Full Prescriptions View (`/prescriptions`)**: All prescriptions for the next 3 months
- **Professional Navigation**: Logo-branded navbar with active page indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Custom modals, forms, and tables
- **Notifications**: Sonner toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd zealthy-emr
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/zealthy_emr"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open the application**
- Admin Panel: http://localhost:3000/admin
- Patient Portal: http://localhost:3000/

## 🗄️ Database Schema

### Patient
- id, fullName, email, password, age
- Relations: appointments[], prescriptions[]

### Appointment
- id, patientId, provider, date, repeat, repeatEnd
- Supports recurring schedules: none, daily, weekly, biweekly, monthly

### Prescription
- id, patientId, medication, dosage, quantity, refillDate, refillSchedule

## 🚀 Usage

### Admin Panel
1. Navigate to `/admin`
2. Add patients using the "Add New Patient" form
3. Create appointments with optional recurring schedules
4. Manage prescriptions with refill tracking
5. Click patient names to view detailed records
6. Use Edit buttons to modify appointments and prescriptions

### Patient Portal
1. Navigate to `/` (root)
2. Login with patient credentials
3. View upcoming appointments and refills (next 7 days)
4. Click "All Appointments" or "All Prescriptions" for full schedules
5. Use navbar to navigate between pages

## 📋 Key Features Implemented

### CRUD Operations
✅ **Patients**: Create, Read, Delete  
✅ **Appointments**: Create, Read, Update, Delete  
✅ **Prescriptions**: Create, Read, Update, Delete

### Advanced Features
✅ **Recurring Appointments**: Support for multiple schedule types  
✅ **Edit Modals**: In-line editing for appointments and prescriptions  
✅ **7-Day Filtering**: Dashboard shows only upcoming items  
✅ **3-Month View**: Detailed pages for long-term planning  
✅ **Patient Drill-Down**: Click patient names for detailed view  
✅ **Professional UI**: Modern design with hover effects and badges

## 🔒 Security Notes

- Passwords are stored as plain text (for demo purposes only)
- In production, implement proper password hashing (bcrypt)
- Add authentication middleware for protected routes
- Implement CSRF protection
- Add rate limiting for API endpoints

## 📱 Responsive Design

- Mobile-friendly navigation
- Responsive tables and forms
- Touch-optimized buttons and modals

## 🧪 Testing

Test the following workflows:

1. **Admin Workflow**:
   - Create a patient
   - Schedule an appointment with recurring pattern
   - Add a prescription with refill schedule
   - Edit the appointment
   - Click patient name to view details

2. **Patient Workflow**:
   - Login with patient credentials
   - View 7-day dashboard
   - Navigate to full appointments view
   - Navigate to full prescriptions view
   - Use logout button

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
```bash
vercel --prod
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
```

## 📝 API Routes

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/[id]` - Get single patient
- `POST /api/patients` - Create patient
- `DELETE /api/patients?id=[id]` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments?email=[email]` - Get patient appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments?id=[id]` - Delete appointment

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions?email=[email]` - Get patient prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/[id]` - Update prescription
- `DELETE /api/prescriptions?id=[id]` - Delete prescription

## 🎨 UI Components

- **Navbar**: Reusable navigation component with logo
- **EditModal**: Generic modal for editing records
- **Tables**: Sortable, hoverable data tables
- **Forms**: Validated input forms with error handling
- **Badges**: Status indicators and counters

## 📂 Project Structure
```
zealthy-emr/
├── app/
│   ├── admin/
│   │   ├── patients/[id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── appointments/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   ├── patients/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── prescriptions/
│   │       ├── [id]/route.ts
│   │       └── route.ts
│   ├── appointments/
│   │   └── page.tsx
│   ├── components/
│   │   ├── EditModal.tsx
│   │   └── Navbar.tsx
│   ├── patient/
│   │   └── page.tsx
│   ├── prescriptions/
│   │   └── page.tsx
│   └── login/
│       └── page.tsx
├── prisma/
│   └── schema.prisma
├── lib/
│   └── db.ts
└── README.md
```

## 🐛 Known Issues

- Patient password update not implemented (use delete/recreate for now)
- No email verification system
- Logout doesn't invalidate session server-side

## 🔮 Future Enhancements

- [ ] Add patient profile editing
- [ ] Implement secure authentication with NextAuth
- [ ] Add medical records upload
- [ ] Email notifications for appointments
- [ ] SMS reminders for prescriptions
- [ ] Export patient data to PDF
- [ ] Add search and filter functionality
- [ ] Implement role-based access control

## 👤 Author

jagadish

## 📄 License

This project was created as a coding exercise for Zealthy.

## 🙏 Acknowledgments

Built for the Zealthy Full-Stack Engineering Exercise.
