const { UserInputError } = require("apollo-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();
const { Book, Author, User } = require("./models");

const AuthorResolver = {
  bookCount: async (root) => root.books.length,
};

const BookResolver = {
  author: async (root) => Author.findById(root.author.toString()),
};

const Query = {
  bookCount: () => async () => Book.collection.countDocuments(),
  authorCount: async () => Author.collection.countDocuments(),
  allAuthors: async () => Author.find({}),
  allBooks: async (root, args) => {
    const name = args.name;
    const genre = args.genre;

    let books;
    if (name && genre) {
      books = await Book.find({ name, genres: genre });
    } else if (name) {
      books = await Book.find({ name });
    } else if (genre) {
      books = await Book.find({ genres: genre });
    } else {
      books = await Book.find({});
    }

    return books;
  },
  me: async (root, args, context) => {
    if (!context.hasValidToken) throw new UserInputError("Invalid Credentials");
    const { hasValidToken: decodedUser } = context;

    const user = await User.findOne({ username: decodedUser.username });
    if (!user) throw new Error("User not found");

    return user.toJSON();
  },
};

const Mutation = {
  addBook: async (root, args, context) => {
    if (!context.hasValidToken) throw new UserInputError("Invalid Credentials");
    if (args.author.length < 4) {
      throw new UserInputError(
        "author name cannot be less than 4 characters long"
      );
      return null;
    }
    let author = await Author.findOne({ name: args.author });
    if (!author) {
      author = new Author({ name: args.author });
      author = await author.save();
    }
    try {
      const { title } = args;
      if (title.length < 2) {
        throw new UserInputError("title cannot be less than 2 characters long");
        return null;
      }
      const book = new Book({
        ...args,
        author: author._id,
      });
      const savedBook = await book.save();
      author.books = author.books.concat(savedBook._id);
      await author.save();

      pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
      return savedBook;
    } catch {
      Author.deleteOne({ name: args.author });
    }
  },
  editAuthor: async (root, args, context) => {
    if (!context.hasValidToken) throw new UserInputError("Invalid Credentials");

    const { name, setBornTo } = args;
    // find author
    const author = await Author.findOne({ name });
    // if author doesn't exist return null
    if (!author) return null;
    // if author exists update details and save
    author.born = setBornTo;
    const updatedAuthor = await author.save();
    return updatedAuthor;
  },
  createUser: async (root, args) => {
    const { username, password, ...rest } = args;
    if (!username || !password) {
      throw new UserInputError("Username and Password are both required");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, ...rest });
    const savedUser = await user.save();

    return savedUser;
  },
  login: async (root, args) => {
    const { username, password } = args;

    const user = await User.findOne({ username });
    passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!user || !passwordMatch)
      throw new UserInputError("Invalid credentials");

    const token = jwt.sign(user.toJSON(), "secret256", { expiresIn: "12h" });

    return { value: token };
  },
};
const resolvers = {
  Author: AuthorResolver,
  Book: BookResolver,
  Query,
  Mutation,
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]) },
  },
};

module.exports = resolvers;
