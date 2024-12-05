import axios from "axios";
import Router from "next/router"; // Import Router from Next.js
import { clearLocalStorage, getLocalStorage } from "./common";

let BASE_URL = "https://dataapi.openledger.dev/api/v1/";

const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(
  async function (config) {
    try {
      const auth_token = await getLocalStorage("auth_token"); // Retrieve token from localStorage
      if (auth_token) {
        config.headers.Authorization = `Bearer ${auth_token}`;
      }
    } catch (error) {
      console.error("Error fetching auth token:", error);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

appAxios.interceptors.response.use(
  (response) => {
    return response; // Pass through successful responses
  },
  async (error) => {
    const { response } = error;

    if (!response) {
      // This handles network errors or when the server doesn't respond
      console.error("Network error or server not reachable.");
      alert("Unable to connect to the server. Please try again later.");
      return Promise.reject(error);
    }

    const statusCode = response.status;

    // Handle different HTTP error codes here
    if (statusCode === 404) {
      console.error("Resource not found (404).");

      // Optionally, you can redirect to a custom 404 page
      // Router.push("/404");
    } else if (statusCode === 401) {
      console.error("Unauthorized (401): Token expired or invalid.");

      // Remove the expired token from storage and redirect
      // localStorage.removeItem("auth_token");
      // localStorage.removeItem("privateKey");
      clearLocalStorage();

      // Redirect user to login or welcome page
      Router.push("/welcome");
    } else if (statusCode === 500) {
      console.error("Server error (500).");

      // Optionally, display a custom message or redirect to an error page
      alert(
        "There was an error processing your request. Please try again later."
      );
    } else {
      console.error(`Unexpected error: ${statusCode}`, response);
    }

    return Promise.reject(error); // Always reject the error so it can be handled further if needed
  }
);

export default appAxios;
