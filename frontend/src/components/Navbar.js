import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import cookie from "js-cookie";


const Navbar = ({connectionChoice}) => {
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState([]);

  const removeCookie = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };

  const fetchToken = async () => {
    await axios({
      method: "get",
      url: "http://localhost:3000/",
      withCredentials: true,
    })
      .then((res) => {
        setUserId(res.data.id);
      })
      .catch((err) => console.log("Pas de token:" + err));
  };
  const getUser = async () => {
    await fetchToken();
    await axios({
      method: "get",
      url: "http://localhost:3000/user/" + userId,
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      setUserData(res.data.data);
    })
    .catch((err) => {
      console.log('impossible de récupérer les données utilisateur'+ err);
    });
  };
  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    await axios({
      method:"get",
      url:"http://localhost:3000/logout",
      withCredentials: true,
    })
    .then(_ => {
      removeCookie("jwt")
    })
    .catch((err) => console.log('logout error:'+err))
  }

  return (
    <div className="nav-container">
      {userId ? (
        <nav>
          <ul>
            <li>
              <NavLink exact ='true' to="/">
                <img
                className="logo"
                  src="./images/icon-left-font.png"
                  alt="logo Groupomania"
                />
              </NavLink>
            </li>
            <li>Bienvenue {userData.firstName}</li>
            <li>
            <NavLink exact ='true' to="/profil">
                <img
                  className="profilPicture"
                  src={userData.picture}
                  alt="profil"
                />
              </NavLink>
              <NavLink exact ='true' to="/auth">
                <div onClick={logout} className="logout button"> Se déconnecter </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
          <img
                className="logo"
                  src="./images/icon-left-font.png"
                  alt="logo Groupomania"
                />
            <li onClick={connectionChoice} id="signIn"> 
                Se connecter 
            </li>
            <li onClick={connectionChoice} id='signUp'> 
                S'inscrire
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
