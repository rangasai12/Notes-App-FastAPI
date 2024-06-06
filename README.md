
# FastAPI Notes App

This is a simple web application built with FastAPI and SQLite, allowing users to register, log in, and manage their notes. Users can perform CRUD (Create, Read, Update, Delete) operations on their notes after logging in.

## Features

- User Authentication: Users can register with a username and password and then log in .
- Note Management: Users can create, read, update, and delete their notes.

## Tech Stack
Backend:
- FastAPI
- SQLite

Frontend:
- HTML , CSS , JS

## Setup Instructions

1. Clone the repository:

   ```
   git clone https://github.com/your-username/fastapi-notes-app.git
   ```

2. Navigate to the project directory:

   ```
   cd fastapi-notes-app
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the application:

   ```
   uvicorn main:app --reload
   ```

5. Access the application in your web browser at [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html).

## Usage

- Register: Sign up with a username and password.
- Login: Log in with your registered credentials.
- Add Note: Once logged in, you can add new notes by providing a title and content.
- Edit/Delete Note: You can edit or delete existing notes.
- Logout: Logout from the application.
