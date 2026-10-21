import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import App from './app/App';
import AppProviders from './app/AppProviders';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);


reportWebVitals();
