
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
  
  async show(req, res){
    const { id } = req.params;

    const movie_notes = await knex("movie_notes").where({ id }).first();
    const movie_tags = await knex("movie_tags").where({ movie_note_id: id }).orderBy("name");

    return res.json({
      ...movie_notes,
      movie_tags,
    });
  }

  async delete(req, res){
    const { id } = req.params;

    await knex("movie_notes").where({ id }).delete();

    return res.json();
  }

  async index(req,res){
    const { title, user_id, tags } = req.query;

    let movieNotesTags;

    if(tags){
      const filterMovieTags = tags.split(",").map((tag) => tag.trim());

      movieNotesTags = await knex("movie_tags")
      .select([
        "movie_notes.id",
        "movie_notes.title",
        "movie_notes.user_id",
      ])
      .where("movie_notes.user_id", user_id)
      .whereLike("movie_notes.title", `%${title}%`)
      .whereIn("movie_tags.name", filterMovieTags)
      .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_note_id")
      .orderBy("movie_notes.title");
    } else {
      movieNotesTags = await knex("movie_notes")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const movieNotesWithTags = movieNotesTags.map(movieNote => {
      const movieNotesTags = userTags.filter(userTag => userTag.movie_note_id === movieNote.id);
      
      return{
        ...movieNote,
        tags: movieNotesTags
      }
    })

    return res.json(movieNotesWithTags);
  }
}

module.exports = MovieNotesController;