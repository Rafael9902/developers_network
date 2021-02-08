//var path = require('path');
//var fs = require('fs');
var mongoose_paginate = require('mongoose-pagination');

var User = require('../models/User');
var Follow = require('../models/Follow');

function prueba(req, res) {
    return res.status(200).send({ message: 'Bien men' });
}

function saveFollow(req, res) {
    var follow = new Follow();
    var params = req.body;

    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ statusCode: 500, message: 'Error' });
        if (!followStored) return res.status(404).send({ statusCode: 4040, message: 'Follow Not Save' });

        return res.status(200).send({
            statusCode: 200,
            message: 'Follow Created',
            follow: followStored
        })
    });
}

function deleteFollow(req, res) {
    var user_id = req.user.sub;
    var follow_id = req.params.id;

    Follow.find({ user: user_id, followed: follow_id }).remove((err, followDelete) => {
        c

        return res.status(200).send({
            statusCode: 200,
            message: 'Deleted Successfully'
        });
    });
}

function getFollowingUsers(req, res) {
    var user_id = req.user.sub;
    var page = 1;

    if (req.params.id && req.params.page) user_id = req.params.id;
    req.params.page ? page = req.params.page : req.params.id;

    var items_page = 4;

    Follow.find({ user: user_id }).populate({ path: 'followed' }).paginate(page, items_page, (err, follows, total) => {
        if (err) return res.status(500).send({ statusCode: 500, message: 'Error' });
        if (!follows) return res.status(404).send({ statusCode: 404, message: 'Not Users Followed' })

        return res.status(200).send({
            statusCode: 200,
            total: total,
            pages: Math.ceil(total / items_page),
            follows: follows
        })
    });
}

function getFollowedUsers(req, res) {
    var user_id = req.user.sub;
    var page = 1;

    if (req.params.id && req.params.page) user_id = req.params.id;
    req.params.page ? page = req.params.page : req.params.id;

    var items_page = 4;

    Follow.find({ followed: user_id }).populate('user').paginate(page, items_page, (err, follows, total) => {
        if (err) return res.status(500).send({ statusCode: 500, message: 'Error' });
        if (!follows) return res.status(404).send({ statusCode: 404, message: "You Don't Have Followers" });

        return res.status(200).send({
            statusCode: 200,
            total: total,
            pages: Math.ceil(total / items_page),
            follows: follows
        })
    });
}

function getMyFollows(req, res) {

}

function getFollowsBack(req, res) {

}




module.exports = {
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}