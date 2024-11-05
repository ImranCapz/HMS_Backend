# HMS Backend

This is the backend for the Hospital Management System (HMS). It provides APIs for managing patients, doctors, appointments, billing, and more.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/HMS_Backend.git
    cd HMS_Backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:

    ```env
    PORT = 5000
    MONGODB_URI = mongodb_url
    JWT_SECRET = your_jwt_secret
    ```

## Running the Development Server

1. Start the MongoDB server if it's not already running:

    ```sh
    mongod
    ```

2. Start the development server:

    ```sh
    npm run start
    ```

    The server will start on the port specified in the [.env](http://_vscodecontentref_/1) file (default is 5000).

## Deployment


1. Start the server:

    ```sh
    npm start
    ```

    The server will start on the port specified in the [.env](http://_vscodecontentref_/2) file (default is 5000).

## Some API Endpoints

### Patients

- `POST /patients/add` - Add patient basic info
- `POST /patients/otherinfo/add` - Add patient other info
- `PUT /patients/otherinfo/add` - Update patient other info
- `POST /patients/otherinfo/get` - Get patient other info
- `POST /patients/get` - Get individual patient
- `POST /patients/getall` - Get all patients
- `DELETE /patients/delete` - Delete patient
- `POST /patients/prescription/get` - Get patient prescription
- `POST /patients/analytics/get` - Get patient analytics
- `POST /patients/get/id` - Get patient by ID
- `PUT /patients/edit` - Edit patient basic info

### Doctors

- `POST /doctor/add` - Add doctor
- `POST /doctor/getall` - Get all doctors
- `POST /doctor/get/dept` - Get doctors by department
- `POST /doctor/login` - Doctor login
- `POST /doctor/dept` - Get all departments
- `POST /doctor/profile/get` - Get doctor profile
- `DELETE /doctor/delete` - Delete doctor

### Admin

- `POST /admin/hospitaladmin` - Create hospital admin
- `POST /login/admin/hospitaladmin` - Hospital admin login
- `POST /admin/hospitaladmin/get/info` - Get hospital admin info

## Middleware

- [jwtVerify](http://_vscodecontentref_/3) - JWT verification middleware
- [multerUpload](http://_vscodecontentref_/4) - Multer middleware for file uploads
- [multerPdfUpload](http://_vscodecontentref_/5) - Multer middleware for PDF uploads

## Dependencies
The project uses various dependencies listed in the <code>package.json</code> file. Ensure to review and install them as needed before development or deployment.

## Support
For more detailed information, refer to the documentation or contact the support team at [Martian Corporation](http://martiancorp.in).