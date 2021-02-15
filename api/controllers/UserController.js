var bcrypt = require('bcrypt-nodejs');
var User = require('../models/User');
var Follow = require('../models/Follow');
var jwt = require('../services/jwt');
var mongoose_pagination = require('mongoose-pagination');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

mongoose.set('useFindAndModify', false);

function home(req, res) {
    res.status(200).send({
        message: 'Home'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'Pruebas'
    });
}

//Save Users
function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    if (params.name && params.lastname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.lastname = params.lastname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        //Find duplicate email
        User.find({ $or: [{ email: user.email.toLowerCase() }, { nick: user.nick.toLowerCase() }] }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error at save user' });
            if (users && users.length >= 1) {
                return res.status(200).send({ message: 'User already exists' });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStore) => {
                        if (err) return res.status(500).send({ message: 'Error at save user' });
                        userStore ? res.status(200).send({ user: userStore }) : res.status(404).send({ message: 'Error at register' });
                    });
                });
            }
        });
    } else {
        res.status(500).send({
            message: 'Incomplete Data'
        });
    }
}

//Login User
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;
    console.log(email);

    User.findOne({ email: email }, (err, user) => {
        console.log(user)
        if (err) return res.status(500).send({ message: 'User Not Found' });
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        //generate and return token
                        return res.status(200).send({ token: jwt.createToken(user) });
                    } else {
                        //return user data
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'Incorrect Password' });
                }
            });
        } else {
            return res.status(404).send({ message: 'User Not Found' });
        }
    });
}

//Get User Data
function getUser(req, res) {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error' });
        if (!user) return res.status(404).send({ message: 'User Not Found' });

        followUser(req.user.sub, userId).then((value) =>{
          user.password = undefined;

          return res.status(200).send({
             user,
             following: value.following,
             followed: value.followed });
        });
    });
}

async function followUser(identity_user_id, user_id){

  var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {
         return follow;
     }).catch((err) => {
         return handleError(err);
     });

     var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {
         console.log(follow);
         return follow;
     }).catch((err) => {
         return handleError(err);
     });

    return {
      following: following,
      followed: followed
    }

}

//Return a list of paginated users
function getUsers(req, res) {
    var identity_user_id = req.user.sub;
    var page = 1;
    var itemsPerPage = 5;

    if (req.params.page) page = req.params.page;


    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error' });
        if (!users) return res.status(404).send({ message: 'Not Users Available' });

        followUsersId(identity_user_id).then((value) =>{
            return res.status(200).send({
              users,
              users_following: value.following,
              users_follow_me: value.followed,
              total,
              pages: Math.ceil(total / itemsPerPage)
             });
        });
    });
}

async function followUsersId(user_id){
    var following = await Follow.find({"user": user_id}).select({'_id': 0, '__v': 0, 'user': 0}).exec((err, follows) =>{
        return follows;
    });

    var followed = await Follow.find({"followed": user_id}).select({'_id': 0, '__v': 0, 'followed': 0}).exec((err, follows) =>{
      return follows;
    });

    var following_clean = [];
    var followed_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });


    followed.forEach((follow) => {
        followed_clean.push(follow.user);
    });


    return {
        following: following_clean,
        followed: followed_clean
    }

}

//Edit User data
function updateUser(req, res) {
    var user_id = req.params.id;
    var update = req.body;

    //Delete password propertie
    delete update.password;

    if (user_id != req.user.sub) return res.status(500).send({ message: 'Permission Denied' });


    User.find({ $or: [{ email: update.email.toLowerCase() }, { nick: update.nick.toLowerCase()}]}).exec((err, users) => {

      var user_isset = false;
       users.forEach((user) => {
         if(user && user._id != user_id) user_isset = true;
       });

       if(user_isset) return res.status(404).send({message: 'Data in use' })

        //if(update._id != user_id) return res.status(500).send({message: 'Duplicated Data'});

        User.findByIdAndUpdate(user_id, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'Error' });
            if (!userUpdated) return res.status(404).send({ message: 'User Not Updated' });
            return res.status(200).send({ user: userUpdated });
        });
    })


}

//Upload Images
function uploadImage(req, res) {
    var user_id = req.params.id;

    if (user_id != req.user.sub) return removeFiles(file_path, 'Permission Denied')

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext = file_name.split('\.');
        var file_ext = ext[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            User.findByIdAndUpdate(user_id, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error' });
                if (!userUpdated) return res.status(404).send({ message: 'User Not Updated' });
                return res.status(200).send({ user: userUpdated });
            });

        } else {
            return removeFiles(res, file_path, 'Extention not valid');
        }
    } else {
        return res.status(200).send({ message: 'File Not upload' });
    }
}

function removeFiles(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImageFile(req, res) {
    var image_file = req.params.image_file;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        return exists ?
            res.sendFile(path.resolve(path_file)) :
            res.status(200).send({ message: 'Image Not Found' });
    });

}

function getCounters(req, res){

    var user_id = req.params.id ? req.params.id : req.user.sub;

    getCountFollows(user_id).then((value) => {
      console.log('value', value);
        return res.status(200).send(value);
    }).catch((err) => {
        return handleError(err);
    });
}

async function getCountFollows(user_id){

    var following = await Follow.countDocuments({"user": user_id}).exec().then((following) => {
        return following;
    }).catch((err) => {
        return handleError(err);
    });

    const followed = await Follow.countDocuments({"followed": user_id}).exec().then((followed) => {
        return followed;
    }).catch((err) => {
        return handleError(err);
    });


    return {
        following: following,
        followed: followed
    }
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}
