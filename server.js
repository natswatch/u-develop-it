const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();


//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});
//Get a signle candidates
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates
                 WHERE id =?`;
    const params = [req.params.id];
    db.get(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: res.message});
            return;
        }

        res.json({
            message: 'successfulyy deleted',
            changes: this.changes
        });
    });
});
    

// //GET a single candidate
// db.get('SELECT * FROM candidates WHERE id = 1', (err, row) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// CREATE a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;

// const params = [1, 'Ronald', 'Firbank', 1];
// //ES5 functino, not arrow functon to use this
// db.run(sql, params, function(err, result){
//     if(err){
//         console.log(err);
//     }

//     console.log(result, this.lastID);
// })
//Delete a candidate
// db.run('DELETE FROM candidates WHERE id = ?', 1, function(err, result) {
//     if (err) {
//         console.log(err);
//     }

//     console.log(result, this, this.changes);
// });
// handles all other requests
app.use((req, res) => {
    res.status(404).end();
});

db.on('open', () => {

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});