import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Axios from 'axios';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        autoClose={4000}
        pauseOnHover
        pauseOnFocusLoss
        closeOnClick
      />
    </>
  )
}

export default MyApp
