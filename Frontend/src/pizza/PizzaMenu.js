/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

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