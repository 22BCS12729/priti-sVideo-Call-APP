import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import  server from "../environment";
export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`  
});

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });

            if (request?.status === httpStatus.CREATED && request?.data?.message) {
                return request.data.message;
            } else {
                console.error("Registration failed or invalid response.");
            }
        } catch (err) {
            console.error("Registration error:", err?.response?.data || err.message);
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const request = await client.post("/login", {
                username: username,
                password: password
            });

            if (request?.status === httpStatus.OK && request?.data?.token) {
                console.log(username, password);
                console.log(request.data);
                localStorage.setItem("token", request.data.token);
                router("/home");
            } else {
                console.error("Login failed or response structure is unexpected.");
            }
        } catch (err) {
            console.error("Login error:", err?.response?.data || err.message);
            throw err;
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });

            if (request?.data) {
                return request.data;
            } else {
                console.error("Error: No data received from getHistoryOfUser.");
            }
        } catch (err) {
            console.error("getHistoryOfUser error:", err?.response?.data || err.message);
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });

            if (request?.data) {
                return request.data;
            } else {
                console.error("Error: No data received from addToUserHistory.");
            }
        } catch (e) {
            console.error("addToUserHistory error:", e?.response?.data || e.message);
            throw e;
        }
    };

    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
