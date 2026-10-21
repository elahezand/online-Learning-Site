# ACADEMIA — frontend

React 19 + TypeScript, built with Vite.

## Setup

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend
npm run dev               # http://localhost:3000
```

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                    |
| `npm run build`     | Type-check (`tsc -b`) and build into `dist/`  |
| `npm run preview`   | Serve the production build locally            |
| `npm run typecheck` | Type-check only                               |
| `npm run lint`      | ESLint (TypeScript + React Hooks rules)       |
| `npm test`          | Vitest (watch mode; `npm test -- --run` once) |

Environment variables (`.env`):

| Name             | Example                    |
| ---------------- | -------------------------- |
| `VITE_API_URL`   | `http://localhost:4000/v1` |
| `VITE_FILES_URL` | `http://localhost:4000`    |

## Folder structure

```
src/
├── app/            App, routes (lazy-loaded pages), AppProviders (React Query + Router + Auth + Toaster)
├── api/            client.ts (axios + token refresh), tokenStorage.ts, queryClient.ts
├── types/          models.ts (API data), api.ts (error type), axios.d.ts (custom request flags)
├── validators/     zod schemas for every form, plus the form value types inferred from them
├── features/       one folder per domain: its data hooks + its components
│   ├── auth/       hooks.ts, AuthContext, useAuth, RouteGuards, LoginForm, RegisterForm
│   ├── courses/    hooks.ts, CourseCard, CourseDetail, CoursesList, AddCourseForm, ...
│   ├── articles/   hooks.ts, ArticleCard, ArticleDetail, AddArticleForm, ...
│   └── ...         categories, comments, contacts, discounts, info, menus,
│                   newsletter, notifications, orders, search, tickets, users
├── components/
│   ├── ui/         shared building blocks: Input, Pagination, DataTable, toast actions, ...
│   └── layout/     Navbar, Topbar, Footer, Hero, PageHeader, admin/, account/
├── pages/          route screens only: public/, admin/ (/p-admin), account/ (/my-account)
├── hooks/          useTheme, usePagination, useDebouncedValue, useInView, useReactQueryHooks
├── styles/         main.scss — Bootstrap variables and the few custom rules
└── config/         env.ts
```

### Rules
- A **page** composes features and layout; it holds no fetching logic of its own.
- A **feature** owns its data: `features/<name>/hooks.ts` (`useCourses`, `useCreateCourse`, ...),
  built on the typed `useGet<T>` / `usePost<T, V>` / `usePut` / `useDelete` from `hooks/useReactQueryHooks.ts`.
  Mutations show their own toast and refresh the lists they change.
- **Forms** use `react-hook-form` with `zodResolver(schema)`; the schema lives in `validators/`.
- **Lists** read `?page=&limit=` from the URL through `usePagination`.
- **components/ui** knows nothing about the API; anything used by two or more features lives here.

## Styling
- **Bootstrap only.** `src/styles/main.scss` sets Bootstrap's own Sass variables (brand colors,
  neutrals, radius, shadows, dark-mode values) and compiles Bootstrap. Components use Bootstrap classes.
- **Light / dark** use Bootstrap 5.3 color modes (`<html data-bs-theme>`), switched by `useTheme`.
  `index.html` applies the saved theme before the first paint.
- **Text on photos** (hero, page headers): the section uses `data-bs-theme="dark"`.
- **Icons**: `react-icons/fa6`. **Toasts and confirmations**: `sonner` via `components/ui/toastActions`.
