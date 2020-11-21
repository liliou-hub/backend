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

const port = process.env.PORT || 3000;
const app = express();

let usersRoutes = require('./controllers/users');
let productsRoutes = require('./controllers/products');

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/le_bon_plan",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);



app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

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
passport.use(
  new LocalStrategy(
    // User.authenticate()))
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      // console.log("email", email);
      console.log("password", password);
      console.log("done", done);
      try {
        const user = await User.findOne({ username })
        if (!user) return done(null, false);
        if (user.password == password)
          return done(null, user)

      } catch (err) {
        console.error(err);
        done(err)
      }
    }
  )
);




passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeProduct(Product.serializeProduct()); 
// passport.deserializeProduct(Product.deserializeProduct()); 


app.get("/", (req, res) => {
  console.log("GET /");
  res.render("home");
});


app.get("/profil", (req, res) => {
  console.log("GET /profil");
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("profil", {
      username: req.user.username,

    });
  } else {
    res.redirect("/");
  }
});

// app.get("/paris", async (req, res) => {

//     if (req.isAuthenticated()) {
//         res.redirect("/profil");
//     } else {
//         res.render("paris");
//     }
// });


// app.get("/lyon", (req, res) => {

//     if (req.isAuthenticated()) {
//         res.redirect("/profil");
//     } else {
//         res.render("lyon");
//     }
// });


// app.get("/marseille", (req, res) => {

//     if (req.isAuthenticated()) {
//         res.redirect("/profil");
//     } else {
//         res.render("marseille");
//     }
// });





app.get("/signup", async (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect("/profil");
  } else {
    res.render("signup");
  }
});

app.post("/signup", (req, res, next) => {
  const { username, password, firstname, surname } = req.body;
  User.create({
    username,
    password,

  }, (err, user) => {
    if (err) {
      return res.status(500).send(err)
    }
    next()
  })
}, passport.authenticate("local"), (req, res) => res.redirect("/profil"))




app.get("/login", (req, res) => {

  if (req.isAuthenticated()) {
    res.redirect("/profil");
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



app.post('/profil',
  body("username").isEmail(),
  body("password").isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
      res.json({
        errors: errors.array() // to be used in a json loop
      });
      return;
    } else {
      res.json({
        success: true,
        message: 'User will be saved'
      });
    }
  }
);

app.get("/logout", (req, res) => {

  req.logout();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});