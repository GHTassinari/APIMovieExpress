const knex = require("../database/knex");

class MovieTagsController {
  async index(req, res){
    const { user_id } = req.params;

    const movieTags = await knex("movie_tags")
    .where({ user_id })

    return res.json(movieTags);
  }
}

module.exports = MovieTagsController;