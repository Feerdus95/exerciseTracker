Collecting workspace information

# Exercise Tracker

A simple exercise tracker API built with Node.js, Express, and MongoDB. This project allows users to create accounts, log exercises, and retrieve exercise logs.

## Features

- Create new users
- Log exercises for users
- Retrieve user exercise logs with optional date filters and limits

## Project Structure

```
.env
.gitignore
models/
  Exercise.js
  User.js
package.json
routes/
  api.js
server.js
vercel.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/exercisetracker.git
cd exercisetracker
```

2. Install dependencies:

```sh
npm install
```

3. Create a 

.env

 file in the root directory with your MongoDB URI and desired port:

```env
MONGODB_URI=your_mongodb_uri
PORT=3000
```

### Running the Server

To start the server in development mode with hot reloading:

```sh
npm run dev
```

To start the server in production mode:

```sh
npm start
```

The server will be running on `http://localhost:3000`.

## API Endpoints

### Create a New User

- **URL:** `/api/users`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "exampleuser"
  }
  ```
- **Response:**
  ```json
  {
    "username": "exampleuser",
    "_id": "user_id"
  }
  ```

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "username": "exampleuser",
      "_id": "user_id"
    }
  ]
  ```

### Add Exercise

- **URL:** `/api/users/:_id/exercises`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "description": "Running",
    "duration": 30,
    "date": "2023-10-01"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "user_id",
    "username": "exampleuser",
    "date": "Sun Oct 01 2023",
    "duration": 30,
    "description": "Running"
  }
  ```

### Get User's Exercise Log

- **URL:** `/api/users/:_id/logs`
- **Method:** `GET`
- **Query Parameters:**
  - 

from

 (optional): Start date for log filter
  - 

to

 (optional): End date for log filter
  - 

limit

 (optional): Limit the number of logs returned
- **Response:**
  ```json
  {
    "_id": "user_id",
    "username": "exampleuser",
    "count": 1,
    "log": [
      {
        "description": "Running",
        "duration": 30,
        "date": "Sun Oct 01 2023"
      }
    ]
  }
  ```

## Deployment

This project is configured to be deployed on Vercel. The configuration is defined in 

vercel.json

.

## License

This project is licensed under the ISC License.

---

Feel free to customize this `README.md` file as needed for your project.