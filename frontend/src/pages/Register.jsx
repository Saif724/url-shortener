import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleRegister = async () => {
        const newErrors = {
            email: "",
            password: "",
        };

        if (!email.trim()) newErrors.email = "Email is required";
        if (!password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created");
                navigate("/login");
            } else {
                toast.error(data.error || "Register failed", {
                    id: data.error || "register-failed",
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
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] flex items-center justify-center px-4">

            {/* background glow */}
            <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-purple-500 opacity-20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>

            {/* card */}
            <div className="relative z-10 w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl">

                <h1 className="text-4xl font-bold text-[var(--text)] text-center">
                    Create Account
                </h1>

                <p className="text-[var(--muted)] text-center mt-2">
                    Join and start shortening URLs
                </p>

                <div className="mt-8 space-y-4">

                    {/* EMAIL */}
                    <input
                        type="email"
                        autoFocus
                        autoComplete="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleRegister();
                        }}
                        className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-400">{errors.email}</p>
                    )}

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors((prev) => ({ ...prev, password: "" }));
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRegister();
                            }}
                            className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 pr-10 text-[var(--text)] placeholder-[var(--muted)] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:bg-white/10 p-1 rounded-md transition"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-400">{errors.password}</p>
                    )}

                    {/* BUTTON */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </div>

                <p className="text-center text-[var(--muted)] mt-6">
                    Already have an account?
                </p>

                <button
                    onClick={() => navigate("/login")}
                    className="mt-3 w-full border border-[var(--border)] p-3 rounded-xl text-[var(--text)] hover:bg-white/10 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}