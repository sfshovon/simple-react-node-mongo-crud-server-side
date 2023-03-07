const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

//MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qujfvjg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
 try{
    client.connect();
    const userCollection = client.db('simpleCrud').collection('users'); 

    // Get All Users (Find All)
    app.get('/user', async(req, res) =>{
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    // Load A Specific User by ID (Find One)
    app.get('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // POST: Add A New User
    app.post('/user', async(req, res) => {
      const newUser = req.body;
      console.log("Adding New User", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    });

    //Delete: Delete/Remove A User
    app.delete('/user/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    
    // PUT: Update A User
    app.put('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              name: updatedUser.name,
              email: updatedUser.email
          }
      };
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

  }

 finally{
  // await client.close();
 }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});