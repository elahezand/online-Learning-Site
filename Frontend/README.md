# ACADEMIA — frontend

## Setup

```bash
npm install
cp .env.example .env.development   # point REACT_APP_API_URL at your backend
npm start
npm test
```

## Folder structure

```
src/
├── app/            App, routes, AppProviders (React Query + Router + Auth + Toaster)
├── api/            client.js (axios + token refresh), tokenStorage.js, queryClient.js
├── features/       one folder per domain: its data hooks + its components
│   ├── auth/       hooks.js, AuthContext, RouteGuards, LoginForm, RegisterForm
│   ├── courses/    hooks.js, CourseCard, CourseDetail, CoursesList, AddCourseForm, ...
│   ├── articles/   hooks.js, ArticleCard, ArticleDetail, AddArticleForm, ...
│   └── ...         categories, comments, contacts, discounts, info, menus,
│                   newsletter, notifications, orders, search, tickets, users
├── components/
│   ├── ui/         shared building blocks: Button, Input, Pagination, DataTable, ...
│   └── layout/     Navbar, Topbar, Footer, Landing, admin/, account/
├── pages/          route screens only: public/, admin/ (/p-admin), account/ (/my-account)
├── hooks/          useTheme, useForm, useDebouncedValue, useInView, useReactQueryHooks
├── styles/         main.scss — Bootstrap variables only (colors, fonts, radius, dark mode)
├── config/         env.js
└── utils/          validators
```

### Rules
- A **page** composes features and layout; it holds no fetching logic of its own.
- A **feature** owns its data: `features/<name>/hooks.js` (`useCourses`, `useCreateCourse`, ...),
  built on `useGet` / `usePost` / `usePut` / `useDelete` from `hooks/useReactQueryHooks.js`.
  Mutations show their own toast and refresh the lists they change.
- **components/ui** knows nothing about the API; anything used by two or more features lives here.
- Imports are relative and without the `.js` extension; file name = component name.

## Styling
- **Bootstrap only.** There are no component CSS files. `src/styles/main.scss` sets Bootstrap's own
  Sass variables (brand colors, neutrals, radius, shadows, dark-mode values) and compiles Bootstrap.
  Components use Bootstrap classes and utilities.
- **Light / dark** use Bootstrap 5.3 color modes (`<html data-bs-theme>`), switched by `useTheme`.
  Use `bg-body` for cards/panels, `bg-body-tertiary` for the page, `text-body-emphasis` for headings,
  `text-primary-emphasis` for orange text (readable in both themes).
- **Text on photos** (hero, page headers): wrap the section in `data-bs-theme="dark"` so its contents
  use light-on-dark colors.
- **Icons**: `react-icons/fa6` (bundled, no CDN).
- **Dialogs**: `useDialog()` from `components/ui/DialogProvider` (Bootstrap Modal). **Toasts**: `sonner`.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Styling, theme & dark mode

- **Bootstrap 5.3** is installed from npm (`bootstrap`) and imported in `src/index.js`; layouts use Bootstrap's grid, utilities and components (`react-bootstrap` for Navbar/Offcanvas, Modal, Dropdown, Accordion).
- **All colors live in `src/styles/theme.css`** as `:root` tokens (`--color-primary`, `--color-surface`, `--color-text` …) with a matching `[data-bs-theme="dark"]` block. Bootstrap's own variables (`--bs-primary`, `--bs-body-bg` …) point at these tokens, so every Bootstrap class follows the theme. To change the brand color, edit the tokens there only.
- `src/styles/base.css` holds global base styles, shared helpers (`.surface`, `.icon-btn`, `.icon-badge`, `.section-title`, `.reveal`) and theming for SweetAlert, Swiper and CKEditor.
- **Dark mode**: `src/Hooks/useTheme.js` + `<ThemeToggle />` (site top bar and admin bar). The choice is saved in `localStorage`; with no saved choice the OS setting is followed. `public/index.html` applies it before first paint.
