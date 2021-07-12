const express = require("express");
const Animal = require("../models/animal");
const authenticate = require("../authenticate");
const cors = require("./cors");

const animalRouter = express.Router();

animalRouter
	.route("/")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Animal.find()
			.then((animals) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(animals);
			})
			.catch((err) => next(err));
	})
	.post(
		cors.corsWithOptions,
		//authenticate.verifyUser,
		//authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.create(req.body)
				.then((animal) => {
					console.log("Animal Created", animal);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(animal);
				})
				.catch((err) => next(err));
		}
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res) => {
			res.statusCode = 403;
			res.end(`PUT operation not supported on \animals`);
		}
	)
	.delete(cors.corsWithOptions, (req, res) => {
		res.statusCode = 403;
		res.end(`DELETE operation not supported on \animals`);
	});

animalRouter
	.route("/:animalId")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Animal.findById(req.params.animalId)
			.then((animal) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(animal);
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, (req, res) => {
		res.statusCode = 403;
		res.end(
			`POST operations not supported on /animals/${req.params.animalId}`
		);
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.findByIdAndUpdate(
				req.params.animalId,
				{
					$set: req.body
				},
				{ new: true }
			)
				.then((animal) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(animal);
				})
				.catch((err) => next(err));
		}
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.findByIdAndDelete(req.params.animalId)
				.then((response) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(response);
				})
				.catch((err) => next(err));
		}
	);

animalRouter
	.route("/:animalId/notes")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Animal.findById(req.params.animalId)
			.then((animal) => {
				if (animal) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(animal.notes);
				} else {
					err = new Error(`Animal ${req.params.animalId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch((err) => next(err));
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.findById(req.params.animalId)
				.then((animal) => {
					if (animal) {
						animal.notes.push(req.body);
						animal
							.save()
							.then((animal) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(animal);
							})
							.catch((err) => next(err));
					} else {
						err = new Error(`Animal ${req.params.animalId} not found`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		}
	)
	.put(cors.corsWithOptions, (req, res) => {
		res.statusCode = 403;
		res.end(
			`PUT operation not supported on /animals/${req.params.animalId}/notes`
		);
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.findById(req.params.animalId)
				.then((animal) => {
					if (animal) {
						for (let i = animal.notes.length - 1; i >= 0; i--) {
							animal.notes.id(animal.comments[i]).remove();
						}
						animal
							.save()
							.then((animal) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(animal);
							})
							.catch((err) => next(err));
					} else {
						err = new Error(`Animal ${req.params.animalId} not found`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		}
	);

animalRouter
	.route("/:animalId/notes/:notesId")
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Animal.findById(req.params.animalId)
			.then((animal) => {
				if (animal && animal.notes.id(req.params.notesId)) {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(animal.notes.id(req.params.notesId));
				} else if (!animal) {
					err = new Error(`Animal ${req.params.animalId} not found`);
					err.status = 404;
					return next(err);
				} else {
					err = new Error(`Comment ${req.params.notesId} not found`);
					err.status = 404;
					return next(err);
				}
			})
			.catch((err) => next(err));
	})
	.post(cors.corsWithOptions, (req, res, next) => {
		res.statusCode = 403;
		res.end(
			`POST operation not supported on /animals/${req.params.animalId}/notes/${req.params.notesId}`
		);
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(res, req, next) => {
			Animal.findById(req.params.animalId)
				.then((animal) => {
					if (animal && animal.notes.id(req.params.animalId)) {
						if (req.body.text) {
							animal.notes.id(req.params.notesId).text = req.body.text;
						}
						animal.save();
						then((animal) => {
							res.statusCode = 200;
							res.setHeader("Content-Type", "application/json");
							res.json(animal);
						}).catch((err) => next(err));
					} else if (!animal) {
						err = new Error(`Animal ${req.params.animalId} not found`);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(`Comment ${req.params.notesId} not found`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		}
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Animal.findById(req.params.animalId)
				.then((animal) => {
					if (animal && animal.notes.id(req.params.notesId)) {
						animal.notes.id(req.params.notesId).remove();
						animal
							.save()
							.then((animal) => {
								res.statusCode = 200;
								res.setHeader("Content-Type", "application/json");
								res.json(animal);
							})
							.catch((err) => next(err));
					} else if (!animal) {
						err = new Error(`Animal ${req.params.animalId} not found`);
						err.status = 404;
						return next(err);
					} else {
						err = new Error(`Note ${req.params.notesId} not found`);
						err.status = 404;
						return next(err);
					}
				})
				.catch((err) => next(err));
		}
	);

module.exports = animalRouter;
