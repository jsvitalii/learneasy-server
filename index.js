const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uzwhp2i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('LearnEasy Server!');
});

client.connect((err) => {
  const courseCollection = client.db('learneasy').collection('courses');
  const cartOrderCollection = client.db('learneasy').collection('cartOrders');
  const orderCollection = client.db('learneasy').collection('orders');

  app.post('/addCourse', async (req, res) => {
    const result = await courseCollection.insertOne(req.body);
    res.send(result);
  });

  app.get('/courses', async (req, res) => {
    const result = await courseCollection.find({}).toArray();
    res.send(result);
  });

  app.delete('/deleteCourse/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const result = await courseCollection.deleteOne(query);
    res.send(result);
  });

  app.post('/addCartOrder', async (req, res) => {
    const result = await cartOrderCollection.insertOne(req.body);
    res.send(result);
  });

  app.get('/cartOrders/:email', async (req, res) => {
    const result = await cartOrderCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  app.delete('/deleteCartOrder/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const result = await cartOrderCollection.deleteOne(query);
    res.send(result);
  });

  app.delete('/deleteAllCartOrder/:id', async (req, res) => {
    const query = { email: req.params.id };
    const result = await cartOrderCollection.deleteMany(query);
    res.send(result);
  });

  app.post('/addOrder', async (req, res) => {
    const result = await orderCollection.insertOne(req.body);
    res.send(result);
  });

  app.get('/orders', async (req, res) => {
    const result = await orderCollection.find({}).toArray();
    res.send(result);
  });

  app.get('/orders/:email', async (req, res) => {
    const result = await orderCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

  app.delete('/deleteOrder/:id', async (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    const result = await orderCollection.deleteOne(query);
    res.send(result);
  });

  app.put('/orders/:id', async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        status: 'Delivered',
      },
    };
    const result = await orderCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });
});

app.listen(port, () => console.log('listening at', port));
