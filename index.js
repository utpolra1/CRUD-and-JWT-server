const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3i9ecp5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("productNew").collection("product");

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //email math user data find
    app.get("/product/:email", async (req, res) => {
      console.log(req.params.email);
      try {
          const result = await productCollection.find({ email: req.params.email }).toArray(); // Corrected toArray() invocation
          res.send(result);
      } catch (error) {
          console.error("Error:", error);
          res.status(500).send("Internal Server Error");
      }
  });

    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });


    app.delete('/product/:id', async (req, res)=>{
      const id =req.params.id;
      const query ={_id: new Object(id)}
      const result=await productCollection.deleteOne(query);
      res.send.result;
    })

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
  res.send("coffe making");
});

app.listen(port, () => {
  console.log(`coffe server runing port: ${port}`);
});
