import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./styles/main.scss"
import "swiper/css"
import "swiper/css/pagination"
import App from "./app/App"
import AppProviders from "./app/AppProviders"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProviders>
            <App />
        </AppProviders>
    </StrictMode>
)
