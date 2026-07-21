import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ToastProvider() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
        />
    )
}

export { toast }
