const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.get('/detalles',auth.authenticateToken,(req,res,next)=>{
    var categoriaCount;
    var productoCount;
    var facturaCount;
    var query = "select count(id) as categoriaCount from categoria";
    connection.query(query,(err,results)=>{
        if(!err){
            categoriaCount = results[0].categoriaCount;
        }
        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(id) as productoCount from producto";
    connection.query(query,(err,results)=>{
        if(!err){
            productoCount = results[0].productoCount;
        }
        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(id) as facturaCount from factura";
    connection.query(query,(err,results)=>{
        if(!err){
            facturaCount = results[0].facturaCount;
            var data = {
                categoria:categoriaCount,
                producto:productoCount,
                factura:facturaCount
            };
            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;