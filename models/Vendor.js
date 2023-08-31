const mysql = require('./mysqlConnect');

exports.findByEmail = (email) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_vendor where email = '${email}'`).then(([user]) => {
            resolve(user);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.findById = (id) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_vendor where id = '${id}'`).then(([user]) => {
            resolve(user);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.register = (newUser) => {
    return new Promise((resolve, reject) => {
        mysql.insertOne('tbl_vendor', newUser).then(user => {
            resolve(user)
        }).catch(err => {
            reject(err);
        });
    });
}