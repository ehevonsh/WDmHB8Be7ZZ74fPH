import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./lib/auth";

import { Navbar, Footer } from "./components";
import { AboutUs, Posts } from "./pages";

function App() {
  const hydrateAuth = useAuth((state) => state.hydrate);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/about-us" element={<AboutUs />} />
            {/* Redirect helpers */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer className="mt-auto" />
      </div>
    </BrowserRouter>
  );
}

export default App;
