import { createContext, useState, useEffect } from "react";
import axios from 'axios';

const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if(user) {
            const { sub, name } = user;
            (async () => {
                try {
                    const response = await axios.post('user/login', { google_oauth_sub: sub, name: name });
                    await localStorage.setItem('token', response.data.token);
                    setToken(response.data.token);
                }
                catch (error) {
                    setUser(null);
                    console.error(error);
                }
            })();            
        }
    }, [user]);

    const loginUser = (userData) => {
        setUser(userData);
        console.log("Login Success", userData);
    }
    const logoutUser = async () => {
        setUser(null);
        setToken(null);
        await localStorage.removeItem('token');
    }
    return (
        <UserAuthContext.Provider value={{ token, setToken, loginUser, logoutUser }}>
            {children}
        </UserAuthContext.Provider>
    );
}
export default UserAuthContext;