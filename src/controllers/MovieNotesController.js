
const knex = require("../database/knex");

class MovieNotesController {
  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const { user_id } = req.params;

    const [movie_note_id] = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const movieTagsInsert = tags.split(',').map((name) => {
      return {
        movie_note_id,
        name,
        user_id,
      };
    });

    await knex("movie_tags").insert(movieTagsInsert);

    res.json();
  }
}

module.exports = MovieNotesController;