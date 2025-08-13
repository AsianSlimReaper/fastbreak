import {BASE_URL} from "../api.js";
import axios from "axios";

export const GetVideo = async(token,file_name) =>{
    try{
        const response = await axios.get(`${BASE_URL}/wasabi/get-video-url/${file_name}.mp4`,
        {
            headers: {
					'Authorization': `Bearer ${token}`
				},
        })

        return response.data
    }catch(error){
        console.error("Error fetching video:", error);
        throw error;
    }
}

export const SaveVideo = async(token,game_id,file)=>{
    try{
        const formData = new FormData();
        formData.append("file", file, `${game_id}.mp4`);
        const response = await axios.post(`${BASE_URL}/wasabi/upload-video/`,
            formData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
        return response.data
    }catch(error){
        console.error("Error creating video:", error);
        throw error;
    }
}