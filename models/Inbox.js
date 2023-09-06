const mysql = require('./mysqlConnect');

exports.findByEmail = (email) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_inbox where email = '${email}'`).then(([user]) => {
            resolve(user);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.findById = (id) => {
    return new Promise((resolve, inject) => {
        mysql.query(`select * from tbl_inbox where id = '${id}'`).then(([user]) => {
            resolve(user);
        }).catch(err => {
            inject(err);
        })
    })
}

exports.inboxList = (segment_id) => {
    return new Promise((resolve, inject) => {
        let sql = '';
        if(segment_id == 'all'){
            sql = `SELECT * FROM tbl_users as u WHERE u.deleted_at IS NULL AND u.role='4' AND u.status='2';`;
        }else{
            sql = `SELECT * FROM tbl_users as u WHERE u.deleted_at IS NULL AND u.role='4' AND u.status='2' AND u.segment_id='${segment_id}';`;
        }
        
        mysql.query(sql).then(result => {
            resolve(result)
        }).catch(err => {
            inject(err)
        })
    });
}

exports.register = (newCategory) => {
    return new Promise((resolve, reject) => {
        mysql.insertOne('tbl_inbox', newCategory).then(category => {
            resolve(category)
        }).catch(err => {
            reject(err);
        });
    });
}