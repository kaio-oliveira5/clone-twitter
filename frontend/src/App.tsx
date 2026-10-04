import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Feed from "./pages/Feed/Feed";
import Followers from "./pages/Followers/Followers";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token")),
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/feed" replace />
          ) : (
            <Login onLogin={() => setIsAuthenticated(true)} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/feed" replace /> : <Register />
        }
      />

      <Route
        path="/feed"
        element={
          isAuthenticated ? (
            <Layout onLogout={() => setIsAuthenticated(false)}>
              <Feed />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <Layout onLogout={() => setIsAuthenticated(false)}>
              <Profile />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/followers"
        element={
          isAuthenticated ? (
            <Layout onLogout={() => setIsAuthenticated(false)}>
              <Followers />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
