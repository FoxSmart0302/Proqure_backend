
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const fs = require('fs')
const Coupon = require('../models/Coupon');
const { isEmpty, getCurrentFormatedDate, getFormatedDate } = require('../utils');

const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{11,}$/; // Matches 11 or more digits
    return regex.test(phoneNumber);
}

exports.register = (req, res) => {

    console.log("productregister", req.body);

    let { code, type, value, count, validity_date } = req.body;
    validity_date = getFormatedDate(validity_date)
    Coupon.findByCoupon(code).then(result => {
        if(result){
            return res.json({
                status: 1,
                message: "Code already exists",
            })
        }
        const newCoupon = { code, type, value, count, validity_date };
    
        newCoupon.created_at = getCurrentFormatedDate();
        let insertQuery = mysql.getInsertQuery('tbl_coupon', newCoupon);
        let selectQuery = mysql.selectQuery('tbl_coupon', {deleted_at: null});
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
        return res.json({
            status: 1,
            message: "Please try again later"
        })
    })
}

exports.edit = (req, res) => {
    console.log("editreqbody", req.body);
    let fileName = null;
    let uploadPath = null;
    let {id, type, value, count, validity_date } = req.body;
    validity_date= getFormatedDate(validity_date);

    let  updateQuery = mysql.updateQuery('tbl_coupon', {id: id}, {type: type, value: value, count: count, validity_date: validity_date });
    let selectQuery = mysql.selectQuery('tbl_coupon', {deleted_at: null});
   
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
exports.delete = (req, res) => {
    console.log("deletebody", req.body);
    let {id, company, firstname, lastname, phone, email } = req.body;
    let delete_at = getCurrentFormatedDate();
    let updateQuery = mysql.updateQuery('tbl_coupon', {id: id}, {deleted_at: delete_at});
    let selectQuery = mysql.selectQuery('tbl_coupon', {deleted_at: null});
    console.log(updateQuery)
    mysql.query(`${updateQuery}${selectQuery}`)
        .then(result => {
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

exports.list = (req, res) => {
    // let selectQuery = mysql.selectQuery("tbl_coupon", { deleted_at: null });
    let selectQuery = `SELECT * from tbl_coupon WHERE deleted_at IS NULL;`;
    console.log("selectQuery", selectQuery)
    mysql.query(selectQuery).then((coupons) => {
        res.json({
            status: 0,
            list: coupons,
        })
    })
    .catch(error => {
        res.json({
            status: 1,
            error
        })
    })
}

