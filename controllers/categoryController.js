
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
    mysql.query('SELECT tbl_products.* from tbl_categories JOIN  tbl_products ON tbl_categories.id = tbl_products.cat_id ORDER BY tbl_categories.id;SELECT * from tbl_categories ORDER BY id ASC;').then(([list, clist]) => {
        // console.log('object :>> ', JSON.stringify(list));
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
            sortedArray,
        })
    }).catch(err => {
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    });
}