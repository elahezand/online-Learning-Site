# ACADEMIA — server

REST API for the ACADEMIA online learning platform. Node.js + Express + MongoDB (Mongoose),
JWT auth, Multer uploads and zod validation written in TypeScript.

## Setup

```bash
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm run dev               # http://localhost:4000
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start with reload on file changes (tsx watch) |
| `npm start`         | Start the server                              |
| `npm run typecheck` | Type-check the TypeScript validators          |

Environment variables (`.env`):

| Name             | Required | Example                               |
| ---------------- | -------- | ------------------------------------- |
| `MONGO_URI`      | yes      | `mongodb://127.0.0.1:27017/academia`  |
| `JWT_SECRET`     | yes      | a long random string                  |
| `PORT`           |          | `4000`                                |
| `NODE_ENV`       |          | `development` / `production`          |
| `JWT_EXPIRES_IN` |          | `30d`                                 |
| `CORS_ORIGIN`    |          | `http://localhost:3000` (comma list or `*`) |
| `MAIL_SERVICE`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM_NAME` | | needed only to email answers to contact messages |

## Folder structure

```
src/
├── server.js           connect to MongoDB, then start listening
├── app.js              express app: body parsers, CORS, static files, routes, error handler
├── config/             env.js (reads and checks .env), db.js
├── models/             Mongoose schemas with types, required messages, enums and indexes
├── validators/         zod schemas in TypeScript, one file per domain + common.ts
├── routes/
│   ├── guards.js       user (logged in), admin (logged in + ADMIN), optionalUser
│   └── v1/             one router per resource, mounted at /v1/<resource>
├── controllers/
│   ├── public/         anyone can call these
│   ├── user/           a logged-in user, acting on their own data
│   └── admin/          admins only
├── services/
│   ├── public/ user/ admin/   the business logic behind each controller
│   └── shared/         course stats, comment tree, ticket threads, user field selects
├── middlewares/        auth, cors, upload (multer), errorHandler
└── utils/              AppError, asyncHandler, tokens, mailer, files, text
public/courses/covers/  uploaded covers and videos (served at /courses/covers/<file>)
```

### How a request flows

`route` → guards (`user` / `admin`) → upload (if any) → `controller` → `service` → `model`

- A **controller** only reads the request, validates it with its zod schema
  (`schema.parse(...)`) and sends the response.
- A **service** holds the logic and throws `AppError` (`notFound`, `conflict`, `forbidden`, ...).
- Every error goes to `errorHandler`, which always answers with
  `{ message, errors?: [{ field, message }] }` and removes any file uploaded with a failed request.

## API

All routes are under `/v1`. 🔓 public · 👤 logged in · 🛡️ admin

| Resource       | Routes |
| -------------- | ------ |
| `auth`         | 🔓 `POST /register` · 🔓 `POST /login` · 👤 `GET /me` |
| `users`        | 🛡️ `GET /` · 👤 `PUT /` (own profile) · 👤 `GET /courses` · 🛡️ `PUT /role` · 🛡️ `PUT /ban/:id` · 🛡️ `PUT /:id` · 🛡️ `DELETE /:id` |
| `courses`      | 🔓 `GET /` `/presell` `/popular` `/category/:name` `/related/:shortName` `/:shortName` · 🛡️ `POST /` `PUT /:id` `DELETE /:id` · 🛡️ `GET /sessions` `POST /:id/sessions` `DELETE /sessions/:id` · 👤 `POST /:id/register` · 👤 `GET /:shortName/:sessionID` |
| `articles`     | 🔓 `GET /` `/:shortName` · 🛡️ `POST /` `POST /draft` `PUT /:id` `DELETE /:id` |
| `category`     | 🔓 `GET /` · 🛡️ `POST /` `PUT /:id` `DELETE /:id` |
| `comments`     | 👤 `POST /` · 🛡️ `GET /` `DELETE /:id` `POST /answer/:id` `PUT /accept/:id` `PUT /reject/:id` |
| `tickets`      | 👤 `POST /` `GET /user` `GET /answer/:id` `GET /:id/messages` `POST /:id/messages` · 🛡️ `GET /` `POST /answer` · 🔓 `GET /departments` `/departments-subs/:id` |
| `offs`         | 🛡️ `GET /` `POST /` `DELETE /:id` `POST /all` `DELETE /all` · 👤 `POST /:code` (apply a code) |
| `orders`       | 👤 `GET /` `GET /:id` |
| `contact`      | 🔓 `POST /` · 🛡️ `GET /` `POST /answer` `DELETE /:id` |
| `newsletters`  | 🔓 `POST /` · 🛡️ `GET /` |
| `menus`        | 🔓 `GET /` `/all` `/topbar` · 🛡️ `POST /` `DELETE /:id` |
| `infos`        | 🔓 `GET /index` · 🛡️ `GET /p-admin` |
| `notifications`| 🛡️ `PUT /see/:id` |
| `search`       | 🔓 `GET /:value` |

Send the token as `Authorization: Bearer <accessToken>`. The first account ever registered becomes ADMIN.
