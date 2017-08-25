var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
router.get('/', (req, res) => {
    res.redirect('/home/1')
})

router.get('/home/:id', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    var pagesNum = 0;
    var pageArr = [];
    var q = +req.params.id;
    var i = 0;
    var productArr = [];
    Product.find(function (err, docs) {
        docs = docs.reverse()
        for (i; i < docs.length; i = i + 6) {
            pageArr.push(pagesNum + 1);
            pagesNum++;

        }
        for (i = (q * 6) - 6; i < q * 6; i++) {
            productArr.push(docs[i])

        }



        res.render('shop/index', {
            title: 'Shopping Cart',
            products: productArr,
            successMsg: successMsg,
            noMessages: !successMsg,
            pagination: pageArr

        });
    });
});
router.post('/search', (req, res) => {
    var successMsg = req.flash('success')[0];
    
    var search = req.body.search.toLowerCase(),
        sreachArray = [],
        i = 0;

    Product.find((err, docs) => {
        if (err) throw err;
        for (i; i < docs.length; i++) {
            var title = docs[i].title.toLowerCase(),
                product = docs[i],
                searchMet = title.search(search);

            if (searchMet >= 0) {
                sreachArray.push(product);
            }
        }
        res.render('shop/search', {
            title: 'search for ' + search,
            search : search,
            products: sreachArray,
            successMsg: successMsg,
            
            

        });
    })
})

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/checkout')
    });
});
router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice
    });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {
        total: cart.totalPrice,
        errMsg: errMsg,
        noError: !errMsg
    });
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_0CokdR9HXpm685qx4oBY65P0"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (error, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');


        })

    });
});

router.get('/product/:id', (req, res, next) => {
    var id = req.params.id;

    Product.findById(id, (err, product) => {

        if (err) throw err;

        Product.find((err, same) => {
            if (err) throw err;

            res.render('shop/product', {
                p: product,
                products: same
            });
        })




    })



})
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}