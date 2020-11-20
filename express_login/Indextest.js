const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models").User; // same as: const User = require('./models/user');
const age = require("./age");

const port = process.env.PORT || 3001;

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/authentication_exercise",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration


User.validPassword = function (password) {
  // console.log("Validate password", password);
};
// logo.validPassword(""); // -> message: 'Validate password',''

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!User.validPassword()) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// passport.use(
//     new LocalStrategy(
//       // User.authenticate()))
//       {
//         usernameField: "email",
//         passwordField: "password",
//       },
//       async (email, password, done) => {
//         console.log("email", email);
//         console.log("password", password);
//         console.log("done", done);
//         try {
//           await User.findOne({ email }, function (err, user) {
//             if (err) return done(err);
//             if (!User) return done(null, false);
//           });
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     )
//   );


// passport.use(new LocalStrategy(
//   // (User.authenticate()))
//     {
//       email: "email",
//       password: "password",
//     },
//     async (email, password, done) => {
//       console.log("email", email);
//       console.log("password", password);
//       console.log("done", done);
//       try {
//         await User.findOne({ email }, function (err, user) {
//           if (err) return done(err);
//           if (!User) return done(null, false);
//           // passwordHash.compare(password, User.password, function (err, res) {
//           //   if (err) return done(err);
//           //   if (!res) return done(null, false);
//           //   done(null, user);
//           // });
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   )
// );
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
      surname: req.user.surname,
      firstname: req.user.firstname,
      date: age(req.user.date),
    });
  } else {
    res.redirect("/");
  }
});

app.get("/signup", async (req, res) => {
  // console.log("GET /signup");
  console.log('requettttte', req);
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("signup");
  }
});

app.post("/signup", async (req, res) => {
  // console.log(2);

  console.log("POST /signup");
  // create a user with the defined model with
  // req.body.username, req.body.password
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
    password,
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
  // console.log('APPPOST', passport.authenticate),
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  }), (req, res) => {
    console.log('un message');
  }
);

app.get("/logout", (req, res) => {
  // console.log("GET /logout", req);
  req.logout();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
