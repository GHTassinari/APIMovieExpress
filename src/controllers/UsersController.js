const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(req, res){
    const { name, email, password } = req.body;

    const database = await sqliteConnection();

    const checkUserExists = await database.get("SELECT * FROM users where email = (?)", [email]);

    if(checkUserExists){
      throw new AppError ("This email is already being used");
    }

    const hashedPassword = await hash(password, 8);
    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    return res.status(201).json();
  }
}

module.exports = UsersController;