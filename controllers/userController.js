
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

exports.login = (req, res) => {
    let { email, password } = req.body;

    let selectQuery = mysql.selectQuery("tbl_users", { email: email, deleted_at: null });

    mysql.query(selectQuery).then(([user]) => {
        if (!user) {
            return res.json({
                status: 1,
                message: "Incorrect auth information."
            })
        }
        bcrypt.compare(password, user.password).then(isMatched => {
            if (!isMatched) throw ('password not matched');
            const payload = { id: user.id };
            const token = `Bearer ${jwt.sign(payload, 'secret', { expiresIn: 36000 })}`;
            console.log(jwt.decode(token));
            return res.json({
                status: 0,
                token,
                user,
            })
        }).catch(err => {
            console.log(err);
            return res.json({
                status: 1,
                message: "Incorrect auth information."
            })
        })
    }).catch(err => {
        console.log(err);
        return res.json({
            status: 1,
            message: "Please try again later."
        })
    });
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
    
    let { firstname, lastname, company, phone, email, password, role } = req.body;

    User.findByEmail(email).then(user => {
        if (user)
            return res.json({
                status: 1,
                errors: { email: 'Email already exists' }
            });

        let fileName = null;
        let uploadPath = null;

        const addUser = () => {
            const newUser = {
                firstname, lastname, company, phone, email, password, role
            };
            if (uploadPath) {
                newUser.avatar = filePath;
            }

            bcrypt.hash(newUser.password, 0).then(hash => {
                newUser.password = hash;
                newUser.created_at = getCurrentFormatedDate();
                newUser.updated_at = newUser.created_at;
                newUser.login_status = 0;
                User.register(newUser).then(user => {
                    // ioHandler.sendNewUserEvent(user);
                    return res.json({
                        status: 0,
                        user,
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
        let {id, company, firstname, lastname, phone, email, role } = req.body;
        let selectQuery;
       
        if ( role === 'all') {
            selectQuery = mysql.selectQuery('tbl_users', {deleted_at: null});
        }
        else{
            selectQuery = mysql.selectQuery('tbl_users', {deleted_at: null, role: role});
        }
       
        let updateQuery = mysql.updateQuery('tbl_users', {id: id}, {company: company, firstname: firstname, lastname: lastname, phone: phone, email: email});
        if(uploadPath) {
            updateQuery = mysql.updateQuery('tbl_users', {id: id}, {company: company, firstname: firstname, lastname: lastname, phone: phone, email: email, avatar: filePath});
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
    let delete_at = getCurrentFormatedDate();
    let selectQuery;
    let updateQuery = mysql.updateQuery('tbl_users', {id: id}, {deleted_at: delete_at});
    if( role == 'all' ) {
        selectQuery = mysql.selectQuery('tbl_users', {deleted_at: null});
    }else{
        selectQuery = mysql.selectQuery('tbl_users', {deleted_at: null, role: role});
    }
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

exports.userlist = (req, res) => {
    let { role } = req.body;
    let usersQuery;
    if(role == "all"){
        usersQuery = mysql.selectQuery("tbl_users", { deleted_at: null });
    }
    else{
        usersQuery = mysql.selectQuery("tbl_users", { deleted_at: null, role: role });
    }
    console.log(role)
    mysql.query(usersQuery).then((users) => {
        res.json({
            status: 0,
            users: users,
        })
    })
}

