const Item = require('../models//Item');

exports.addwishitem = (req, res) => {
    console.log(req.body);
    let { user_id, product_id } = req.body;
}