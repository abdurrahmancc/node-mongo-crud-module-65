const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

//username: abdurrahmancc
//password: 5mMihZVPknBdbKwt

//user middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://abdurrahmancc:5mMihZVPknBdbKwt@cluster0.0ovkd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const collection = client.db("foodExpress").collection("users");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = collection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.findOne(query);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: { name: updateUser.name, email: updateUser.email },
      };
      const result = await collection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("added new user", newUser);
      const result = await collection.insertOne(newUser);
      res.send(result);
    });
  } finally {
    //   await client.close()
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tore ami khaisi batta");
});

app.listen(port, () => {
  console.log("CRUD server is running");
});
