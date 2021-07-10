const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
	author: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	text: {
		type: String,
		required: true
	}
});

const animalSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		species: {
			type: String,
			required: true
		},
		foodlikes: {
			type: [String]
		},
		fooddislikes: {
			type: [String]
		},
		image: {
			type: String,
			required: true
		},
		lastfed: {
			type: Date,
			default: Date.now
		},
		habitatreq: {
			type: [String]
		},
		datehome: {
			type: Date
		},
		datedeceased: {
			type: Date
		},
		notes: [notesSchema]
	},
	{
		timestamps: true
	}
);

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
