import React, { useState, useEffect } from 'react';

// O schema do filme
const MovieForm = ({ movie, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [watched, setWatched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setDirector(movie.director || '');
      setGenre(movie.genre || '');
      setYear(movie.year || '');
      setRating(movie.rating || '');
      setWatched(movie.watched || false);
    } else {
      // Reseta o form se for para criação
      setTitle('');
      setDirector('');
      setGenre('');
      setYear('');
      setRating('');
      setWatched(false);
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const movieData = {
      title,
      director,
      genre,
      // Converte para número, se não for vazio
      year: year ? Number(year) : undefined, 
      rating: rating ? Number(rating) : undefined,
      watched,
    };
    
    await onSave(movieData);
    setLoading(false);
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="movie-form">
        <h3>{movie ? 'Editar Filme' : 'Adicionar Filme'}</h3>
        <input
          type="text"
          placeholder="Título (obrigatório)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Diretor"
          value={director}
          onChange={(e) => setDirector(e.target.value)}
        />
        <input
          type="text"
          placeholder="Gênero"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ano"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nota (0-10)"
          min="0"
          max="10"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={watched}
            onChange={(e) => setWatched(e.target.checked)}
          />
          Já assisti
        </label>
        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;