const mysql = require('./mysqlConnect');

exports.findByCoupon = (code) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_coupon where code = '${code}'`).then(([result]) => {
            resolve(result);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.findById = (id) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_coupon where id = '${id}'`).then(([user]) => {
            resolve(user);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.register = (newProduct) => {
    return new Promise((resolve, reject) => {
        mysql.insertOne('tbl_coupon', newProduct).then(product => {
            resolve(product)
        }).catch(err => {
            reject(err);
        });
    });
}