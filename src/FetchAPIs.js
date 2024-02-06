import axios from 'axios';

export const fetchAccessToken = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token`);
        return response.data;
    } catch (error) {
        console.log(error);
    }   
};