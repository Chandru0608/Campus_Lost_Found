# Campus Lost & Found Board

React + Vite frontend and Node.js + Express backend for a college lost-and-found mini-project.

## Features
- Report lost or found items with a photograph.
- Browse active reports.
- Search by keyword, category, location and report type.
- View item details and contact information.
- Student registration, login and logout.
- Passwords are hashed with bcrypt and login sessions use JWT tokens.
- Reporting items and claiming items require a logged-in account.
- Mark an item as claimed; claimed items are archived (hidden from the active board).
- Store item data in a JSON file.
- Receive uploaded images as Node.js Buffers and save them with `fs`.

## Requirements
- Node.js 18 or newer
- npm

## Run the backend
```bash
cd backend
npm install
npm run dev
```
Backend: http://localhost:5000

## Run the React frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a student account |
| POST | `/api/auth/login` | Log in and receive a JWT token |
| GET | `/api/auth/me` | Validate the current login (JWT required) |
| GET | `/api/items` | List active items |
| GET | `/api/items?search=phone` | Search title and description |
| GET | `/api/items?category=Electronics&location=Library&type=Lost` | Filter items |
| GET | `/api/items/:id` | Get one item |
| POST | `/api/items` | Create item; login required; multipart field `image` |
| PATCH | `/api/items/:id/claim` | Claim/archive an item; login required |

Protected API requests use the header `Authorization: Bearer <token>`.

## Login and registration
1. Start the backend and frontend in separate terminals using the commands above.
2. Open `http://localhost:5173/register` and create an account.
3. Log in at `http://localhost:5173/login` with that email and password.
4. Once logged in, use **Report an item**. You can also claim an item from its details page.
5. Select **Log out** in the navigation bar to end the session.

Accounts are stored in `backend/data/users.json`; passwords are stored as bcrypt hashes. The JWT expires after 7 days. For deployment, set a strong `JWT_SECRET` environment variable and use HTTPS. The built-in fallback secret is only for local development.

## Notes
This is a learning/demo project. JSON-file storage is suitable for a small local demonstration, not simultaneous multi-user production use. For public deployment, add authentication, authorization for claiming, stronger image-content validation, privacy controls for contact details, and a database. Do not expose real student contact information in a public demo.


## Login and registration
- Create an account using your name, email and a password (minimum 6 characters).
- Log in with the registered email and password.
- Browsing is public; reporting an item and marking an item as claimed require login.
- User accounts are stored in `backend/data/users.json`; passwords are stored as bcrypt hashes.
- The API issues a JWT valid for 7 days. For deployment, set a strong `JWT_SECRET` environment variable and use HTTPS. The fallback secret is only for local development.
