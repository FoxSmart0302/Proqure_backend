const Item = require('../models/Item');
const mysql = require('../models/mysqlConnect');
const { isEmpty } = require('../utils');

exports.addwishitem = (req, res) => {
    console.log("addwishitem", req.body);
    let { user_id, product_id } = req.body;
    const findQuery = {
        user_id: user_id,
        product_id: product_id,
    }
    mysql.select('tbl_wish', findQuery).then(([fresult]) => {
        console.log("====result:", isEmpty(fresult));
        if (!isEmpty(fresult)) {
            return res.json({
                status: 0,
                message: "Item alreay exists",
            })
        }
        let insertQuery = mysql.insertManyQuery('tbl_wish', [findQuery]);
        console.log('insertQuery :>> ', insertQuery);
        mysql.query(insertQuery).then(iresult => {
            console.log("insertQuery:", iresult);
            return res.json({
                status:0,
                message:"Successfully added",
            })

        })
            .catch(err => {
                console.log('err :>> ', err);
                return res.json({
                    status: 1,
                    message: "Please try again later",
                })
            })

    })
        .catch(err => {
            console.log('err :>> ', err);
            return res.json({
                status: 1,
                message: "Please try again later",
            })
        })
}

exports.deletewishitem = (req, res) => {
    console.log('deletewishitem', req.body);
    
}