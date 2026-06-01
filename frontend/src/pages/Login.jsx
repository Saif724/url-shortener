import { useState } from "react";
import {useNavigate} from "react-router-dom";
import API_BASE from "../api/api";
 
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.data.token);
            navigate("/dashboard");
        } else {
            alert(data.message || "Login failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Login
                </h1>

                <input 
                    className="w-full border p-2 mb-2"
                    placeholder="Email"
                    onChange={(e)=> setEmail(e.target.value)}
                />

                <input 
                    className="w-full border p-2 mb-4"
                    type="password" 
                    placeholder="Password"
                    onChange={(e)=> setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>

                <p
                    onClick={()=> navigate("/register")}
                    className="text-sm text-blue-500 mt-3 cursor-pointer text-center hover:underline"
                >
                    Create account
                </p>

            </div>

        </div>
    );
}