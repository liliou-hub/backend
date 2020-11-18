const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models").User; // same as: const User = require('./models/user');
const age = require("./age")

const port = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/authentication_exercise",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);

const app = express();

// Express configuration

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable session management
app.use(
  expressSession({
    secret: "konexioasso07",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID

app.get("/", (req, res) => {
  console.log("GET /");
  res.render("home");
});


app.get("/admin", (req, res) => {
  console.log("GET /admin");
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("admin", {
      firstname: req.user.firstname,
      surname: req.user.surname,
      date: age(req.user.date),
    });
  } else {
    res.redirect("/");
  }
});





app.get("/signup", (req, res) => {
  console.log("GET /signup");
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("signup");
  }
});

app.post("/signup", (req, res) => {
  console.log("POST /signup");
  // create a user with the defined model with
  // req.body.username, req.body.password

  // WITHOUT PASSPORT

  // const username = req.body.username;
  // const password = req.body.password;

  // User.findOne({username: username}, (user) => {
  //   if (user === null) {
  //     const newUser = new User({
  //       username: username,
  //       password: password,
  //     });
  //     newUser.save((err, obj) => {
  //       if (err) {
  //         console.log('/signup user save err', err);
  //         res.render('500');
  //       } else {
  //         // Save a collection session with a token session and
  //         // a session cookie in the browser
  //       }
  //     });
  //   }
  // });

  console.log("will signup");

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const firstname = req.body.firstname;
  const surname = req.body.surname;
  const date = req.body.date;



  User.register(
    new User({
      username: username,
      email: email,
      password: password,
      confirm_password: confirm_password,
      firstname: firstname,
      surname: surname,
      date: date,

    }),
    password, // password will be hashed
    (err, user) => {
      if (password !== confirm_password) {
        console.log("/signup user register err", err);
        return res.render("signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/admin");
        });
      }
    }
  );
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("login");
  }
});




app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",


    failureRedirect: "/login"
  })
);

// Without Passport

// app.post("/login", (req, res) => {
//   const md5 = require("md5"); // there for education purpose, if using this method, put it in the top of your file
//   User.find(
//     {
//       username: req.body.username,
//       password: md5(req.body.password)
//     },
//     (users) => {
//       // create a session cookie in the browser
//       // if the password is good
//       // and redirect to /admin
//     }
//   );
//   res.send("login");
// });

app.get("/logout", (req, res) => {
  console.log("GET /logout");
  req.logout();
  res.redirect("/");
});



// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });              
//      req.session.passport.username = {id: username._id}
//            console.log('heyyy',req.session.passport.username);
// passport.deserializeUser(function(id, done) {

//   User.findById(id, function(err, username) {
//       done(err, username);
//   });              
// });




app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
