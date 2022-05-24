const express = require('express');
const app = express();
var jwt = require('jsonwebtoken');
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
        
        const userCollection = client.db('pcworldsdb').collection('users');


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

        app.get('/parchase', async (req, res)=>{
            const client = req.query.client;
            const query = {client: client};
            const parchases = await parchaseCollection.find(query).toArray();
            res.send(parchases);
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
        });

        app.put('/user/:email', async (req,res)=>{
            const email = req.params.email;
            const user = req.body;
            const filter = {email: email};
            const options = {upsert: true};
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            //const token = jwt.sign({email:email}, process.env.ACCESS_TOKEN,{ expiresIn: '1h' })
            res.send(result, token);
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