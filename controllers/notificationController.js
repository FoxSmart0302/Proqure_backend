
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const User = require('../models/User');
const fs = require('fs')
const Notification = require('../models/Notification');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.notificationlist = (req, res) => {
    let selectQuery = mysql.selectQuery("tbl_notification", { deleted_at: null });
    mysql.query(selectQuery).then((result) => {
        res.json({
            status: 0,
            list: result,
        })
    })
    .catch(error => {
        res.json({
            status: 1,
            error
        })
    })
}


exports.register = (req, res) => {

    console.log("notificationregister", req.body);

    let { name, description } = req.body;
    let fileName = null;
    let uploadPath = null;
    const addProduct = () => {
        const newNotification = {
            name, description
        };
        if (uploadPath) {
            newNotification.image = filePath;
        }

        newNotification.created_at = getCurrentFormatedDate();
        newNotification.updated_at = newNotification.created_at;
        Notification.register(newNotification).then(notification => {
            // ioHandler.sendnewNotificationEvent(notification);
            console.log("notification", notification)
            return res.json({
                status: 0,
                notification,
                message:"Successfully registered"
            })
        }).catch(err => {
            console.log(err);
            return res.json({
                status: 1,
                message: "Please try again later"
            })
        });
    }
    console.log("registerfile", req.files);
    if (req.files && Object.keys(req.files).length) {
        const file = req.files.image;
        
        let timestamp = new Date().getTime();
        fileName = file.name;
        uploadPath = path.join(__dirname, `..\\public\\upload\\notification\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\notification\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\notification\\\\${timestamp}\\\\${file.name}`;
        console.log("uploadPath", filePath)
        file.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    status: 1,
                    message: 'Please try again later'
                })
            }
            addProduct();
        })
    } else {
        addProduct();
    }
}

exports.edit = (req, res) => {
    console.log("editreqbody", req.body);
    let fileName = null;
    let uploadPath = null;
    const editNotification = () => {
        let { id, name, description } = req.body;
        let selectQuery;
        selectQuery = mysql.selectQuery('tbl_notification', {deleted_at: null});
        
        let  updateQuery = mysql.updateQuery('tbl_notification', {id: id}, {name: name, description: description.replace(`'`, `\\'`) });
        if(uploadPath) {
            updateQuery = mysql.updateQuery('tbl_notification', {id: id}, {name: name, description: description.replace(`'`, `\\'`), image: filePath });
        }

        mysql.query(`${updateQuery}${selectQuery}`)
            .then(result => {
                return res.json({
                    status: 0,
                    message: 'Successfully updated',
                    result
                })
            })
            .catch((err) => {
                console.log(err)
                return res.json({
                    status: 1,
                    message: "Please try again later"
                })
            })
    }
    console.log("editfiles:", req.files);
    if (req.files && Object.keys(req.files).length) {
        const file = req.files.image;
        
        let timestamp = new Date().getTime();
        fileName = file.name;
        uploadPath = path.join(__dirname, `..\\public\\upload\\notification\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\notification\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\notification\\\\${timestamp}\\\\${file.name}`;
        console.log("uploadPath", filePath)
        file.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    status: 1,
                    message: 'Please try again later'
                })
            }
            editNotification();
        })
    } else {
        editNotification();
    }
}
exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_notification', {id: id}, {deleted_at: delete_at});
    let selectQuery = mysql.selectQuery('tbl_notification', {deleted_at: null});
    console.log(updateQuery)
    mysql.query(`${updateQuery}${selectQuery}`)
        .then(result => {
            console.log(result)
            return res.json({
                status: 0,
                message: 'Successfully updated',
                result
            })
        })
        .catch((err) => {
            return res.json({
                status: 1,
                message: "Please try again later"
            })
        })
}
