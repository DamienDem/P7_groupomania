import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");

    axios({
      url:`http://localhost:3000/login`,
      method: "POST",
      data: { email, password },
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      console.log(res);
      if (res.data.errors) {
        emailError.innerHTML = res.data.errors.email;
        passwordError.innerHTML = res.data.errors.password;
      } else {
        window.location = "/";
      }
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <form action="" onSubmit={handleLogin} id="sign-up-form">
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="email error"></div>
      <label htmlFor="password"> Mot de passe</label>
      <input
        name="password"
        type="password"
        className="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="password error"></div>
      <input type="submit" value="Se Connecter" />
    </form>
  );
};

export default Login;