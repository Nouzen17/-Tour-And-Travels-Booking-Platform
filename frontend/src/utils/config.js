import axios from "axios";

// Set base URL
axios.defaults.baseURL = "http://localhost:1530";

// Include credentials with every request
axios.defaults.withCredentials = true;

export default axios;
