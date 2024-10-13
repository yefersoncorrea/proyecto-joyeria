const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

//api para generar reporte
router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generateUuid = uuid.v1();
    const detallesPedido = req.body;
    var productDetailsReport = JSON.parse(detallesPedido.detallesProducto);

    query = "insert into factura (nombre,uuid,email,numeroContacto,metodoPago,total,detallesProducto,creadoPor) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [detallesPedido.nombre, generateUuid, detallesPedido.email, detallesPedido.numeroContacto, detallesPedido.metodoPago, detallesPedido.cantidadTotal, detallesPedido.detallesProducto, res.locals.email], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "reporte.ejs"), { detallesProducto: productDetailsReport, nombre: detallesPedido.nombre, email: detallesPedido.email, numeroContacto: detallesPedido.numeroContacto, metodoPago: detallesPedido.metodoPago, cantidadTotal: detallesPedido.cantidadTotal }, (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generador_pdf/' + generateUuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else {
                            return res.status(200).json({ uuid: generateUuid });
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const detallesPedido = req.body;
    const pdfPath = './generador_pdf/' + detallesPedido.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("aplicacion/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    else {
        var productDetailsReport = JSON.parse(detallesPedido.detallesProducto);
        ejs.renderFile(path.join(__dirname, '', "reporte.ejs"), { detallesProducto: productDetailsReport, nombre: detallesPedido.nombre, email: detallesPedido.email, numeroContacto: detallesPedido.numeroContacto, metodoPago: detallesPedido.metodoPago, cantidadTotal: detallesPedido.cantidadTotal }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            else {
                pdf.create(results).toFile('./generador_pdf/' + detallesPedido.uuid + ".pdf", function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        res.contentType("aplicacion/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

//api para obtener todas las facturas
router.get('/getFacturas', auth.authenticateToken, (req, res, next) => {
    var query = "select *from factura order by id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api para eliminar factura
router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from factura where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ mensaje: "id de factura no encontrado." });
            }
            return res.status(200).json({ mensaje: "Factura eliminada exitosamente." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;