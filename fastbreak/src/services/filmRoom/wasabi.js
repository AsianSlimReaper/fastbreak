import {BASE_URL} from "../api.js";
import axios from "axios";

//purpose: get the video url from wasabi
// input: token, file_name
// output: video url
export const GetVideo = async(token,file_name) =>{
    try{
        // Check if file_name is provided
        const response = await axios.get(`${BASE_URL}/wasabi/get-video-url/${file_name}.mp4`,
        {
            headers: {
					'Authorization': `Bearer ${token}` // Include the token in the headers
				},
        })

        // Check if the response is successful
        return response.data
    }catch(error){
        // Log the error for debugging purposes
        console.error("Error fetching video:", error);
        throw error;
    }
}

// purpose: save the video to wasabi
// input: token, game_id, file
// output: response from the server
export const SaveVideo = async(token,game_id,file)=>{
    try{
        //create a new FormData object to hold the file
        const formData = new FormData();
        //append the file to the FormData object
        formData.append("file", file, `${game_id}.mp4`);
        //call the API to upload the video
        const response = await axios.post(`${BASE_URL}/wasabi/upload-video/`,
            //data to be sent in the request
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`, // Include the token in the headers
                    "Content-Type": "multipart/form-data" // Set the content type to multipart/form-data
                }
            })
            //return the response data
        return response.data
    }catch(error){
        // Log the error and rethrow it
        console.error("Error creating video:", error);
        throw error;
    }
}