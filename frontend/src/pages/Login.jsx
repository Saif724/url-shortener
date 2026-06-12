import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";
 
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleLogin = async () => {
        const newErrors = {
            email: "",
            password: "",
        };
        if(!email.trim()) {
            newErrors.email = "Email is required";
        }
        if(!password.trim()){
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        if (newErrors.email || newErrors.password){
            return;
        }
        try {
            setLoading(true);
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
                toast.success("Login successful");
                navigate("/dashboard");
            } else {
                toast.error(data.error || "Login failed", {
                    id: data.error || "login-failed",
                });
            }
        } catch {
            toast.error("Server error", {
                id: "server-error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0b1220] flex items-center justify-center px-4">
            <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-purple-500 opacity-30 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-blue-500 opacity-30 blur-[120px] rounded-full"></div>
            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h1 className="text-4xl font-bold text-white text-center">
                    Welcome Back
                </h1>

                <p className="text-gray-400 text-center mt-2">
                    Login to continue
                </p>

                <div className="mt-8 space-y-4">

                    <input
                        type="email"
                        autoFocus
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            
                            if(errors.email){
                                setErrors((prev)=>({
                                    ...prev,
                                    email:"",
                                }));
                            }
                        }}
                        onKeyDown={(e)=>{
                            if (e.key === "Enter") {
                                handleLogin();
                            }
                        }}
                        className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-400 mt-1">
                            {errors.email}
                        </p>
                    )}

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e)=> {
                                setPassword(e.target.value);

                                if(errors.password){
                                    setErrors((prev)=>({
                                        ...prev,
                                        password: "",
                                    }));
                                }
                            }}
                            onKeyDown={(e)=>{
                                if(e.key==="Enter"){
                                    handleLogin();
                                }
                            }}
                            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                                absolute right-3 top-1/2 -translate-y-1/2
                                text-gray-400
                                hover:bg-white/10
                                p-1 rounded-md
                                transition-all duration-200
                            "
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-400 mt-1">
                            {errors.password}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold
                        bg-gradient-to-r from-blue-500 to-purple-500
                        text-white
                        hover:opacity-90
                        transition-all duration-200
                        disabled:opacity-90
                        disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </div>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?
                </p>

                <button
                    onClick={()=> navigate("/register")}
                    className="mt-3 w-full border border-white/10 p-3 rounded-xl text-white hover:bg-white/10 transition"
                >
                    Create Account
                </button>

            </div>
        </div>
    );
}