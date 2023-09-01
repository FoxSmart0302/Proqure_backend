
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const Transporter = require('../models/Transporter');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11,}$/; // Matches 11 or more digits
    return regex.test(phoneNumber);
}

const validate = (transporter, newTransporter = true) => {
    const { firstname, lastname, company, phone, email, password } = transporter;
    const errors = {};
    if (isEmpty(firstname)) errors.firstname = 'First name field is required';
    if (isEmpty(lastname)) errors.lastname = 'Last name field is required';
    if (isEmpty(company)) errors.company = 'Company field is required';
    if (isEmpty(phone)) errors.phone = 'Phone field is required';
    if (!validatePhoneNumber(phone)) errors.phone = 'Phone number with no less than 11digits';
    if (isEmpty(email)) errors.email = 'Email field is required';
    if (!validator.isEmail(email)) errors.email = "Email is invalid";
    if (newTransporter && isEmpty(password)) errors.password = 'Password field is required';
    return {
        isValid: !Object.keys(errors).length,
        errors
    }
}


exports.register = (req, res) => {
    console.log("register", req.body);
    const { isValid, errors } = validate(req.body);
    if (!isValid) {
        return res.json({
            status: 1,
            errors
        });
    }

    let { firstname, lastname, company, phone, email, password } = req.body;

    Transporter.findByEmail(email).then(transporter => {
        if (transporter)
            return res.json({
                status: 1,
                errors: { email: 'Email already exists' }
            });

        let fileName = null;
        let uploadPath = null;

        const addTransporter = () => {
            const newTransporter = {
                firstname, lastname, company, phone, email, password, avatar:"/upload/users/trans/7.png"
            };
            if (uploadPath) {
                newTransporter.avatar = filePath;
            }

            bcrypt.hash(newTransporter.password, 0).then(hash => {
                newTransporter.password = hash;
                newTransporter.created_at = getCurrentFormatedDate();
                newTransporter.updated_at = newTransporter.created_at;
                newTransporter.login_status = 0;
                Transporter.register(newTransporter).then(transporter => {
                    // ioHandler.sendNewTransporterEvent(transporter);
                    return res.json({
                        status: 0,
                        transporter
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
        if (req.files && Object.keys(req.files).length) {
            const file = req.files.avatar;
            let timestamp = new Date().getTime();
            fileName = file.name;
            uploadPath = path.join(__dirname, `..\\client\\uploads\\avatar\\${timestamp}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath);
            }
            uploadPath = path.join(__dirname, `..\\client\\uploads\\avatar\\${timestamp}\\${file.name}`);
            filePath = `\\\\uploads\\\\avatar\\\\${timestamp}\\\\${file.name}`;
            file.mv(uploadPath, function (err) {
                if (err) {
                    return res.json({
                        status: 1,
                        message: 'Please try again later'
                    })
                }
                addTransporter();
            })
        } else {
            addTransporter();
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
    let {id, company, firstname, lastname, phone, email } = req.body;
    let updateQuery = mysql.updateQuery('tbl_transporter', {id: id}, {company: company, firstname: firstname, lastname: lastname, phone: phone, email: email});
    let selectQuery = mysql.selectQuery('tbl_transporter', {deleted_at: null});
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

exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_transporter', {id: id}, {deleted_at: delete_at});
    let selectQuery = mysql.selectQuery('tbl_transporter', {deleted_at: null});
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

exports.current = (req, res) => {
    res.json({
        status: 0,
        transporter: req.transporter,
    })
}

exports.list = (req, res) => {
    let selectQuery = mysql.selectQuery("tbl_transporter", { deleted_at: null });
    mysql.query(selectQuery).then((transporters) => {
        res.json({
            status: 0,
            transporters: transporters,
        })
    })
}

