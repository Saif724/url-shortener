import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const newErrors = { email: "", password: "" };

        if (!email.trim()) newErrors.email = "Email is required";
        if (!password.trim()) newErrors.password = "Password is required";

        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return;

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
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
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--text)] flex items-center justify-center px-4 transition-colors duration-300">

            {/* background blobs */}
            <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-purple-500/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-blue-500/20 blur-[120px] rounded-full"></div>

            {/* card */}
            <div className="relative z-10 w-full max-w-md bg-[var(--card)] border border-[var(--border)] backdrop-blur-xl rounded-3xl p-8 shadow-xl transition-all duration-300">

                <h1 className="text-4xl font-bold text-[var(--text)] text-center">
                    Welcome Back
                </h1>

                <p className="text-[var(--muted)] text-center mt-2">
                    Login to continue
                </p>

                <div className="mt-8 space-y-5">

                    {/* EMAIL */}
                    <div>
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
                                if (e.key === "Enter") handleLogin();
                            }}
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

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
                                if (e.key === "Enter") handleLogin();
                            }}
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 pr-10 text-[var(--text)] placeholder:text-[var(--muted)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] p-1 rounded-md transition"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.password}
                        </p>
                    )}

                    {/* LOGIN BUTTON */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                {/* FOOTER */}
                <p className="text-center text-[var(--muted)] mt-6">
                    Don't have an account?
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="mt-3 w-full border border-[var(--border)] bg-[var(--card)] text-[var(--text)] p-3 rounded-xl hover:opacity-80 transition"
                >
                    Create Account
                </button>

            </div>
        </div>
    );
}