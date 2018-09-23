// Dependencies
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 8000;
const url = "INSERT_DATABASE_URL_HERE";

app.use(express.static(__dirname));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile('./index.html');
});

app.get('/getfortunes', (req, res) => {
  MongoClient.connect(
    url,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db('heroku_kgwl3js3');
      let length = 0;
      let randomIndex = 0;
      dbo
        .collection('fortunes')
        .countDocuments()
        .then(count => {
          length = count - 1;
          randomIndex = Math.floor(Math.random() * length) + 1;
          console.log(`Length is: ${length}`);
          console.log(`randomIndex is: ${randomIndex}`);
          dbo
            .collection('fortunes')
            .findOne({ id: randomIndex })
            .then(item => {
              console.log(item);
              res.json(item);
            });
        });
    }
  );
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
