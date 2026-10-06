import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Feed from "./pages/Feed/Feed";
import Followers from "./pages/Followers/Followers";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Search from "./pages/Search/Search";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token")),
  );

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  function toggleTheme() {
    setIsDarkMode((currentTheme) => !currentTheme);
  }

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
            <Layout
              onLogout={() => setIsAuthenticated(false)}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            >
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
            <Layout
              onLogout={() => setIsAuthenticated(false)}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            >
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
            <Layout
              onLogout={() => setIsAuthenticated(false)}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            >
              <Followers />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/search"
        element={
          isAuthenticated ? (
            <Layout
              onLogout={() => setIsAuthenticated(false)}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            >
              <Search />
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
