import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"/piston/api/v2"
})

export default axiosInstance;
