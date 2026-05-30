const express = require('express');
const router = express.Router();
const db = require('../config/db');
// GET ALL DONATIONS
router.get('/donations', (req, res) => {

    const sql = `

    SELECT * FROM food_submissions

    ORDER BY created_at DESC

    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                success: false,
                message: 'Database Error'

            });

        }

        res.json({

            success: true,

            donations: results

        });

    });

});

// TOTAL DONATIONS

router.get('/stats', (req, res) => {

    const sql = `

    SELECT COUNT(*) AS totalDonations

    FROM food_submissions

    `;

    db.query(sql, (err, results) => {

        if (err) {

            return res.status(500).json({

                success: false

            });

        }

        res.json({

            success: true,

            stats: results[0]

        });

    });

});

module.exports = router;