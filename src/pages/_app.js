// import Providers from "@/contextApi/Providers";
import "../styles/styles.scss";
import "../styles/globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Providers from "../contextApi/Providers";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getLocalStorage } from "@/utils/common";

export default function App({ Component, pageProps }) {
  console.log("AppPage lOAded");

  return (
    <Providers>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={15000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Providers>
  );
}
