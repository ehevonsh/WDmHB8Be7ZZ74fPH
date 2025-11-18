import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./lib/auth";

import { Navbar, Footer } from "./components";
import { AboutUs, Posts, Users, Profile, PostPage } from "./pages";
import CreatePost from "./pages/CreatePost/CreatePost";

function App() {
  const hydrateAuth = useAuth((state) => state.hydrate);
  const user = useAuth((state) => state.user);

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
            <Route path="/post/:postDocumentId" element={<PostPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            {user.browserDataCombinationID && (
              <Route path="/create-a-post" element={<CreatePost />} />
            )}
            <Route path="/users" element={<Users />} />
            <Route path="/my-profile" element={<Profile />} />
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
