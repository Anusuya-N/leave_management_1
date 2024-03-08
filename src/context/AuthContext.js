import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userStatus, setUserStatus] = useState(null);
    const [userType, setUserType] = useState(null);

    const [leaveLoad, setLeaveLoad] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://118.189.74.190:1016/api/uservalidation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uniqueid: email,
                        uniquestr: password,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserStatus(data.Status);
                    setUserType(data.StatusResult)
                } else {
                    console.error('Error fetching user status');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [email, password]);
    return (

        <AuthContext.Provider
            value={{
                setEmail,
                email,
                password,
                setPassword,
                userStatus,
                setUserStatus,
                setLeaveLoad,
                leaveLoad,
                userType,
                setUserType
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
