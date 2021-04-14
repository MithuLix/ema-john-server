const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser')
const port = 5000;

//middleware
app.use(bodyParser.json());
app.use(cors());
//mongo URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blzf0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//mongo Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//default app get
app.get('/', (req, res) => {
  res.send('Hello World!, ema-john server')
})


//mongo connection to client
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  //post products
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
    .then(result => {
        res.send(result.insertedCount)
    })
  })

  //get products
  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  //get products to inventory
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
  })

  //products by keys to review
  app.post('/productsByKeys', (req, res) => {
      const productsKeys = req.body;
      productsCollection.find({key: {$in: productsKeys}})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  
  //new database to order inventory
  //post products
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })





});

app.listen(port)