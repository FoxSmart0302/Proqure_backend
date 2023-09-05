
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
    let selectQuery = `SELECT n.*, s.name as segment_name from tbl_notification as n LEFT JOIN tbl_segment as s ON n.segment_id=s.id WHERE n.deleted_at is NULL;`;
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

    let { title, content, segment_id } = req.body;
    console.log("registernofication", req.body)
    title = title.replace(`'`,`\\'`);
    content = content.replace(`'`,`\\'`);
    const newNotification = {
        title: title, content: content, segment_id
    };
 
    let mInsertQuery = ''; 
    Notification.notificationList(segment_id).then(ulist => {
        if(ulist){
            ulist.forEach(element => {
                mInsertQuery += mysql.getInsertQuery('tbl_message', {user_id: element.id, user_email: element.email,segment_id: element.segment_id, title:title, content: content})
            });
            console.log("mInsertQuery:", mInsertQuery)
            newNotification.created_at = getCurrentFormatedDate();
            let selectQuery = `SELECT n.*, s.name as segment_name from tbl_notification as n LEFT JOIN tbl_segment as s ON n.segment_id=s.id WHERE n.deleted_at is NULL;`;
            let insertQueyry =  mysql.getInsertQuery('tbl_notification', newNotification);
            mysql.query(`${insertQueyry}${selectQuery}${mInsertQuery}`).then(result => {
                return res.json({
                    status: 0,
                    result,
                    message:"Successfully Sended"
                })
            }).catch(err => {
                console.log(err);
                return res.json({
                    status: 1,
                    message: "Please try again later"
                })
            })
        }
    }).catch(err => {
        return res.json({
            status: 1,
            message:"Please try agian later",
        })
    }); 

}

exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_notification', {id: id}, {deleted_at: delete_at});
    let selectQuery = `SELECT n.*, s.name as segment_name from tbl_notification as n LEFT JOIN tbl_segment as s ON n.segment_id=s.id WHERE n.deleted_at is NULL;`;
   
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



exports.messagelist = (req, res) => {
    let {user_id, user_email} = req.body;
    let selectQuery = `SELECT * from tbl_message WHERE is_read='0' AND user_id='${user_id}';`;
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

exports.messagedelete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, user_id } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_message', {id: id}, {is_read: 1});
    let selectQuery = `SELECT * from tbl_message WHERE is_read='0' AND user_id='${user_id}';`;
   
    console.log(updateQuery)
    mysql.query(`${updateQuery}${selectQuery}`)
        .then(result => {
            console.log(result)
            return res.json({
                status: 0,
                message: 'Successfully viewed',
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
