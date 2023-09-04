
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const mysql = require('../models/mysqlConnect');
const User = require('../models/User');
const fs = require('fs')
const Segment = require('../models/Segment');
const { isEmpty, getCurrentFormatedDate } = require('../utils');

exports.segmentlist = (req, res) => {
    let selectQuery = mysql.selectQuery("tbl_segment", { deleted_at: null });
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

    console.log("segmentregister", req.body);

    let { name, description } = req.body;
    const newSegment = {
        name, description
    };

    newSegment.created_at = getCurrentFormatedDate();
    newSegment.updated_at = newSegment.created_at;
    Segment.register(newSegment).then(segment => {
        // ioHandler.sendnewSegmentEvent(segment);
        console.log("segment", segment)
        return res.json({
            status: 0,
            segment,
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

exports.edit = (req, res) => {
    console.log("editreqbody", req.body);
    let { id, name, description } = req.body;
    let selectQuery;
    selectQuery = mysql.selectQuery('tbl_segment', {deleted_at: null});
    
    let  updateQuery = mysql.updateQuery('tbl_segment', {id: id}, {name: name, description: description.replace(`'`, `\\'`) });

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
    let updateQuery = mysql.updateQuery('tbl_segment', {id: id}, {deleted_at: delete_at});
    let selectQuery = mysql.selectQuery('tbl_segment', {deleted_at: null});
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
