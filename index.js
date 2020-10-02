const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const password = 'admin';
const uri = "mongodb+srv://admin:admin@cluster0.jvvjr.mongodb.net/learningdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const collection = client.db("learningdb").collection("learn");
  
  app.get("/products", (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  app.get('/product/:id',(req, res)=>{
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result =>{
      console.log("data added successfully");
      res.redirect('/');
    })
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price,quentety:req.body.quentety}
    })
    .then(result =>{
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete("/delete/:id",(req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
});


app.listen(3000);