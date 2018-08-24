var express = require('express');
var Product = require('../data/product.js');
var router = express.Router();

router.post('/', (req, res) => {
    //is is user id who posts a comment
    var data = {
        Name: req.body.name,
        Desc: req.body.desc,
        image: req.body.Image,
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        userId: req.body.userId
    }
    console.log("hello");
    console.log(data);
    addProducts(data, res);

});
function addProducts(data, res) {
    console.log(data);
    Product.create(data, (err, product) => {
        if (err) return res.send({ "error": err })
        if (!product) return res.send({ "empty": "yes" })
        Product.find({ _id: product._id }).exec((err, product) => {

            if (err) return res.send({ "error": err })
            res.send({ "response": product })

        });

    })


}

router.get('/', (req, res) => {
    getAllProducts(res);
});
function getAllProducts(res) {
    res.setHeader('Content-Type', 'application/json');
    Product.find(function (err, product) {
        if (err) res.send(JSON.stringify({ "error": "No product", "response": null }));

        res.send(JSON.stringify({ "status": 200, "error": null, "response": product }));

    })

}

router.get('/user/:userId', (req, res) => {
   
    getAllProductsByUser(req, res);
});
function getAllProductsByUser(req, res) {
     var userId = req.params.userId;
    res.setHeader('Content-Type', 'application/json');
    Product.find({ "userId": userId },(err, product)=> {
        if (err) res.send(JSON.stringify({ "error": "No product", "response": null }));

        res.send(JSON.stringify({ "status": 200, "error": null, "response": product }));

    })

}

router.put('/update/:productId', (req, res) => {

    updateProduct(req.params.productId, req.body, res);

});

function updateProduct(id, data, res) {

    Product.findByIdAndUpdate(id, data, (err, product) => {
        if (err) return res.send({ "error": err })

        Product.findById(product._id, (err, updatedproduct) => {
            if (err) return res.send({ "error": err })

            res.send({ "response": updatedproduct });
        })



    })



}

router.get('/:product_id', (req, res) => {
    Product.findById(req.params.productId, (err, product) => {
        if (err) throw err;
        res.send(product);
    });
});



function addProduct(req, res) {
    res.setHeader('Content-Type', 'application/json');

    Product.create(data, (err, res) => {
        if (err)
            return res.send({ "error": err })
    });




}


function editProduct(req, res) {
    var id = req.params.ProductId;
    Product.findByIdAndUpdate(id, { "product": req.body.comment },
        (err, comment) => {
            if (err) throw err;

            res.send({ "result": "updated", "error": "No" });

        });


}



module.exports = router