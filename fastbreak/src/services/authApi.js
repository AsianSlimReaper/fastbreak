import axios from 'axios';
import {BASE_URL} from "./api.js";

export const Token = async (username, password) => {
	try {
		const response = await axios.post(
			`${BASE_URL}/users/token`,
			new URLSearchParams({
				username: username,
				password: password,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

		return response.data;
	} catch (error) {
		console.error("API error:", error.response?.data || error.message);
		throw error;
	}
};

export const CreateUser = async (name, email, password) =>{
	try{
		const response = await axios.post(
			`${BASE_URL}/users/`,
			{
				name: name,
				email: email,
				password: password,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.data;
	} catch(error) {
		console.error("API error:", error.response?.data || error.message)
		throw error
	}
}
