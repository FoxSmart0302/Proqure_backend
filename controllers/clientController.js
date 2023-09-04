
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const fs = require('fs');
const User = require('../models/User');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11,}$/; // Matches 11 or more digits
    return regex.test(phoneNumber);
}

const validate = (user, newUser = true) => {
    const { firstname, lastname, company, phone, email, password } = user;
    const errors = {};
    if (isEmpty(firstname)) errors.firstname = 'First name field is required';
    if (isEmpty(lastname)) errors.lastname = 'Last name field is required';
    if (isEmpty(company)) errors.company = 'Company field is required';
    if (isEmpty(phone)) errors.phone = 'Phone field is required';
    if (!validatePhoneNumber(phone)) errors.phone = 'Phone number with no less than 11digits';
    if (isEmpty(email)) errors.email = 'Email field is required';
    if (!validator.isEmail(email)) errors.email = "Email is invalid";
    if (newUser && isEmpty(password)) errors.password = 'Password field is required';
    return {
        isValid: !Object.keys(errors).length,
        errors
    }
}


exports.register = (req, res) => {
    const { isValid, errors } = validate(req.body);
    if (!isValid) {
        return res.json({
            status: 1,
            errors
        });
    }
    console.log("register", req.body);
    // return
    
    let { firstname, lastname, company, phone, email, password, role, segment_id } = req.body;

    User.findByEmail(email).then(user => {
        if (user)
            return res.json({
                status: 1,
                errors: { email: 'Email already exists' }
            });

        let fileName = null;
        let uploadPath = null;

        const addUser = () => {
            let newUser = {
                firstname, lastname, company, phone, email, password, role
            };
            if(segment_id){
                newUser.segment_id = segment_id;
            }
            if (uploadPath) {
                newUser.avatar = filePath;
            }

            bcrypt.hash(newUser.password, 0).then(hash => {
                newUser.password = hash;
                newUser.created_at = getCurrentFormatedDate();
                newUser.updated_at = newUser.created_at;
                newUser.login_status = 0;
                let selectQuery = 'SELECT u.*, s.name as segment_name from tbl_users as u LEFT JOIN tbl_segment as s ON u.segment_id=s.id WHERE u.role=4 and u.deleted_at IS NULL and s.deleted_at is NULL;';
                let insertQuery = mysql.getInsertQuery('tbl_users', newUser);
               
                mysql.query(`${insertQuery}${selectQuery}`).then(result => {
                    return res.json({
                        status: 0,
                        result,
                        message:"Successfully registered"
                    })
                }).catch(err => {
                    console.log(err);
                    return res.json({
                        status: 1,
                        message: "Please try again later"
                    })
                });
            }).catch(err => {
                console.log(err);
                res.json({
                    status: 1,
                    message: "Please try again later."
                })
            })
        }
        console.log("registerfile", req.files);
        if (req.files && Object.keys(req.files).length) {
            const file = req.files.image;
            
            let timestamp = new Date().getTime();
            fileName = file.name;
            uploadPath = path.join(__dirname, `..\\public\\upload\\avatar\\${timestamp}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            uploadPath = path.join(__dirname, `..\\public\\upload\\avatar\\${timestamp}\\${file.name}`);
            filePath = `\\\\upload\\\\avatar\\\\${timestamp}\\\\${file.name}`;
            console.log("uploadPath", filePath)
            file.mv(uploadPath, function (err) {
                if (err) {
                    return res.json({
                        status: 1,
                        message: 'Please try again later'
                    })
                }
                addUser();
            })
        } else {
            addUser();
        }
    }).catch(err => {
        console.log(err);
        return res.json({
            status: 1,
            message: 'Please try again later'
        })
    })
}

exports.edit = (req, res) => {
    console.log("editreqbody", req.body);
    let fileName = null;
    let uploadPath = null;
    const editUser = () => {
        let {id, company, firstname, lastname, phone, email, role, segment_id } = req.body;
      
        let selectQuery = 'SELECT u.*, s.name as segment_name from tbl_users as u LEFT JOIN tbl_segment as s ON u.segment_id=s.id WHERE u.role=4 and u.deleted_at IS NULL and s.deleted_at is NULL;'; 
        let updateData = {company: company, firstname: firstname, lastname: lastname, phone: phone, email: email};
        if(segment_id){
            updateData.segment_id = segment_id;
        }
        else{
            updateData.segment_id = ''
        }
        if(uploadPath) {
            updateData.avatar = filePath;
        }
        if(segment_id){
            updateData.segment_id = segment_id
        }
        let updateQuery = mysql.updateQuery('tbl_users', {id: id}, updateData);
        mysql.query(`${updateQuery}${selectQuery}`)
            .then(result => {
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
    console.log("editfiles:", req.files);
    if (req.files && Object.keys(req.files).length) {
        const file = req.files.image;
        
        let timestamp = new Date().getTime();
        fileName = file.name;
        uploadPath = path.join(__dirname, `..\\public\\upload\\avatar\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\avatar\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\avatar\\\\${timestamp}\\\\${file.name}`;
        console.log("uploadPath", filePath)
        file.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    status: 1,
                    message: 'Please try again later'
                })
            }
            editUser();
        })
    } else {
        editUser();
    }
}

exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email, role } = req.body;
    let deleted_at = getCurrentFormatedDate();
 
    let updateQuery = mysql.updateQuery('tbl_users', {id: id}, {deleted_at: deleted_at});
    let selectQuery = 'SELECT u.*, s.name as segment_name from tbl_users as u LEFT JOIN tbl_segment as s ON u.segment_id=s.id WHERE u.role=4 and u.deleted_at IS NULL and s.deleted_at is NULL;';
    console.log(updateQuery)
 
    mysql.query(`${updateQuery}${selectQuery}`)
        .then(result => {
            console.log(result)
            return res.json({
                status: 0,
                message: 'Successfully deleted',
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

exports.current = (req, res) => {
    res.json({
        status: 0,
        user: req.user,
    })
}

exports.clientlist = (req, res) => {
    let selectQuery = 'SELECT u.*, s.name as segment_name from tbl_users as u LEFT JOIN tbl_segment as s ON u.segment_id=s.id WHERE u.role=4 and u.deleted_at IS NULL and s.deleted_at is NULL;';
    mysql.query(selectQuery).then((users) => {
        res.json({
            status: 0,
            users: users,
        })
    })
    .catch(error => {
        res.json({
            status: 1,
            error
        })
    })
}

