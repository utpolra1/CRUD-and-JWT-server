const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3i9ecp5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const blogCollection = client.db("newBlog").collection("blog");
    const wishlistCollection = client.db("newBlog").collection("wishlist");
    const commentCollection = client.db("newBlog").collection("comments");
    const featuredblogsCollection=client.db("newBlog").collection("featuredblogs");

    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //update get data
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = await blogCollection.findOne(query);
      res.send(cursor);
    });

    

    
    
    app.post("/blog", async (req, res) => {
      const newProduct = req.body;
      // console.log(newProduct);
      const result = await blogCollection.insertOne(newProduct);
      res.send(result);
    });

   

    //Comment Update
    app.put("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = req.body;
      const update = {
        $set: {
          textcomment: updateDoc.textComment,
        },
      };
      const result = await commentCollection.updateOne(query, update, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blog Runing");
});

app.listen(port, () => {
  console.log(`blog server runing port: ${port}`);
});
