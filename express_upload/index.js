const express = require("express");
const exphbrs = require("express-handlebars");
const multer = require("multer");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/upload", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});


var storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        // console.log('file multer diskstorage', file);
        //   cb(null, file.originalname)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})

var upload = multer({ storage: storage })



app.set("view engine", "handlebars");

app.engine("handlebars", exphbrs());

app.get("/", (req, res) => {
    res.render("home", {
        title: "New user",
    });
});

const uploadSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
    },
    firstName: String,
    surname: String,
    profilePicture: String,
});

const User = mongoose.model("User", uploadSchema);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.post("/upload", upload.single("avatar"), async (req, res, next) => {
    let uservar = req.body.username;

    const newUser = await User.create({
        username: uservar,
        profilePicture: req.file.filename,
    });

    console.log('newuser', newUser)

    res.render("uploadadd", {
        username: uservar,
        id: newUser._id
    });

});

app.get("/users/:id/", (req, res) => {
    let result = User.findById(req.params.id, function (err, result) {
        console.log('lelele', result)

        res.render("userspage", {
            username: result.username,
            profilePicture: result.profilePicture,
        });
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});