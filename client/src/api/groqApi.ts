import axios from "axios"

const groqApi = axios.create({
	baseURL: "http://localhost:3000/api",
})

export default groqApi
