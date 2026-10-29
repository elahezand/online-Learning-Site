# ACADEMIA — server

REST API for the ACADEMIA online learning platform. Node.js + Express + MongoDB (Mongoose),
JWT auth, Multer uploads and zod validation written in TypeScript.

## Setup

```bash
npm install
cp .env.example .env      # set MONGO_URI and the two token secrets
npm run dev               # http://localhost:4000
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start with reload on file changes (tsx watch) |
| `npm start`         | Start the server                              |
| `npm run typecheck` | Type-check the TypeScript validators          |

Environment variables (`.env`):

| Name                   | Required | Example                                     |
| ---------------------- | -------- | ------------------------------------------- |
| `MONGO_URI`            | yes      | `mongodb://127.0.0.1:27017/academia`        |
| `ACCESS_TOKEN_SECRET`  | yes      | a long random string                        |
| `REFRESH_TOKEN_SECRET` | yes      | another long random string                  |
| `PORT`                 |          | `4000`                                      |
| `NODE_ENV`             |          | `development` / `production`                |
| `CORS_ORIGIN`          |          | `http://localhost:5173` (comma list or `*`) |
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

`route` → guards (`user` / `admin`) → upload (if any) → `validate` → `controller` → `service` → `model`

- A route validates params, query and body with `validate({ params, query, body })` (zod).
  The validated data lands in `req.parsed.data`.
- A **controller** only passes `req.parsed.data` to its service and sends the response.
- A **service** holds the logic and throws `AppError` (`notFound`, `conflict`, `forbidden`, ...).
- Lists are paginated with `utils/paginate` and answer with `{ items, pagination }`.
- Related documents are returned populated (objects), never flattened to strings.
- Every error goes to `errorHandler`, which always answers with
  `{ message, errors?: [{ field, message }] }` and removes any file uploaded with a failed request.

## API

All routes are under `/v1`. 🔓 public · 👤 logged in · 🛡️ admin

| Resource        | Routes |
| --------------- | ------ |
| `auth`          | 🔓 `POST /register` `/login` `/refresh` `/logout` · 👤 `GET /me` |
| `users`         | 🛡️ `GET /` (search, role, status) · 👤 `PUT /` (own profile) · 👤 `GET /courses` · 🛡️ `PUT /role` `/ban/:id` `/unban/:id` · 🛡️ `PUT /:id` `DELETE /:id` |
| `courses`       | 🔓 `GET /` `/popular` `/related/:shortName` `/:shortName` · 🛡️ `GET /options` · 🛡️ `POST /` `PUT /:id` `DELETE /:id` · 👤 `POST /:id/register` (free courses only) |
| `sessions`      | 🛡️ `GET /` `POST /` `DELETE /:id` · 👤 `GET /:shortName/:sessionID` |
| `articles`      | 🔓 `GET /` `/:shortName` · 🛡️ `POST /` `POST /draft` `PUT /:id` `DELETE /:id` |
| `category`      | 🔓 `GET /` · 🛡️ `POST /` `PUT /:id` `DELETE /:id` |
| `comments`      | 🔓 `GET /top` · 👤 `POST /` · 🛡️ `GET /` `DELETE /:id` `POST /answer/:id` `PUT /accept/:id` `PUT /reject/:id` |
| `tickets`       | 👤 `POST /` `GET /user` `GET /answer/:id` `GET /:id/messages` `POST /:id/messages` · 🛡️ `GET /` `POST /answer` · 🔓 `GET /departments` `/departments-subs/:id` |
| `offs`          | 🛡️ `GET /` `POST /` `DELETE /:id` `POST /all` `DELETE /all` |
| `orders`        | 👤 `GET /` `GET /:id` |
| `contact`       | 🔓 `POST /` · 🛡️ `GET /` `POST /answer` `DELETE /:id` |
| `newsletters`   | 🔓 `POST /` · 🛡️ `GET /` |
| `menus`         | 🔓 `GET /` `/all` `/topbar` · 🛡️ `POST /` `DELETE /:id` |
| `infos`         | 🔓 `GET /index` · 🛡️ `GET /p-admin` |
| `notifications` | 🛡️ `PUT /see/:id` |
| `search`        | 🔓 `GET /:value` |

Send the token as `Authorization: Bearer <accessToken>`. The first account ever registered becomes ADMIN.
