/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require("./storage");

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};



//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");


function addToCart(pizza, size, price) {
    var n=-1;
    for(var i = 0;i<Cart.length;i++)
       if((Cart[i].pizza==pizza)&&(Cart[i].size==size))
           n=i;
   if(n!=-1)
        Cart[n].quantity++;
   else{
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price:price
        });
   }
    updateCart();
}



function removeFromCart(cart_item) {
    data = [];
    for(var i = 0;i<Cart.length;i++){
        if((Cart[i].pizza!=cart_item.pizza)||(Cart[i].size!=cart_item.size))
            data.push(Cart[i]);
    }
    Cart = data;
    updateCart();
}

function initialiseCart() {
    var saved_orders = Storage.get("cart");
    if(saved_orders){
        Cart = saved_orders;
    }
    updateCart();
}

$(".clear-list").click(function () {
    Cart = [];
    updateCart();
})


function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".cancel").click(function () {
            removeFromCart(cart_item);
        });

        $node.find(".minus").click(function () {
            cart_item.quantity--;
           if (cart_item.quantity==0) removeFromCart(cart_item);
            updateCart();
        })

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);

    if(Cart.length==0){

        $cart.html(" Пусто в холодильнику? <br> Замовте піцу!");}
    $(".r1 .badge.orange.orders-count-span").html(Cart.length);
    $(".r3 .price").html("Сума: "+suma()+"грн.")

    function suma() {
        var s = 0;
        for(var i = 0;i<Cart.length;i++) {
            s += Cart[i].quantity * Cart[i].price;
        }
        return s;
    }

    Storage.set('cart',Cart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;