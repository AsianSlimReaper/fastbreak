import axios from 'axios';
import {BASE_URL} from "./api.js";

//purpose: create a token for the user
//input: username, password
//output: token object
export const Token = async (username, password) => {
	try {
		//call the API to get a token
		const response = await axios.post(
			`${BASE_URL}/users/token`,
			//parameters to send to the API
			new URLSearchParams({
				username: username,
				password: password,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded', // specify the content type
				},
			});

		//return the token object
		return response.data;
	} catch (error) {
		//handle errors
		console.error("API error:", error.response?.data || error.message);
		throw error;
	}
};

//purpose: create a user
export const CreateUser = async (name, email, password) =>{
	try{
		//call the API to create a user
		const response = await axios.post(
			`${BASE_URL}/users/`,
			//parameters to send to the API
			{
				name: name,
				email: email,
				password: password,
			},
			{
				headers: {
					'Content-Type': 'application/json', // specify the content type
				},
			}
		);
		//return the user object
		return response.data;
	} catch(error) {
		//handle errors
		console.error("API error:", error.response?.data || error.message)
		throw error
	}
}
