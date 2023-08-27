
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const User = require('../models/User');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.categorylist = (req, res) => {
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
    sql += `SELECT w.id, user_id, product_id, cat_name, name, price, image, description, details,created_at FROM tbl_wish as w INNER JOIN tbl_products as p ON w.product_id = p.id WHERE w.user_id='${user_id}';`;
    sql += `SELECT c.id, user_id, product_id, cat_name, name, price, image, description, details, quantity,created_at FROM tbl_cart as c INNER JOIN tbl_products as p ON c.product_id = p.id WHERE c.user_id='${user_id}';;`;
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
