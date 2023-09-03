
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const User = require('../models/User');
const fs = require('fs')
const Category = require('../models/Category');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.categorylist = (req, res) => {
    console.log('categorylist');
    mysql.query('SELECT * FROM `tbl_categories`;').then(list => {
        return res.json({
            status: 0,
            list,
        })
    }).catch(err => {
        console.log(err);
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    })
}

exports.item = (req, res) => {
    mysql.query(`SELECT * from tbl_products WHERE id='${req.body.id}';`).then(result => {
        return res.json({
            status: 0,
            result,
        })
    }).catch(err => {
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    })
}

exports.related = (req, res) => {
    mysql.query(`SELECT * from tbl_products WHERE cat_id='${req.body.cat_id}'`).then(list => {
        return res.json({
            status: 0,
            list,
        })
    }).catch(err => {
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    })
}

exports.itemlist = (req, res) => {
    console.log("==============itemList:", req.body);
    let data = req.data;
    let { user_id, user_email } = req.body;
    let sql = `SELECT tbl_products.* from tbl_categories JOIN  tbl_products ON tbl_categories.id = tbl_products.cat_id ORDER BY tbl_categories.id;`;
    sql += `SELECT * from tbl_categories ORDER BY id ASC;`;
    sql += `SELECT w.id, w.user_id, w.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details,p.created_at FROM tbl_wish as w INNER JOIN tbl_products as p ON w.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE w.user_id='${user_id}';`;
    sql += `SELECT ct.id, ct.user_id, ct.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details, ct.quantity, p.created_at FROM tbl_cart as ct INNER JOIN tbl_products as p ON ct.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE ct.user_id='${user_id}';`;
    console.log("=======sql", sql);

    mysql.query(sql).then(([list, clist, wishlist, cartlist]) => {
        const sortedArray = list.reduce((acc, curr) => {
            const foundIndex = acc.findIndex(item => item.cat_id === curr.cat_id);
            if (foundIndex !== -1) {
                acc[foundIndex].items.push(curr);
            } else {
                acc.push({ cat_id: curr.cat_id, cat_name: curr.cat_name, items: [curr] });
            }
            return acc;
        }, []);
        return res.json({
            status: 0,
            list,
            clist,
            wishlist,
            cartlist,
            sortedArray,
        })
    }).catch(err => {
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    });
}

exports.register = (req, res) => {

    console.log("categoryregister", req.body);

    let { name, description } = req.body;
    let fileName = null;
    let uploadPath = null;
    const addProduct = () => {
        const newCategory = {
            name, description
        };
        if (uploadPath) {
            newCategory.image = filePath;
        }

        newCategory.created_at = getCurrentFormatedDate();
        newCategory.updated_at = newCategory.created_at;
        Category.register(newCategory).then(category => {
            // ioHandler.sendnewCategoryEvent(category);
            console.log("category", category)
            return res.json({
                status: 0,
                category,
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
        uploadPath = path.join(__dirname, `..\\public\\upload\\category\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\category\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\category\\\\${timestamp}\\\\${file.name}`;
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
    const editCategory = () => {
        let { id, name, description } = req.body;
        let selectQuery;
        selectQuery = mysql.selectQuery('tbl_categories', {deleted_at: null});
        
        let  updateQuery = mysql.updateQuery('tbl_categories', {id: id}, {name: name, description: description });
        if(uploadPath) {
            updateQuery = mysql.updateQuery('tbl_categories', {id: id}, {name: name, description: description, image: filePath });
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
        uploadPath = path.join(__dirname, `..\\public\\upload\\category\\${timestamp}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        uploadPath = path.join(__dirname, `..\\public\\upload\\category\\${timestamp}\\${file.name}`);
        filePath = `\\\\upload\\\\category\\\\${timestamp}\\\\${file.name}`;
        console.log("uploadPath", filePath)
        file.mv(uploadPath, function (err) {
            if (err) {
                return res.json({
                    status: 1,
                    message: 'Please try again later'
                })
            }
            editCategory();
        })
    } else {
        editCategory();
    }
}
exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_products', {id: id}, {deleted_at: delete_at});
    let selectQuery = mysql.selectQuery('tbl_products', {deleted_at: null});
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
