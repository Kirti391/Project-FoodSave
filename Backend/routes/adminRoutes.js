const express = require('express');
const router = express.Router();
const db = require('../config/db');
/* GET DONATIONS */
router.get('/donations', (req, res) => {
    const sql = ` SELECT * FROM food_submissions ORDER BY created_at DESC `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true,
            donations: result
        });

    });

});

/* ACCEPT DONATION */
router.put('/accept/:id', (req, res) => {
    const sql = ` UPDATE food_submissions SET status='accepted' WHERE id=? `;
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true
        });
    });
});

/* REJECT DONATION */
router.put('/reject/:id', (req, res) => {
    const sql = ` UPDATE food_submissions SET status='rejected' WHERE id=? `;
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true
        });
    });
});

/* COMPLETE DONATION */
router.put('/complete/:id', (req, res) => {
    const sql = ` UPDATE food_submissions SET status='completed' WHERE id=? `;
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true
        });
    });
});

/* ASSIGN NGO */
router.put('/assign-ngo/:id', (req, res) => {
    const sql = `
    UPDATE food_submissions
    SET ngo_assigned=?
    WHERE id=?
    `;
    db.query(sql, [req.body.ngo, req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true
        });
    }
    );
});

/* ASSIGN VOLUNTEER */
router.put('/assign-volunteer/:id', (req, res) => {
    const sql = ` UPDATE food_submissions SET volunteer_assigned=? WHERE id=? `;
    db.query(sql, [req.body.volunteer, req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true
        });

    }

    );

});

/* GET ALL USERS */
router.get('/users', (req, res) => {
    const sql = `  SELECT 
        id,
        name,
        email,
        role,
        STATUS AS status,
        created_at

    FROM users1

    ORDER BY id DESC
    
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true,
            users: results
        });

    });

});

/* BLOCK / ACTIVATE USER */
router.put('/users/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = ` 
    UPDATE users1  
    SET STATUS=?   
    WHERE id=?    
    `;
    db.query(sql, [status, req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true,
            message: `User ${status}`
        });

    }

    );

});

/* DELETE USER */
router.delete('/users/:id', (req, res) => {
    const sql = ` DELETE FROM users1 WHERE id=? `;
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false
            });
        }
        res.json({
            success: true,
            message: 'User Deleted'
        });
    }
    );
});

/* ADMIN DASHBOARD STATS */
router.get('/stats', (req, res) => {
    const stats = {};
    // TOTAL DONATIONS
    db.query(
        `SELECT COUNT(*) AS total FROM food_submissions`,
        (err, donationResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false
                });
            }
            stats.totalDonations = donationResult[0].total;
            // TOTAL USERS
            db.query(
                `SELECT COUNT(*) AS totalUsers FROM users1`,
                (err, userResult) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            success: false
                        });
                    }
                    stats.totalUsers = userResult[0].totalUsers;
                    // BLOCKED USERS
                    db.query(
                        `
                        SELECT COUNT(*) AS blockedUsers
                        FROM users1
                        WHERE STATUS='blocked'
                        `,
                        (err, blockedResult) => {

                            if (err) {

                                console.log(err);

                                return res.status(500).json({
                                    success: false
                                });

                            }

                            stats.blockedUsers =
                                blockedResult[0].blockedUsers;

                            // ACCEPTED DONATIONS
                            db.query(
                                `
                                SELECT COUNT(*) AS accepted
                                FROM food_submissions
                                WHERE status='accepted'
                                `,
                                (err, acceptedResult) => {

                                    stats.acceptedDonations =
                                        acceptedResult[0].accepted;

                                    // REJECTED DONATIONS
                                    db.query(
                                        `
                                        SELECT COUNT(*) AS rejected
                                        FROM food_submissions
                                        WHERE status='rejected'
                                        `,
                                        (err, rejectedResult) => {

                                            stats.rejectedDonations =
                                                rejectedResult[0].rejected;

                                            res.json({
                                                success: true,
                                                stats
                                            });

                                        });

                                });

                        });

                });

        });

});

module.exports = router;
