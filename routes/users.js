var express = require("express");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const authenticate = require("../authenticate");
const cors = require("./cors");

/* GET users listing. */
router
	.route("/")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, (req, res, next) => {
		User.find()
			.then((users) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(users);
			})
			.catch((err) => next(err));
	});

router
	.route("/asignup")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, (req, res, next) => {
		User.register(
			new User({ username: req.body.username }),
			req.body.password,
			(err, user) => {
				if (err) {
					res.statusCode = 500;
					res.setHeader("Content-Type", "application/json");
					res.json({ err: err });
				} else {
					if (req.body.firstname) {
						user.firstname = req.body.firstname;
					}
					if (req.body.lastname) {
						user.lastname = req.body.lastname;
					}
					user.save((err) => {
						if (err) {
							res.statusCode = 500;
							res.setHeader("Content-Type", "application/json");
							res.json({ err: err });
							return;
						}
						passport.authenticate("local")(req, res, () => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json({
								success: true,
								status: "Registration Successful"
							});
						});
					});
				}
			}
		);
	});

router
	.route("/alogin")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.post(cors.corsWithOptions, passport.authenticate("local"), (req, res) => {
		const token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json({
			success: true,
			token: token,
			status: "You are successfully logged in!"
		});
	});

router
	.route("/alogout")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.corsWithOptions, (req, res, next) => {
		if (req.session) {
			req.session.destroy();
			res.clearCookie("session-id");
			res.redirect("/");
		} else {
			const err = new Error("You are not logged in!");
			err.status = 401;
			return next(err);
		}
	});

module.exports = router;