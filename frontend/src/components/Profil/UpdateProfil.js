import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { fetchToken, getUser, updateUser, deleteUser } from "../services/User";
import { Logout } from "../services/autentification";

const UpdateProfil = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [image, setImage] = useState();
  const [description, setDescription] = useState("");
  const location = useLocation();
  const [postPicture, setPostPicture] = useState(location.state.picture);
  const [id, setId] = useState(location.state.id)
  
  useEffect(() => {
    fetchToken(setUserId)
    getUser(setUserData, id,setId);
  }, [userData.id])

  const handleDelete = () => {
    if(userData.id === userId) {
      deleteUser(userData.id); 
      Logout(setUserId);
    } else {
      deleteUser(id);
      window.location='/'
    }

  }

  const handleUpdate = () => {
    const data = new FormData();
    data.append("description", description)
    updateUser(data);
  };

const handleImage = (e) => {
 e.preventDefault()
  const data = new FormData();
  data.append("image", image);
  updateUser(data);

}
const handlePicture = (e) => {
  setPostPicture(URL.createObjectURL(e.target.files[0]));
  setImage(e.target.files[0]);
  console.log(e.target.files[0]);
};

  return (
    <div className="profil">
      <div className="profil--title">
      <h1>
        Profil de {userData.name} {userData.firstName}
      </h1>
      <div onClick={() => {
            if(window.confirm("Etes vous sure de vouloir supprimer cette publication ?")) {
                handleDelete()
            }
        }}>
            <DeleteOutlined />
        </div>
      </div>
      <div className="profil__container">
        <div className="profil__container__item profil__container--picture">
          <h2> Photo de profil </h2>
          <img src={postPicture} alt="profil"></img>
          {userData.id === userId && 
          <form action="" onSubmit={handleImage} className="upload-picture">
            <label htmlFor="file" className="button"> Changer d'image</label>
            <input
              type="file"
              id="file"
              name="image"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => handlePicture(e)}
            />
            <input type="submit" className="button" value="envoyer" />
          </form>
          }
        </div>
        <div className="profil__container__item profil__container--picture">
          <label htmlFor="description"> description </label>
          <textarea
            type="text"
            name="description"
            readOnly={!(userData.id === userId)}
            defaultValue={userData.description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {userData.id === userId &&
          <button onClick={handleUpdate} className="button"> Modifier description </button>
          }
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
