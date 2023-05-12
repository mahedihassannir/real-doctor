const express = require("express")

const app = express()

const port = process.env.PORT || 5000

const cors = require("cors")

app.use(cors())

app.use(express.json())

require("dotenv").config();



// here is mongo db connecting 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_EMAIL}:${process.env.DB_PASS}@cluster0.iqgllty.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        let UserDb = client.db("usersInformations").collection("information")


        // here is the making cursor for the users post data


        app.get("/users", async (req, res) => {

            let cursor = UserDb.find()

            const result = await cursor.toArray()

            res.send(result)

        })


        // here is user post method
        app.post('/users', async (req, res) => {

            let user1 = req.body

            console.log(user1);

            let result = await UserDb.insertOne(user1)

            res.send(result)



        })

        // here is details method

        app.get("/users/:id", async (req, res) => {


            let id = req.params.id

            let query = { _id: new ObjectId(id) }



            let options = {
                projection: { title: 1, img: 1, price: 1, description: 1,_id:1 }
            }

            let result = await UserDb.findOne(query, options)

            res.send(result)


        })

        // here is delete method

        app.delete('/users/:id', async (req, res) => {

            let id = req.params.id

            let query = { _id: new ObjectId(id) }

            let result = await UserDb.deleteOne(query)

            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// here is mongo db connecting ends 


app.get('/', (req, res) => {

    res.send("real server is running")

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})