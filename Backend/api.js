/**
 * Created by chaika on 09.02.16.
 */

var LIQPAY_PUBLIC_KEY = "i15783754350";
var LIQPAY_PRIVATE_KEY = "rIabBOjMo1hXNk9Ljm4nXAwBTpum31m7nBFRKQva";
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

var crypto	=	require('crypto');

function	base64(str)	 {
    return	new	Buffer(str).toString('base64');
}

function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}


exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

    var order	=	{
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.price,
        currency:	"UAH",
        description:	JSON.stringify(order_info),
        order_id:	Math.random(),
        sandbox:	1
    };
    var data	=	base64(JSON.stringify(order));
    var signature	=	sha1(LIQPAY_PRIVATE_KEY	+	data	+	LIQPAY_PRIVATE_KEY)
    res.send({
        success: true,
        data:data,
        signature:signature
    });

};


