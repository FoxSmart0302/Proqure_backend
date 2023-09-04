
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const fs = require('fs')
const Product = require('../models/Product');
const { isEmpty, getCurrentFormatedDate, getFormatedDate } = require('../utils');

const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11,}$/; // Matches 11 or more digits
    return regex.test(phoneNumber);
}

const validate = (product, newProduct = true) => {
    const { firstname, lastname, company, phone, email, password } = product;
    const errors = {};
    if (isEmpty(firstname)) errors.firstname = 'First name field is required';
    if (isEmpty(lastname)) errors.lastname = 'Last name field is required';
    if (isEmpty(company)) errors.company = 'Company field is required';
    if (isEmpty(phone)) errors.phone = 'Phone field is required';
    if (!validatePhoneNumber(phone)) errors.phone = 'Phone number with no less than 11digits';
    if (isEmpty(email)) errors.email = 'Email field is required';
    if (!validator.isEmail(email)) errors.email = "Email is invalid";
    if (newProduct && isEmpty(password)) errors.password = 'Password field is required';
    return {
        isValid: !Object.keys(errors).length,
        errors
    }
}


exports.register = (req, res) => {

    console.log("productregister", req.body);

    let { category_id: cat_id, name, price, size, quality, description, details, receive_date, expiry_date } = req.body;
    receive_date= getFormatedDate(receive_date);
    expiry_date = getFormatedDate(expiry_date);
    let fileName = null;
    let uploadPath = null;
    const addProduct = () => {
        const newProduct = {
            cat_id, name, price, size, quality, description:description.replace(`'`, `\\'`), details: details.replace(`'`, `\\'`), receive_date, expiry_date
        };
        if (uploadPath) {
            newProduct.image = filePath;
        }

        newProduct.created_at = getCurrentFormatedDate();
        newProduct.updated_at = newProduct.created_at;
        let insertQuery = mysql.getInsertQuery('tbl_products', newProduct);
        let selectQuery = `SELECT p.*, c.name as cat_name FROM tbl_categories as c INNER JOIN tbl_products as p ON c.id=p.cat_id WHERE c.deleted_at IS NULL AND p.deleted_at IS NULL;`;
        mysql.query(`${insertQuery}${selectQuery}`).then(result => {
            console.log("product", result)
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
    }
    console.log("registerfile", req.files);
    if (req.files && Object.keys(req.files).length) {
        const file = req.files.image;
        
        let timestamp = new Date().getTime();
        fileName = file.name;
        uploadPath = path.join(__dirname, `..\\public\\upload\\product\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\product\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\product\\\\${timestamp}\\\\${file.name}`;
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
    const editProduct = () => {
        let { id,category_id: cat_id, name, price, size, quality, description, details, receive_date, expiry_date } = req.body;
        receive_date= getFormatedDate(receive_date);
        expiry_date = getFormatedDate(expiry_date);

        let selectQuery = `SELECT p.*, c.name as cat_name FROM tbl_categories as c INNER JOIN tbl_products as p ON c.id=p.cat_id WHERE c.deleted_at IS NULL AND p.deleted_at IS NULL;`;
        let  updateQuery = mysql.updateQuery('tbl_products', {id: id}, {cat_id: cat_id, name: name, price: price, size: size, quality: quality, description: description.replace(`'`, `\\'`), details: details.replace(`'`, `\\'`), receive_date: receive_date, expiry_date:expiry_date });
        if(uploadPath) {
            updateQuery = mysql.updateQuery('tbl_products', {id: id}, {cat_id: cat_id, name: name, price: price, size: size, quality: quality, description: description.replace(`'`, `\\'`), details: details.replace(`'`, `\\'`), receive_date: receive_date, expiry_date:expiry_date, image: filePath});
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
        uploadPath = path.join(__dirname, `..\\public\\upload\\product\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\product\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\product\\\\${timestamp}\\\\${file.name}`;
        console.log("uploadPath", filePath)
        file.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    status: 1,
                    message: 'Please try again later'
                })
            }
            editProduct();
        })
    } else {
        editProduct();
    }
}
exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_products', {id: id}, {deleted_at: delete_at});
    let selectQuery = `SELECT p.*, c.name as cat_name FROM tbl_categories as c INNER JOIN tbl_products as p ON c.id=p.cat_id WHERE c.deleted_at IS NULL AND p.deleted_at IS NULL;`;
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

exports.list = (req, res) => {
    // let selectQuery = mysql.selectQuery("tbl_products", { deleted_at: null });
    let selectQuery = `SELECT p.*, c.name as cat_name FROM tbl_categories as c INNER JOIN tbl_products as p ON c.id=p.cat_id WHERE c.deleted_at IS NULL AND p.deleted_at IS NULL;`;
    console.log("selectQuery", selectQuery)
    mysql.query(selectQuery).then((products) => {
        res.json({
            status: 0,
            products: products,
        })
    })
    .catch(error => {
        res.json({
            status: 1,
            error
        })
    })
}

