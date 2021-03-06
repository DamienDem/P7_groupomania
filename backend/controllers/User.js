const express = require("express");
const { User, Like, Comment, Post } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.signup = (req, res) => {
  const password = req.body.password;
  const regexPassword = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  );
  const testPassword = regexPassword.test(password);

  const email = req.body.email;
  const regexEmail = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  );
  const testEmail = regexEmail.test(email);

  if (testEmail && testPassword) {
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (!user) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            User.create({
              name: req.body.name,
              firstName: req.body.firstName,
              email: req.body.email,
              password: hash,
              picture: `http://localhost:3000/images/default_profil_picture.jpg`,
              isAdmin: false,
            });
          })
          .then((_) => {
            const message = `L'utilisateur ${req.body.name} ${req.body.firstName} a bien été créé .`;
            res.json({ message });
          })
          .catch((err) => {
            const message = `impossible de créer l'utilisateur:"${req.body.name} ${req.body.firstName}" `;
            res.status(400).json({ message, err });
          });
      } else {
        const message = `L'utilisateur avec l'email:"${req.body.email}" existe déja. `;
        return res.status(400).json({ message });
      }
    });
  } else {
    const message = "Mot de passe ou email incorrect";
    return res.status(400).json({ message });
  }
};

exports.login = (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    if (!user) {
      const message = `L'utilisateur demandé n'existe pas.`;
      return res.status(404).json({ message });
    }

    bcrypt
      .compare(req.body.password, user.password)
      .then((valid) => {
        if (!valid) {
          const message = "Mot de passe est incorrect ! ";
          return res.status(401).json({ message });
        }
        const token = jwt.sign(
          { id: user.id, isAdmin: user.isAdmin },
          `${process.env.TOKEN_KEY}`,
          {
            expiresIn: "86400000",
          }
        );
        const userData = {
          email: user.email,
          firstName: user.firstName,
          name: user.name,
          email: user.email,
          description: user.description,
          isAdmin: user.isAdmin,
        };
        const message = `L'utilisateur a été connecté avec succès`;
        res.cookie("jwt", token, { httpOnly: true, maxAge: "86400000" });
        res.json({ message, userData, token });
      })
      .catch((err) => {
        const message = `Impossible de se connecter, veuillez réessayer ultérieurement. `;
        res.status(500).json({ message, err });
      });
  });
};

exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ["id", "name", "firstName", "description", "picture"],
  })
    .then((users) => {
      const message = `la liste des utilisateurs a bien été récupérée . `;
      res.json({ message, data: users });
    })
    .catch((err) => {
      const message = `La liste des utilisateurs n'a pas pu être récupérée. Réessayer dans quelques instants.`;
      res.status(500).json({ message, data: err });
    });
};

exports.getOneUser = (req, res) => {
  User.findOne({
    where: { id: req.params.id },
  }).then((user) => {
    if (user === null) {
      const message = `L'utilisateur n'existe pas `;
      return res.status(400).json({ message });
    }
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      name: user.name,
      email: user.email,
      picture: user.picture,
      description: user.description,
      isAdmin: user.isAdmin,
    };
    const message = `L'utilisateur ${user.name} ${user.firstName} a bien été trouvé `;
    res.json({ message, data: userData });
  });
};

exports.updateProfil = (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
  const userId = decodedToken.id;

  const userObject = req.file
    ? {
        ...req.body,
        picture: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  User.findByPk(userId).then((user) => {
    if (!user) {
      const message = "L'utilisateur demandé n'existe pas .";
      return res.status(404).json({ message });
    }
    if(user.id == userId){
      if (
        user.picture === `http://localhost:3000/images/default_profil_picture.jpg`
      ) {
        user
          .update(userObject, {
            where: { id: userId },
          })
          .catch((err) => {
            const message = `Impossible de modifier le profil, veuillez réessayer ultérieurement. `;
            res.status(500).json({ message, err });
          });
      } else {
        const filename = user.picture.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          user
            .update(userObject, {
              where: { id: userId },
            })
            .catch((err) => {
              const message = `Impossible de modifier le profil, veuillez réessayer ultérieurement. `;
              res.status(500).json({ message, err });
            });
        });
      }
      const message = `L'utilisateur ${user.name} ${user.firstName} a bien été modifié`;
      res.json({ message, data: userObject });
    }
    })
};

exports.deleteUser = (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
  const userId = decodedToken.id;
  const adminId = decodedToken.isAdmin;

    User.findByPk(req.params.id).then((user) => {
      if (!user) {
        const message = "L'utilisateur demandé n'existe pas .";
        return res.status(404).json({ message });
      }
      if(user.id === userId || adminId) {
        if (
          user.picture ===
          `http://localhost:3000/images/default_profil_picture.jpg`
        ) {
          User.destroy({ where: { id: user.id } })
            .then((_) => {
              const message = `L'utilisateur ${user.name} ${user.firstName} a bien été supprimé .`;
              res.json({ message, data: user });
            })
            .catch((err) => {
              const message = `Impossible de supprimer le profil, veuillez réessayer ultérieurement. `;
              res.status(500).json({ message, err });
            });
        } else {
          const filename = user.picture.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            User.destroy({ where: { id: user.id } })
              .then((_) => {
                const message = `L'utilisateur ${user.name} ${user.firstName} a bien été supprimé .`;
                res.json({ message, data: user });
              })
              .catch((err) => {
                const message = `Impossible de supprimer le profil, veuillez réessayer ultérieurement. `;
                res.status(500).json({ message, err });
              });
          });
        }

  } else {
    const message = `Vous n'êtes pas autorisés à faire cette action`;
    res.status(401).json({ message });
  }
})
};

exports.authentification = (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, `${process.env.TOKEN_KEY}`);
  const userId = decodedToken.id;
  const userAdmin = decodedToken.isAdmin;

  if (token && token != null) {
    res.status(200).json({ id: userId, isAdmin: userAdmin });
  } else {
    res.status(400).json("Token innexistant !");
  }
};

exports.logout = (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } else {
    const message = `Vous n'êtes pas connecté`;
    return res.status(401).json({ message });
  }
};
