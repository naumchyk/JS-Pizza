/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

var API = require('../API');



var mapProp =	{
    center:	new	google.maps.LatLng(50.464379,30.519131),
    zoom:	12
};
var html_element =	document.getElementById("googleMap");
var map	=	new	google.maps.Map(html_element,	 mapProp);
var point	=	new	google.maps.LatLng(50.464379,30.519131);
var marker	=	new	google.maps.Marker({
    position:	point,
    map:	map,
    icon:	"assets/images/map-icon.png"
});
var marker1	=	new	google.maps.Marker({
    position:	point,
    map:	null,
    icon:	"assets/images/map-icon.png"
});
google.maps.event.addListener(map,'click',function(me){
    var coordinates	=	me.latLng;
    marker1.setMap(null);
    marker1	=	new	google.maps.Marker({
        position:	coordinates,
        map:	map,
        icon:	"assets/images/home-icon.png"
    });
    geocodeLatLng(coordinates,	function(err,	adress){
        if(!err)	{
            console.log(adress);
            $("#inputAdress").val(adress);
        }	else	{
            console.log("Немає адреси")
        }
    })
    calculateRoute(point,coordinates,function (err,time) {
        console.log(time.duration.text);
        $(".form-control-static").text(time.duration.text);
    })
});
function	calculateRoute(A_latlng,	 B_latlng,	callback)	{
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    },	function(response,	status)	{
        if	(	status	==	google.maps.DirectionsStatus.OK )	{
            var leg	=	response.routes[	0	].legs[	0	];
            callback(null,	{
                duration:	leg.duration
            });
        }	else	{
            callback(new	Error("Can'	not	find	direction"));
        }
    });
}
function	geocodeLatLng(latlng,	 callback){
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var adress =	results[1].formatted_address;
            callback(null,	adress);
        }	else	{
            callback(new	Error("Can't	find	adress"));
        }
    });
}
function	geocodeAddress(address,	 callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            // callback(new	Error("Can	not	find	the	adress"));
        }
    });
}
//Коли сторінка завантажилась
$("#inputAdress").keyup(function () {
    geocodeAddress($("#inputAdress").val(),function (err,coor) {
        marker1.setMap(null);
        marker1	=	new	google.maps.Marker({
            position:	coor,
            map:	map,
            icon:	"assets/images/home-icon.png"
        });
        calculateRoute(point,coor,function (err,time) {
            console.log(time.duration.text);
            $(".form-control-static").text(time.duration.text);
        })
    })
})
function	initialize()	{
//Тут починаємо працювати з картою
}
google.maps.event.addDomListener(window,	 'load',	initialize);



$(".send").click(function () {
    if(send()){
        API.createOrder({
            Name :$(".inputName").val(),
            Number:$("#inputNumber").val(),
            Adress: $("#inputAdress").val(),
            pizzas : PizzaCart.getPizzaInCart(),
            price :PizzaCart.price
        },function (err,result) {
            if(err)
                console.log(err);
            else{
                LiqPayCheckout.init({
                    data:	result.data,
                    signature:	result.signature,
                    embedTo:	"#liqpay",
                    mode:	"popup"	//	embed	||	popup
                }).on("liqpay.callback",	function(data){
                    console.log(data.status);
                    console.log(data);
                }).on("liqpay.ready",	function(data){
                    // console.log(data.status);
                    // console.log(data);
//	ready
                }).on("liqpay.close",	function(data){


                });}
        });



    }
});

// function	postRequest(url,	data,	callback)	{
//     $.ajax({
//         url:	url,
//         type:	'POST',
//         contentType :	'application/json',
//         data:	JSON.
//         stringify(data),
//         success:	function(data){
//         callback(	data);
//     },
//     fail:	function()	{
//         callback(new	Error("Ajax	Failed"));
//     }
// })
// }

function send() {
    var $name = $(".inputName");
    var $adress = $("#inputAdress");
    var $phone = $("#inputNumber");
    var valiable = true;

    if($name.val()!=""){
        $(".form-group-name").removeClass("has-error");
        $(".form-group-name").addClass("has-success");
    }
    else{
        $(".form-group-name").removeClass("has-success");
        $(".form-group-name").addClass("has-error");
        valiable = false;
    }
    var phone = parseInt($phone.val());
    console.log($phone.val().length);
    if(phone!=NaN&&($phone.val().length==12)||($phone.val().length==10)){
        $(".form-group-number").removeClass("has-error");
        $(".form-group-number").addClass("has-success");
    }
    else{
        $(".form-group-number").removeClass("has-success");
        $(".form-group-number").addClass("has-error");
        valiable = false;
    }
    if($adress.val()!=""){
        $(".form-group-adress").removeClass("has-error");
        $(".form-group-adress").addClass("has-success");
    }
    else{
        $(".form-group-adress").removeClass("has-success");
        $(".form-group-adress").addClass("has-error");
        valiable = false;
    }
return valiable;
}

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big, pizza.big_size.price);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small, pizza.small_size.price);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
        $(".sort-pizzas .badge.orange.orders-count-span").html ( list.length);
    }

$(".filter-button-all-pizza").click(function () {
    filterPizza(0);
    $(".active").removeClass("active");
    $(".filter-button-all-pizza").addClass("active");
});

$(".filter-button-meat").click(function () {
    filterPizza(1);
    $(".active").removeClass("active");
    $(".filter-button-meat").addClass("active");
});

$(".filter-button-ananas").click(function () {
    filterPizza(2);
    $(".active").removeClass("active");
    $(".filter-button-ananas").addClass("active");
});

$(".filter-button-mashrooms").click(function () {
    filterPizza(3);
    $(".active").removeClass("active");
    $(".filter-button-mashrooms").addClass("active");
});

$(".filter-button-sea").click(function () {
    filterPizza(4);
    $(".active").removeClass("active");
    $(".filter-button-sea").addClass("active");
});

$(".filter-button-vega-shit").click(function () {
    filterPizza(5);
    $(".active").removeClass("active");
    $(".filter-button-vega-shit").addClass("active");
});

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        switch (filter){
            case 0:
                pizza_shown.push(pizza);
                break;
            case 1:
                if(pizza.content.meat!=undefined)
                    pizza_shown.push(pizza);
                break;
            case 2:
                if(pizza.content.pineapple!=undefined)
                    pizza_shown.push(pizza);
                break;
            case 3:
                if(pizza.content.mushroom!=undefined)
                    pizza_shown.push(pizza);
                break;
            case 4:
                if(pizza.content.ocean!=undefined)
                    pizza_shown.push(pizza);
                break;
            case 5:
                if(pizza.content.meat==undefined&&pizza.ocean==undefined)
                    pizza_shown.push(pizza);
                break;
            default:
                pizza_shown.push(pizza);
                break;
        }
        //pizza_shown.push(pizza);

    });

    //Показати відфільтровані піци
     showPizzaList(pizza_shown);
}


function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;



