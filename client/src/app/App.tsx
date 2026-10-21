import { Suspense } from "react"
import { useRoutes } from "react-router-dom"
import PageLoader from "../components/ui/PageLoader"
import routes from "./routes"

export default function App() {
    return <Suspense fallback={<PageLoader fullPage />}>{useRoutes(routes)}</Suspense>
}
