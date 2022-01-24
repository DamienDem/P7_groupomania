const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/User');
const PostModel = require('../models/Post');
const LikeModel = require ('../models/Like');

const sequelize = new Sequelize('groupamia', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })
   
  sequelize.authenticate()
  .then(_=>console.log('La connexion à la BDD a bien été établie.'))
  .catch(error => console.error(`Impossible de se connecter à la BDD ${error}`));

 initDb = sequelize.sync({force:true})
.then(_=> console.log('la BDD a bien été synchronisée'));

const User = UserModel(sequelize, DataTypes);
const Post = PostModel(sequelize, DataTypes);
const Like = LikeModel(sequelize, DataTypes);

module.exports = { 
    initDb, User, Post, Like
}