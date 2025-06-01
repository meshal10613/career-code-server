require('dotenv').config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.port ||3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

var admin = require("firebase-admin");
var serviceAccount = require("./firebase-admin-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const logger = (req, res, next) => {
    console.log("Inside the logger middleware");
    next();
};

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    // console.log('cookie', token);
    if(!token){
        return res.status(401).send({message: 'unauthorized access'});
    };
    //verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).send({ message: 'unauthorized access' })
        }
        // console.log(decoded)
        res.decoded = decoded;
        next();
    })
};

const verifyFirebaseToken = async(req, res, next) => {
    const token = req?.headers?.authorization
    // console.log("firebase token",token);
    if(!token){
        return res.status(401).send({message: "unauthorized access"})
    }
    const userInfo = await admin.auth().verifyIdToken(token);
    req.tokenEmail = userInfo.email;
    next();
};


app.get('/', (req, res) => {
    res.send('Server is running....');
    next();
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

        //jwt token related api
        app.post("/jwt", async(req, res) => {
            const {email} = req.body;
            const user = {email};
            const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "10d"});

            //set token in the cookies
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,

            })

            res.send(token);
        });

        //jobs
        app.get("/jobs", async(req, res) => {
            const email = req.query.email;
            let query = {};
            if(email){
                query = {
                    hr_email: email
                }
            };

            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        });
        
        app.get("/jobs/applications", async(req, res) => {
            const email = req.query.email;
            const query = {
                hr_email: email
            };
            const result = await jobsCollection.find(query).toArray();

            //should use aggregate
            for(const job of result){
                const applicationQuery = {
                    jobId: job._id.toString()
                };
                const applicationCount = await applicationCollection.countDocuments(applicationQuery);
                job.applicationCount = applicationCount;
            }

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

        app.post("/jobs", async(req, res) => {
            const jobs = req.body;
            const result = await jobsCollection.insertOne(jobs);
            res.send(result);
        })

        //applications
        app.get("/applications", logger, verifyToken, verifyFirebaseToken, async(req, res) => {
            const email = req.query.email;

            if(email !== req.tokenEmail){
                return res.status(403).send({message: "forbiden access"})
            };

            let query = {};
            if(email){
                query = {
                    applicant: email
                };
            };
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

        app.get("/applications/job/:id", async(req, res) => {
            const id = req.params.id;
            const query = {jobId: id};
            const result = await applicationCollection.find(query).toArray();
            res.send(result);
        });

        app.post("/applications", async(req, res) => {
            const application = req.body;
            const result = await applicationCollection.insertOne(application);
            res.send(result);
        });

        app.patch("/applications/:id", async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const updatedDoc = {
                $set: {
                    status: req.body.status
                }
            };
            const result = await applicationCollection.updateOne(filter, updatedDoc);
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