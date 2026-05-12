# 🎓 Certificate Verification System

A full-stack web application that enables administrators to upload student internship data via Excel and allows students to verify and download their certificates online.

## ✨ Features

- **Admin Panel**: Bulk upload student data using Excel files
- **Certificate Generation**: Auto-populate certificates with student information
- **Search & Verify**: Students can search using unique Certificate ID
- **PDF Download**: Download certificates in printable PDF format
- **Secure Authentication**: Encrypted login and access controls
- **Data Validation**: Checks for data accuracy and prevents duplicates

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js | Frontend UI |
| Node.js | Backend runtime |
| Express.js | API server |
| MongoDB | Database |
| Tailwind CSS | Styling |
| Multer | File upload |
| XLSX | Excel processing |
| jsPDF | PDF generation |

## 📋 Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6 or higher)
- [Git](https://git-scm.com/) (optional)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sravan7721/Certificate-System.git 
cd Certificate-System

2. Setup Backend
bash
cd backend
npm install
Create a .env file in the backend folder:

env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/certificate_system
Start the backend server:

bash
npm run dev
Server runs at: http://localhost:5001

3. Setup Frontend
Open a new terminal and run:

bash
cd frontend
npm install
npm start
Frontend runs at: http://localhost:3000

4. Start MongoDB
Windows:

bash
net start MongoDB
Mac:

bash
brew services start mongodb-community
Linux:

bash
sudo systemctl start mongod
📤 How to Upload Certificates (Excel Format)
Step 1: Create Excel File
Create an Excel file with these exact column headers:

certificateId	studentName	domain	startDate	endDate	email
CERT-001	John Doe	Web Development	2024-01-01	2024-03-31	john@email.com
CERT-002	Jane Smith	Data Science	2024-02-01	2024-04-30	jane@email.com
Step 2: Upload via Web Interface
Open upload.html file in your browser

Click "Choose File" and select your Excel file

Click "Upload File"

Wait for success message

Step 3: Verify Upload
Go to http://localhost:3000

Enter Certificate ID (e.g., CERT-001)

Click "Verify"

Download certificate as PDF

📁 Project Structure
text
Certificate-System/
├── backend/
│   ├── models/
│   │   └── Certificate.js
│   ├── routes/
│   │   └── upload.js
│   ├── uploads/          # Temporary upload folder
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CertificateSearch.js
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
├── upload.html           # Simple upload interface
└── README.md
🔧 API Endpoints
Method	Endpoint	Description
POST	/api/upload-excel	Upload Excel file with student data
GET	/api/verify/:certificateId	Verify certificate by ID
GET	/api/certificates	Get all certificates
DELETE	/api/certificates	Delete all certificates
📝 Sample Excel File Format
Save as .xlsx (Excel Workbook)

Column	Description	Required
certificateId	Unique identifier	Yes
studentName	Full name of student	Yes
domain	Internship domain/field	Yes
startDate	Start date (YYYY-MM-DD)	Yes
endDate	End date (YYYY-MM-DD)	Yes
email	Student email address	No
❗ Common Issues & Solutions
"MongoDB connection error"
Make sure MongoDB is installed and running

Run mongod in a separate terminal

"Port 5001 already in use"
Change PORT in .env file to 5002

Update frontend API calls to new port

"File upload fails"
Ensure Excel column headers match exactly

File must be .xlsx format (not .csv)

🚀 Deployment
Deploy Backend to Render
Push code to GitHub

Create account at render.com

Click "New Web Service"

Connect GitHub repository

Set build command: cd backend && npm install

Set start command: cd backend && node server.js

Add environment variables

Deploy Frontend to Vercel
Push code to GitHub

Create account at vercel.com

Import GitHub repository

Set framework preset: Create React App

Set root directory: frontend

Deploy

📞 Support
For issues or questions:

Create an issue on GitHub

Contact: sravan7721@example.com

📄 License
This project is open source and available under the MIT License.

👨‍💻 Author
Sravan7721

GitHub: @Sravan7721
