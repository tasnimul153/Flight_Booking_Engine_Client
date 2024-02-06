import axios from "axios";

const Token = async () => {
    const API_KEY = 'hzdpXSNcnNoEqfE7FbDzAp5vMtmXQBDc';
    const API_SECRET = '5YAkYcudcGNU89S0';

    try {
        // Check if the token has already expired or not available
        const storedTokenExpiration = localStorage.getItem("tokenExpiration");
        if (storedTokenExpiration && Date.now() < Number(storedTokenExpiration)) {
            const storedAccessToken = localStorage.getItem("accessToken");
            if (storedAccessToken) {
                return storedAccessToken;
            }
        }

        const URL = 'https://test.api.amadeus.com/v1/security/oauth2/token';

        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', API_KEY);
        data.append('client_secret', API_SECRET);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const response = await axios.post(URL, data.toString(), { headers });

        // Convert expiresIn to milliseconds and set tokenExpiration accordingly
        const expiresInMs = response.data.expires_in * 1000;
        const tokenExpiration = Date.now() + expiresInMs;

        // Save token and expiration time to localStorage
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("tokenExpiration", tokenExpiration.toString());

        return response.data.access_token;
    } catch (error) {
        console.error('Error generating access token:', error);
        return null;
    }
};

export default Token;
