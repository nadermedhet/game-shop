var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var Product = require('../models/product');
var Orders = require('../models/order');
var Admin =require('../models/admin');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    },
})
var upload = multer({ storage: storage });


router.get('/panel'  , function( req , res , next){
        Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        Orders.find( (err , order) =>{
        if(err) throw err;

        res.render('admin/panel', { orders: order ,  products: productChunks});
       


    })
        


    });
    
 

});
router.post('/products' , function( req , res , next){

    var newProduct = new Product();

    newProduct.title = req.body.title;
    newProduct.imagePath = req.body.imagePath;
    newProduct.description = req.body.description;
    newProduct.price = req.body.Price;
    newProduct.catagory = req.body.catagory;
    newProduct.tumbles = req.body.tumble;

    newProduct.save((err , product ) => {

        if(err) throw err;
        if( product){
            console.log(product);
            res.redirect('/');
        }
        

    });
  
    

});
router.get('/update/:id' , function(req , res ,next){
    
    
    Product.findById({ _id : req.params.id} , ( err , product) => {
        if(err) throw err;
        if(product){
             
            res.render('admin/update', { p: product});
        }

    });
});

router.post('/update/:id', function(req, res ,next) {

    
        var id = req.params.id;
        Product.findById(id , (err , newProduct) =>{
            if(err){
                console.error('err' +err)
            }
            newProduct.title = req.body.title;
    newProduct.imagePath = req.body.imagePath;
    newProduct.description = req.body.description;
    newProduct.price = req.body.Price;
    newProduct.catagory = req.body.catagory;
    

    newProduct.save();
    res.redirect('/admin/panel')

            

        })

});
router.get('/delete/:id' , function( req , res ,nex){
     Product.findById({ _id : req.params.id} , ( err , product) => {
        if(err) throw err;
        if(product){
             
            res.render('admin/delete', { p: product});
            console.log(product)
        }
} )
} )

router.post('/delete/:id',function(req , res ,next){
     var id = req.params.id;
  Product.findByIdAndRemove(id).exec();
  res.redirect('/');

});
router.post('/create-admin',passport.authenticate('local.adminReg', {
    
    failureRedirect: '/admin/create-admin',
    failureFlash: true
}),  ( req , res , next) =>{
    if( req.session.oldUrl ){
        var oldUrl = res.session.oldUrl ;
       res.session.oldUrl = null; 
       res.redirect( oldUrl );
   } else{
       res.redirect('/admin/panel');
   }

  
      



});




router.post('/be-admin',
  passport.authenticate('basic', {successRedirect:'/admin/panel', failureRedirect:'',failureFlash: true}),
  function(req, res) {
    ress.send('done')
  });



module.exports = router;
