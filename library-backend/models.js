const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, minLength: 2 },
  phone: String,
  published: Number,
  genres: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minLength: 4 },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  born: { type: Number },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 4 },
  favoriteGenre: String,
  passwordHash: String,
});

UserSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;

    return returnedObj;
  },
});

exports.Book = mongoose.model("Book", BookSchema);
exports.Author = mongoose.model("Author", AuthorSchema);
exports.User = mongoose.model("User", UserSchema);
