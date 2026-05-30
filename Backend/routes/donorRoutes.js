const express = require('express');

const router = express.Router();

const db = require('../config/db');

/*
====================================
GET DONOR DONATIONS
====================================
*/

router.get('/donations/:email', (req, res)=>{

    const sql = `
    
    SELECT * FROM food_submissions
    
    WHERE donor_email=?
    
    ORDER BY created_at DESC
    
    `;

    db.query(

        sql,

        [req.params.email],

        (err, results)=>{

            if(err){

                console.log(err);

                return res.status(500).json({

                    success:false

                });

            }

            res.json({

                success:true,

                donations:results

            });

        }

    );

});

module.exports = router;