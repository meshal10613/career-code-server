require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port ||3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running....')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@meshal10613.mbbtx0s.mongodb.net/?retryWrites=true&w=majority&appName=meshal10613`;

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

        const jobsCollection = client.db("careerCode").collection("jobs");
        const applicationCollection = client.db("careerCode").collection("applications");

        //jobs
        app.get("/jobs", async(req, res) => {
            const result = await jobsCollection.find().toArray();
            res.send(result);
        });

        app.get("/jobs/:id", async(req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        });

        //applications
        app.get("/applications", async(req, res) => {
            const email = req.query.email;
            let query = {};
            if(email){
                query = {
                    applicant: email
                };
            }
            const result = await applicationCollection.find(query).toArray();

            for(const application of result){
                const jobId = application.jobId;
                const jobquery = { _id: new ObjectId(jobId) };
                const job = await jobsCollection.findOne(jobquery);
                application.company = job.company;
                application.title = job.title;
                application.company_logo = job.company_logo;
            }

            res.send(result);
        });

        app.post("/applications", async(req, res) => {
            const application = req.body;
            const result = await applicationCollection.insertOne(application);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});