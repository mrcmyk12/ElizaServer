const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	firstname: {
		type: String,
		default: ""
	},
	lastname: {
		type: String,
		default: ""
	},
	admin: {
		type: Boolean,
		default: true
	}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
