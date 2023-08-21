
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const User = require('../models/User');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.categorylist = (req, res) => {
    mysql.query('SELECT * FROM `tbl_categories`').then(list => {
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
    console.log('req.body :>> ', req.body);
    mysql.query(`SELECT * from tbl_catitems WHERE id='${req.body.id}'`).then(result => {
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
    console.log('req.body :>> ', req.body);
    mysql.query(`SELECT * from tbl_catitems WHERE cat_id='${req.body.cat_id}'`).then(list => {
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
    mysql.query('SELECT tbl_catitems.* from tbl_categories JOIN  tbl_catitems ON tbl_categories.id = tbl_catitems.cat_id ORDER BY tbl_categories.id;SELECT * from tbl_categories ORDER BY id ASC').then(([list, clist]) => {
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
            sortedArray,
        })
    }).catch(err => {
        res.json({
            status: 1,
            message: 'Please try again later.'
        })
    });
}