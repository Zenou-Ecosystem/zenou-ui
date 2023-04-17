import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigation = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigation("/");
    })
    return (
        <div></div>
    )
}

export default Logout