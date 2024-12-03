# Role-Based Access Control (RBAC) Authentication System Backend

This is the backend implementation of an authentication system with Role-Based Access Control (RBAC), including user registration, login, logout, token management, and role-based permissions.

---

## Features

1. **Authentication**
   - User registration with hashed passwords.
   - User login with secure JWT generation.
   - Logout with token invalidation.
   - JWT refresh token mechanism.

2. **Authorization**
   - Role-Based Access Control (RBAC).
   - User roles: Admin, User, and Manager.
   - Custom permissions for roles.

3. **Endpoints**
   - Protected endpoints with token verification.
   - Permission checks for role-based access.

---

## Prerequisites

Ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- MongoDB

---

## Environment Setup

1. Clone the repository:
  
    git clone https://github.com/sarveshavhad/VRV-Assignment-Sarvesh.git
   
    cd VRV-Assignment-Sarvesh

3. Install dependencies:
  
    Copy code
    npm install

4. Create a .env file in the root directory with the following:

    PORT=7001
   
    JWT=Your_JWT_Token
   
    JWT_REFRESH_SECRET=Your_Refresh_Token
   
    CONNECTION_STRING= Mongo_Connection_String

6. Start the MongoDB server if not running already.

---

## How to Run

1. Start the server:

  Copy code
  npm start

2. The server will start at http://localhost:7001.

## API Endpoints

### Authentication
| Method | Endpoint                 | Description               |
|--------|--------------------------|---------------------------|
| POST   | /api/auth/register       | Register a new user.      |
| POST   | /api/auth/login          | User login.               |
| POST   | /api/auth/refresh-token  | Generate a new token.     |
| POST   | /api/auth/logout         | Logout a user.            |

---

### Role Management
| Method | Endpoint                        | Description                            |
|--------|---------------------------------|----------------------------------------|
| PUT    | /api/auth/update-role/:username | Update user role (Admin-only).         |
| GET    | /api/auth/admin-dashboard       | Admin dashboard.                       |
| GET    | /api/auth/view-reports          | View reports (Users with permission).  |

---

## Testing
You can use Postman or a similar API client to test the API endpoints. Ensure to include the correct headers and body as demonstrated above.

---

## Usage with Postman
### 1. Register a User
    Endpoint: POST /api/auth/register

    Body:     
    {
      "username": "testuser",
      "password": "password123",
      "role": "user"
    }
   
### 2. Login
    Endpoint: POST /api/auth/login  

    Body: 
      {
        "username": "testuser",
        "password": "password123"
      }
    Response: JWT token for authenticated access.

### 3. Refresh Token
    Endpoint: POST /api/auth/refresh-token

    Headers:  
        Authorization: Bearer <your_token>

### 4. Logout
    Endpoint: POST /api/auth/logout

    Headers:
        Authorization: Bearer <your_token>

### 5. Update Role

    Endpoint: PUT /api/auth/update-role/:username

    Headers:
        Authorization: Bearer <your_token>
    Body:
        {
        "role": "admin"
        }


### 6. Access Protected Routes

    Endpoint: GET /api/auth/admin-dashboard

    Headers:   
   
    Authorization: Bearer <your_token>

### 7. View Reports
    Endpoint: GET /api/auth/view-reports

    Headers:
        Authorization: Bearer <your_token>


