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
                status: 1,
                message: "Item alreay exists",
            })
        }
        let insertQuery = mysql.insertManyQuery('tbl_wish', [findQuery]);
        let selectQuery = `SELECT w.id, w.user_id, w.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details,p.created_at FROM tbl_wish as w INNER JOIN tbl_products as p ON w.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE w.user_id='${user_id}';`;
        mysql.query(`${insertQuery}${selectQuery}`).then(result => {
            if (!isEmpty(result)) {
                return res.json({
                    status: 0,
                    message: "Successfully added",
                    result,
                })
            }

        })
            .catch(err => {
                console.log('err1 :>> ', err);
                return res.json({
                    status: 1,
                    message: "Please try again later",
                })
            })

    })
        .catch(err => {
            console.log('err2 :>> ', err);
            return res.json({
                status: 1,
                message: "Please try again later",
            })
        })
}

exports.removewishitem = (req, res) => {
    console.log('removewishitem', req.body);
    let { id: id, user_id: user_id, product_id: product_id } = req.body;
    let deleteQuery = mysql.deleteManyQuery('tbl_wish', { user_id: user_id, product_id: product_id });
    console.log("deleteQuery", deleteQuery);
    let selectQuery = `SELECT w.id, w.user_id, w.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details,p.created_at FROM tbl_wish as w INNER JOIN tbl_products as p ON w.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE w.user_id='${user_id}';`;
    mysql.query(`${deleteQuery}${selectQuery}`).then((result) => {
        return res.json({
            status: 0,
            result: result,
            message: "Successfully deleted"
        })

    }).catch(err => {
        console.log("removewishitem", err)
        return res.json({
            status: 1,
            message: "Please try again later",
        })
    })

}


exports.addcartitem = (req, res) => {
    console.log("addcartitem", req.body);
    let { user_id, product_id, quantity } = req.body;
    const findQuery = {
        user_id: user_id,
        product_id: product_id,
    }
    const temp = {
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
    }
    mysql.select('tbl_cart', findQuery).then(([fresult]) => {
        console.log("====result:", isEmpty(fresult));
        if (!isEmpty(fresult)) {
            return res.json({
                status: 1,
                message: "Item alreay exists",
            })
        }
        let insertQuery = mysql.insertManyQuery('tbl_cart', [temp]);
        let selectQuery = `SELECT ct.id, ct.user_id, ct.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details, ct.quantity, p.created_at FROM tbl_cart as ct INNER JOIN tbl_products as p ON ct.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE ct.user_id='${user_id}';`;
        mysql.query(`${insertQuery}${selectQuery}`).then(result => {
            if (!isEmpty(result)) {
                return res.json({
                    status: 0,
                    message: "Successfully added",
                    result,
                })
            }

        })
            .catch(err => {
                console.log('err3 :>> ', err);
                return res.json({
                    status: 1,
                    message: "Please try again later",
                })
            })

    })
        .catch(err => {
            console.log('err4 :>> ', err);
            return res.json({
                status: 1,
                message: "Please try again later",
            })
        })
}

exports.removecartitem = (req, res) => {
    console.log('removewishitem', req.body);
    let { id: id, user_id: user_id, product_id: product_id } = req.body;
    let deleteQuery = mysql.deleteManyQuery('tbl_cart', { user_id: user_id, product_id: product_id });
    console.log("deleteQuery", deleteQuery);
    let selectQuery = `SELECT ct.id, ct.user_id, ct.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details, ct.quantity, p.created_at FROM tbl_cart as ct INNER JOIN tbl_products as p ON ct.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE ct.user_id='${user_id}';`;
    mysql.query(`${deleteQuery}${selectQuery}`).then((result) => {
        return res.json({
            status: 0,
            result: result,
            message: "Successfully deleted"
        })

    }).catch(err => {
        console.log("removecartitem", err)
        return res.json({
            status: 1,
            message: "Please try again later",
        })
    })
}


exports.quantitychange = (req, res) => {
    console.log("quantitychange", req.body);
    let { id, user_id, product_id, quantity } = req.body;
    // let updateQuery = mysql.updateQuery('tbl_cart', { id: id }, { quantity: quantity });
    let updateQuery = `UPDATE tbl_cart SET quantity='${quantity}' WHERE id='${id}';`;
    console.log("update query", updateQuery);
    let selectQuery = `SELECT ct.id, ct.user_id, ct.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details, ct.quantity, p.created_at FROM tbl_cart as ct INNER JOIN tbl_products as p ON ct.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE ct.user_id='${user_id}';`;
    mysql.query(`${updateQuery}${selectQuery}`).then(result => {
        return res.json({
            status: 0,
            result: result,
            message: "Successfully updated",
        })
    }).catch(error => {
        console.log("error", error);
        return res.json({
            status: 1,
            message: "Please try again later",
        })
    })
}
exports.addtobagitem = (req, res) => {
    console.log("addcartitem", req.body);
    let { user_id, product_id, quantity } = req.body;
    const findQuery = {
        user_id: user_id,
        product_id: product_id,
    }
    const temp = {
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
    }
    mysql.select('tbl_cart', findQuery).then(([fresult]) => {
        console.log("====result:", isEmpty(fresult));
        let tempQuery = '';
        let message = '';
        if (isEmpty(fresult)) {
            tempQuery = mysql.insertManyQuery('tbl_cart', [temp]);
            message = "Successfully added";
        }else{
            tempQuery = `UPDATE tbl_cart SET quantity='${quantity}' WHERE user_id='${user_id}' and product_id='${product_id}';`;
            message = "Successfully updated";
        }
        let selectQuery = `SELECT ct.id, ct.user_id, ct.product_id,c.name as cat_name, p.name, p.price, p.image, p.description, p.details, ct.quantity, p.created_at FROM tbl_cart as ct INNER JOIN tbl_products as p ON ct.product_id = p.id INNER JOIN tbl_categories as c ON c.id=p.cat_id WHERE ct.user_id='${user_id}'`;
        mysql.query(`${tempQuery}${selectQuery}`).then(result => {
            if (!isEmpty(result)) {
                return res.json({
                    status: 0,
                    message: message,
                    result,
                })
            }

        })
            .catch(err => {
                console.log('err3 :>> ', err);
                return res.json({
                    status: 1,
                    message: "Please try again later",
                })
            })

    })
        .catch(err => {
            console.log('err4 :>> ', err);
            return res.json({
                status: 1,
                message: "Please try again later",
            })
        })
}
