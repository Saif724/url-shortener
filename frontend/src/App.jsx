import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UrlDetails from "./pages/UrlDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useState, useEffect } from "react";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route 
          path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard theme={theme} setTheme={setTheme} />
              </ProtectedRoute>
          } 
         />


        <Route path="/url/:id" element={<UrlDetails/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;