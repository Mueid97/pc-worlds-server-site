const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.5ftjy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('pcworldsdb').collection('products');
        const parchaseCollection = client.db('pcworldsdb').collection('parchases');


        app.get('/product', async(req,res)=>{
            const query= {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async(req,res)=>{
            const id= req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });

       

        app.post('/parchase', async(req,res)=>{
            const parchase = req.body;
            const query= {productName: parchase.productName, email: parchase.email};
            const exists= await parchaseCollection.findOne(query);
            if(exists){
               return res.send({success: false, parchase:exists})
            }
            const result =await parchaseCollection.insertOne(parchase);
            return res.send({success: true, result})
        })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Hello from server');
});

app.listen(port, ()=>{
    console.log('server is listening', port);
})