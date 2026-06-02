import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");
    const navigate= useNavigate();

    const handleRegister = async () => {
        const res = await fetch (`${API_BASE}/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Account created");
            navigate("/");
        } else {
            toast.error(data.message || "Register failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Register
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
                    onClick={handleRegister}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    Register
                </button>
            </div>
        </div>
    );
}