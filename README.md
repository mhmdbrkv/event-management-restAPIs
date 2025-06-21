# Event Management REST APIs

## Overview
This is a Node.js-based RESTful API for managing events, built with Express.js and MongoDB. It provides endpoints for creating, updating, viewing, and deleting events, along with user authentication and ticket booking functionalities. The project emphasizes clean code, scalability, and secure practices, leveraging Object-Oriented Programming (OOP) principles for modular design.

## Features
- **Event Management**: Create, read, update, and delete (CRUD) events with details like title, date, location, and description.
- **User Authentication**: Secure registration and login using JWT.
- **Ticket Booking**: Allow users to book tickets for events.
- **Data Validation**: Ensure robust input validation with libraries like Joi.
- **Error Handling**: Comprehensive error responses for reliable API usage.
- **Database**: MongoDB for scalable and flexible data storage.

## Tech Stack
- **Node.js**: Runtime for server-side JavaScript.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing events and user data.
- **Mongoose**: ODM for MongoDB to manage schemas.
- **JWT**: For secure authentication.
- **Joi**: For request validation.
- **Git**: Version control for collaborative development.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mhmdbrkv/event-management-restAPIs.git
   cd event-management-restAPIs
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with the following:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your_jwt_secret_key
   ```
4. **Start MongoDB**:
   Ensure MongoDB is running locally or provide a cloud MongoDB URI.
5. **Run the Application**:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000`.

## API Endpoints
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Authenticate and receive a JWT.
- **POST /api/events**: Create a new event (requires authentication).
- **GET /api/events**: List all events.
- **GET /api/events/:id**: Get event details by ID.
- **PUT /api/events/:id**: Update an event (requires authentication).
- **DELETE /api/events/:id**: Delete an event (requires authentication).
- **POST /api/tickets/:eventId**: Book a ticket for an event.

## Usage
1. Register a user via `/api/auth/register`.
2. Log in to obtain a JWT token.
3. Use the token in the `Authorization` header (`Bearer <token>`) for protected routes.
4. Create and manage events or book tickets using the provided endpoints.

## Project Structure
```
event-management-restAPIs/
├── controllers/      # Request handlers for API endpoints
├── models/          # Mongoose schemas (Event, User, Ticket)
├── routes/          # Express route definitions
├── middlewares/     # Authentication and validation middleware
├── config/          # Configuration files (e.g., database connection)
├── .env             # Environment variables
├── server.js        # Entry point
└── README.md        # Project documentation
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For questions or feedback, reach out to [mhmdbrkv](https://github.com/mhmdbrkv).
