
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const fs = require('fs')
const Inbox = require('../models/Inbox');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.inboxlist = (req, res) => {
    let selectQuery = `SELECT * FROM tbl_inbox WHERE deleted_at is NULL;`;
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

    console.log("inboxregister", req.body);

    let { title, content, segment_id } = req.body;
    console.log("registernofication", req.body)
    title = title.replace(`'`,`\\'`);
    content = content.replace(`'`,`\\'`);
    const newInbox = {
        title: title, content: content, segment_id
    };
 
    let mInsertQuery = ''; 
    Inbox.inboxList(segment_id).then(ulist => {
        if(ulist){
            ulist.forEach(element => {
                mInsertQuery += mysql.getInsertQuery('tbl_message', {user_id: element.id, user_email: element.email,segment_id: element.segment_id, title:title, content: content})
            });
            console.log("mInsertQuery:", mInsertQuery)
            newInbox.created_at = getCurrentFormatedDate();
            let selectQuery = `SELECT * FROM tbl_inbox WHERE deleted_at is NULL;`;
            let insertQueyry =  mysql.getInsertQuery('tbl_inbox', newInbox);
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
    let {id, from_email} = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_inbox', {id: id}, {deleted_at: delete_at});
    let selectQuery = `SELECT * FROM tbl_inbox WHERE deleted_at is NULL;`;

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


exports.makeread = (req, res) => {
    console.log("makeread", req.body);
    let {id, from_email} = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_inbox', {id: id}, {is_read: 1});
    let selectQuery = `SELECT * FROM tbl_inbox WHERE deleted_at is NULL;`;
    
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
