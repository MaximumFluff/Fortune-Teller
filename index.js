const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const url = 'INSERT_DATABASE_URL_HERE';

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Allow cross origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', async (req, res) => {
  res.sendFile('./index.html');
});

app.get('/getfortunes', async (req, res) => {
  let amountToReturn = req.query.amount;
  if (req.query.amount == undefined) {
    amountToReturn = 1;
  }
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db('insert_collection_name_here');
      let length = 0;
      let randomIndex = 0;
      dbo
        .collection('fortunes')
        .countDocuments()
        .then(async count => {
          if (amountToReturn == 1) {
            length = count - 1;
            randomIndex = Math.floor(Math.random() * length) + 1;
            await dbo
              .collection('fortunes')
              .findOne({ id: randomIndex })
              .then(item => {
                console.log(item);
                res.json(item);
              });
          } else {
            length = count - 1;
            let myArray = [];
            for (let i = 0; i < amountToReturn; i++) {
              let randomIndex = Math.floor(Math.random() * length) + 1;
              await dbo
                .collection('fortunes')
                .findOne({ id: randomIndex })
                .then(item => {
                  myArray.push(item);
                });
            }
            console.log(myArray);
            res.json(myArray);
          }
        });
    }
  );
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
