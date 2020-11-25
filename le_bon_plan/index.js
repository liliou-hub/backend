const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");

const { session } = require("passport");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models").User; // same as: const User = require('./models/user');
const Product = require("./models").Product;
const bodyParser = require('body-parser');
const expressValidator = require("express-validator");
const validationResult = expressValidator.validationResult;
const body = expressValidator.body;
const multer = require("multer");
// const upload = multer({ dest: 'public/uploads/' });

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, Date.now() + ext);
  },
});

let upload = multer({ storage: storage });

const port = process.env.PORT || 3000;
const app = express();


let usersRoutes = require('./controllers/users');
let productsRoutes = require('./controllers/products');

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);


mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/le_bon_plan",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

app.engine("handlebars", exphbs({
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set("view engine", "handlebars");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// enable session management
app.use(
  expressSession({
    secret: "konexioasso07",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// enable Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeProduct(Product.serializeProduct()); 
// passport.deserializeProduct(Product.deserializeProduct()); 


app.get("/", (req, res) => {
  // console.log("GET /");
  res.render("home", {
    isLog: req.isAuthenticated(),
    username: req.user ? req.user.username : null,
    profilPicture: req.user ? req.user.profilPicture : null,

  });
});



app.get("/profil", (req, res) => {
  // console.log("GET /profil");
  if (req.isAuthenticated()) {
    // console.log(req.user);
    res.render("profil", {
      username: req.user.username,
      firstname: req.user.firstname,
      surname: req.user.surname,
      isLog: req.isAuthenticated(),
      profilPicture: req.user.profilPicture
    });
  } else {
    res.redirect("/");
  }
});

app.get("/paris", async (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect("/profil");
  } else {
    res.render("paris");
  }
});


app.get("/lyon", (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect("/profil");
  } else {
    res.render("lyon");
  }
});


app.get("/marseille", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/profil");
  } else {
    res.render("marseille");
  }
});





app.get("/signup", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("signup");
  }
});



app.post("/signup", upload.single("avatar"), async (req, res, next) => {
  console.log('req.body', req.body);
  const { username, surname, password, firstname } = req.body;
  User.register(
    new User({
      username,
      surname,
      password,
      firstname,
      profilePicture: req.file.filename,
    }),
    password, // password will be hashed
    (err, user) => {
      if (err) {
        console.log("/signup user register err", err);
        return res.render("signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/profil");
        });
      }
    }
  );
});



app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
});

app.get("/login", (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect("/profil", {
    });
  } else {
    res.render("login");
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/profil",
  failureRedirect: "/login",
}), (req, res) => {
  console.log('un message');
}
);


app.get("/admin", (req, res) => {
  // console.log('GET/admin');
  if (req.isAuthenticated()) {
    res.render("admin", {
      isLog: req.isAuthenticated(),
      username: req.user.username,
      profilPicture: req.user.profilPicture
    });
  } else {
    res.redirect("home");
  }
});


app.post("/admin", upload.single("avatar"), async (req, res, next) => {
  console.log('req.body', req.body);
  const { productName, productPrice, tagProduct } = req.body;

  Product.register(
    new Product({
      productName,
      productPrice,
      productPicture: req.file.filename,
      tagProduct,
      isLog: req.isAuthenticated(),
    }),
    (err, product) => {
      console.log("/signup Product register err", err);
      res.render("/products");
    }
  );
});



app.get("/logout", (req, res) => {

  req.logout();
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});