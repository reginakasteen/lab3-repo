import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import {useContext} from 'react'

import AuthContext from '../context/AuthContext'

const baseURL = 'https://chat-back-production-139c.up.railway.app/api';

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useContext(AuthContext);
    const axiosInstance = axios.create({
        baseURL, 
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    axiosInstance.interceptors.request.use(async request => {
        if (!authTokens) return axiosInstance;
        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs() < 1);
        if (isExpired)
            return request;

        const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: authTokens.refresh,
        });

        localStorage.setItem('authToken', JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        request.headers.Authorization = `Bearer ${response.data.access}`;
        return request;
    })
    
    return axiosInstance;

}    

export default useAxios;
export { baseURL };
