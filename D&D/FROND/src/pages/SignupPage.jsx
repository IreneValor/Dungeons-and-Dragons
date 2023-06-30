import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
const API_URL = "http://localhost:5005";
import axios from "axios";

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setSignupData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = { email, password, username };

    console.log(requestBody);
    //cambiar este axios por el modelo que hay en LoginPage que es este
    //  authService
    //   .login(loginData)
    //   .then(({ data }) => {
    //     storeToken(data.authToken);
    //     authenticate();
    //     navigate("/");
    //   })
    //   .catch((err) => console.log(err));
    authService
      .signup(signupData)
      .then(({ data }) => {
        // storeToken(data.authToken);
        // console.log(storeToken);
        // authenticate();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  //   axios
  //     .post(`${API_URL}/auth/signup`, requestBody)
  //     .then((response) => {
  //       navigate("/login");
  //     })
  //     .catch((error) => {
  //       const errorDescription = error.response.data.message;
  //       setErrorMessage(errorDescription);
  //     });
  // };

  const { username, password, email } = signupData;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleInputChange}
          name="username"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handleInputChange}
          name="password"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleInputChange}
          name="email"
        />
      </div>

      <div>
        <button type="submit">Create user</button>
        <Link to="/login">Login</Link>
      </div>
    </form>
  );
};

export default SignupPage;
