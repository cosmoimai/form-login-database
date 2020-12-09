const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require('fs')
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "form-one";

MongoClient.connect(
  connectionURL,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to the database");
    }

    console.log("Connected correctly");
    const db = client.db(databaseName);

  }
);


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// router.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/src/html/index.html'));
//   //__dirname : It will resolve to your project folder.
// });

// router.get('/about',function(req,res){
//   res.sendFile(path.join(__dirname+'/src/html/about.html'));
// });

// router.get('/sitemap',function(req,res){
//   res.sendFile(path.join(__dirname+'/src/html/sitemap.html'));
// });

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about", { title: "Hey", message: "Hello there!" });
});

router.get("/signup", (req, res) =>{
  res.render("signup")
})

router.use(bodyParser.json());

router.get("/users", (req, res)=> {
  console.log("hello");
  res.send("I have taken your data");
})

router.post("/users", urlencodedParser,(req, res) => {
  console.log(req.body);
  console.log(req.body.first_name);

  const content = {firstName: req.body.first_name, lastName: req.body.last_name, emailid: req.body.emailid, password: req.body.password}

  const loadcontent = JSON.stringify(content);

  //console.log(content);

  MongoClient.connect(
    connectionURL,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        return console.log("unable to connect to the database");
      }
  
      console.log("Connected correctly");
      const db = client.db(databaseName);
      ///////////////////////////////////
    db.collection("users").findOne(
      { Email_Id: req.body.emailid },
      (error, user) => {
        console.log(user);
        if (error) {
          
          return console.log("unable to fetch");
        }

        if(user=== null)
        {
          db.collection("users").insertOne(
            {
              First_Name: req.body.first_name,
              Last_Name: req.body.last_name,
              Email_Id: req.body.emailid,
              Password: req.body.password
            },
            (error, result) => {
              if (error) {
                return console.log("Unable to insert user");
              }
      
              console.log(result.ops);
            }
          );
          console.log("Enter Here");
        }
        else{
          console.log("Already signed up You have to Login");
        }
      }
    );
      ///////////////////////////////////


    }

  );

fs.appendFile('./test.txt', loadcontent, err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
})

  res.send("hello from the post");
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');