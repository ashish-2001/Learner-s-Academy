Edtech Platform - MERN Stack Application

A full-stack Edtech web application built using the "MERN Stack" that enables "Students to enroll in courses", "Instructor to create and manage courses", and "admins to control the platform".

The application uses "Redux" for global statte management and implements "Secure authentication with role-based authorization".

##Features

-> Student

- User authentication(Signup/Login/Logout)
- Browse and search courses
- Enroll in courses
- Watch video lectures
- Track enrolled courses
- Manage profile details
  

-> Instructor

- Instructor authentication
- Create, update, and delete courses
- Upload course content (videos, descriptions)
- View enrolled students
- Manage instructor profile
  

-> Admin

- Admin authentication
- Manage users (students & instructors)
- Approve / reject instructor accounts
- Manage all courses
- Platform analytics & monitoring


-> State Management (Redux)

- Centralized global state using "Redux Toolkit"
- Auth state (user, token, role)
- Course data management
- UI state handling (loading, errors)



-> Authentication & Authorization

- JWT-based authentication
- Role-based access-control (RBAC)
- Protected routes for:
  - Student
  - Instructor
  - Admin
- Secure password hashing with bcrypt


## Tech statck used

-> Frontend

- React.js
- Redux toolkit
- React Router DOM
- Axios
- HTML5, CSS3, Javascript

-> Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON web token)
- brcypt

-> Tools

- Git & Github
- Postman


Steps to run this project locally

- Firstly clone this project
- cd project-name
- cd server
- npm install
- npm run dev

- cd src
- npm install
- npm run dev
  




