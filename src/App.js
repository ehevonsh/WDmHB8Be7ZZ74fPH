import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./lib/auth";
import AuthRouteProtection from "./AuthRouteProtection";

import { Navbar, Footer } from "./components";
import { AboutUs, Posts, Users, Profile, PostPage } from "./pages";
import CreatePost from "./pages/CreatePost/CreatePost";

function App() {
  const hydrateAuth = useAuth((state) => state.hydrate);
  const user = useAuth((state) => state.user);

  const isAuthenticated = user.browserDataCombinationID !== undefined;

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1">
          <Navbar />
          <Routes>
            {/* Normie routes */}
            <Route path="/" element={<Posts />} />
            <Route path="/post/:postDocumentId" element={<PostPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Auth protected routes */}
            <Route
              element={
                <AuthRouteProtection isAuthenticated={isAuthenticated} />
              }
            >
              <Route path="/create-a-post" element={<CreatePost />} />
              <Route path="/my-profile" element={<Profile />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer className="mt-auto" />
      </div>
    </BrowserRouter>
  );
}

export default App;
