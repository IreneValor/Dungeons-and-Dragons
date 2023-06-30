import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

import axios from "axios";
import authService from "../services/auth.service";

const API_URL = "http://localhost:5005";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { authenticate, storeToken, error } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // axios
    //   .post(`${API_URL}/auth/login`, { email, password })
    //   .then((response) => {
    //     const { data } = response;
    //     storeToken(data.authToken);
    //     authenticate();
    //     navigate("/");
    //   })
    //   .catch((err) => console.log(err));
    authService.login(loginData).then(({ data }) => {
      storeToken(data.authToken);
      authenticate();
      navigate("/");
    });
  };

  const { password, email } = loginData;

  return (
    <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
        {/* <Link to="/signup">Signup</Link> */}
      </div>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginPage;

// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/auth.context";
// import authService from "../services/auth.service";

// const LoginPage = () => {
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const { authenticate, storeToken, error } = useContext(AuthContext);

//   const handleInputChange = (e) => {
//     const { value, name } = e.target;
//     setLoginData((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     authService
//       .login(loginData)
//       .then((response) => {
//         const { data } = response;
//         storeToken(data.authToken);
//         authenticate();
//         navigate("/");
//       })
//       .catch((err) => console.log(err));
//   };

//   const { password, email } = loginData;

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={handleInputChange}
//           name="email"
//         />
//       </div>

//       <div>
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={handleInputChange}
//           name="password"
//         />
//       </div>

//       <div>
//         <button type="submit">Login</button>
//         {/* <Link to="/signup">Signup</Link> */}
//       </div>
//       {error && <p>{error}</p>}
//     </form>
//   );
// };

// export default LoginPage;
