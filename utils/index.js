const moment = require('moment');

exports.escapeHTML = (str) => {
    if (str === undefined || str === null) {
        return str;
    }
    if (typeof (str) === 'string') {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    if (Array.isArray(str)) {
        let newStr = [];
        str.forEach(item => {
            newStr.push(escapeHTML(item));
        })
        return newStr;
    }
    if (typeof (str) === 'object') {
        let newStr = {};
        Object.keys(str).forEach(key => {
            if (key == "files") {
                newStr[key] = str[key];
            } else {
                newStr[key] = escapeHTML(str[key]);
            }
        })
        return newStr;
    }
    return str;
}
const escapeHTML = this.escapeHTML;
exports.isEmpty = (value) => {
    return value === undefined || value === null || value === "" || (typeof(value) === "object" && Object.keys(value).length == 0);
}

exports.escapeHTMLMiddleware = (req, res, next) => {
    req.body = escapeHTML(req.body);
    req.query = escapeHTML(req.query);
    req.params = escapeHTML(req.params);
    next();
}

exports.getCurrentFormatedDate = () => {
    return moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
}

exports.getFormatedDate = (date) => {
    return moment(date).format("yyyy-MM-DD");
} 

