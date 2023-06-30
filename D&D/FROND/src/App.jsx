import { Route, Routes } from "react-router-dom";
import ContraptionDetailPage from "./pages/ContraptionDetailPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import Private from "./components/Private";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Private>
              <HomePage />
            </Private>
          }
        />
        <Route
          path="/contraptions/:id"
          element={
            <Private>
              <ContraptionDetailPage />
            </Private>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
