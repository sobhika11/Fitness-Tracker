# Backend Features Documentation

## Overview
This document outlines all backend features currently implemented in the system. Features are grouped by functional area for clarity.

---

## Authentication & Authorization

### User Registration
- **Endpoint**: `POST /api/auth/signup`
- User signup with email, username, and password
- Email uniqueness validation
- Duplicate user detection (returns 400 if user already exists)
- Password hashing using bcrypt with salt rounds (10)
- Server-side validation for required fields
- Returns success message on successful registration

### User Login
- **Endpoint**: `POST /api/auth/login`
- Email and password-based authentication
- User existence validation
- Password verification using bcrypt comparison
- JWT token generation upon successful login
- Token expiration: 1 hour
- Returns JWT token along with user information (id, username, email)
- Error handling for invalid credentials and missing users

### Security Features
- Password hashing with bcrypt before storage
- JWT-based token authentication
- Secure token generation with user ID and email in payload
- Environment variable support for JWT secret key
- Password comparison using secure bcrypt comparison

---

## User Management

### User Model Schema
- **Fields**:
  - `username`: String (required, unique)
  - `email`: String (required, unique)
  - `password`: String (required, hashed)
  - `phoneNumber`: String (optional)
  - `name`: String (optional)
- User data persistence in MongoDB
- Unique constraints on username and email fields
- Schema validation for required fields

### User Operations
- User creation via registration endpoint
- User lookup by email for authentication
- User data retrieval (returns user object on login)

---

## Data Models & Schemas

### User Schema
- MongoDB schema definition using Mongoose
- Field-level validation and constraints
- Unique index on username and email
- Optional profile fields (phoneNumber, name)

### Mealplan Schema
- Food item data model with nutritional information
- **Fields**:
  - `_id`: Number (required)
  - `food`: String (required)
  - `meal_type`: String (required)
  - `calories`: Number (required)
  - `protein`: Number (required)
  - `carbs`: Number (required)
  - `fat`: Number (required)
  - `serving_size`: String (required)

---

## Calculations & Business Logic

### Body Metrics Calculation
- **Endpoint**: `POST /meals` (route defined but not mounted in server)
- BMI (Body Mass Index) calculation based on weight and height
- BMR (Basal Metabolic Rate) calculation:
  - Male: `10 * weight + 6.25 * height - 5 * age + 5`
  - Female: `10 * weight + 6.25 * height - 5 * age - 161`
- TDEE (Total Daily Energy Expenditure) calculation using activity level multipliers

### Activity Level Mapping
- Activity level to multiplier mapping:
  - "Slightly active": 1.2
  - "Lightly active": 1.375
  - "Moderately active": 1.55
  - "Very active": 1.725
  - "Extra active": 1.9

### Diet Plan Logic
- Calorie deficit calculation support
- TDEE adjustment for calorie deficit diets

---

## Server Configuration

### Express Server Setup
- Express.js application initialization
- JSON body parser middleware
- Server listening on configurable port (via environment variables)
- Health check endpoint: `GET /` returns "API running..."

### Database Configuration
- MongoDB connection using Mongoose ODM
- Connection string from environment variables
- Connection status logging
- Error handling for database connection failures

### Environment Variables
- Support for `.env` file configuration
- Required variables:
  - `MONGO_URI`: MongoDB connection string
  - `PORT`: Server port number
  - `JWT_SECRET`: Secret key for JWT token signing (optional, defaults to "secretKey")

---

## API Routes

### Authentication Routes
- Mounted at `/api/auth`
- Signup endpoint
- Login endpoint

### Route Files (Defined but Not Fully Integrated)
- **Mealplan Routes**: Route file exists with meal calculation logic but not mounted to server
- **Profile Routes**: Route file exists but contains no route definitions
- **Streak Routes**: Route file exists but is empty

---

## Error Handling

### Authentication Errors
- 400 status for duplicate user registration
- 400 status for user not found during login
- 401 status for invalid password
- 500 status for server errors
- Error messages returned in JSON format

### General Error Handling
- Try-catch blocks for async operations
- Server error responses with appropriate status codes
- Error logging to console

---

## Data Integrity

### Validation
- Email uniqueness validation (prevents duplicate accounts)
- Username uniqueness validation
- Required field validation at schema level
- Input validation for authentication endpoints

### Data Persistence
- MongoDB as primary database
- Mongoose schemas with built-in validation
- Secure password storage (hashed, never plain text)
- Unique constraints enforced at database level

---

## Technical Stack

### Dependencies
- **express**: ^5.1.0 - Web framework
- **mongoose**: ^8.18.3 - MongoDB ODM
- **bcrypt**: ^6.0.0 - Password hashing
- **jsonwebtoken**: ^9.0.2 - JWT token generation
- **dotenv**: ^17.2.3 - Environment variable management

---

## Notes

### Current Implementation Status
- Authentication system is fully functional and integrated
- User management operations are complete for registration and login
- Mealplan calculation logic exists but route is not mounted to server
- Profile and Streak routes are scaffolded but contain no implementations
- Server setup is complete with MongoDB connection and basic middleware

### API Endpoints Summary
| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| GET | `/` | ✅ Active | Health check |
| POST | `/api/auth/signup` | ✅ Active | User registration |
| POST | `/api/auth/login` | ✅ Active | User authentication |
| POST | `/meals` | ⚠️ Defined | Meal calculations (not mounted) |

---
*Last Updated: Based on current codebase analysis*
