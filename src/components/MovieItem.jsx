import React from 'react';

const MovieItem = ({ movie, onEdit, onDelete }) => {
  return (
    <div className="movie-item">
      <h3>{movie.title} ({movie.year || 'N/A'})</h3>
      <p><strong>Diretor:</strong> {movie.director || 'N/A'}</p>
      <p><strong>Gênero:</strong> {movie.genre || 'N/A'}</p>
      <p><strong>Nota:</strong> {movie.rating !== undefined ? movie.rating : 'N/A'} / 10</p>
      <p><strong>Status:</strong> {movie.watched ? 'Assistido' : 'Não assistido'}</p>
      <div className="item-buttons">
        <button onClick={() => onEdit(movie)} className="btn-edit">
          Editar
        </button>
        <button onClick={() => onDelete(movie.id)} className="btn-delete">
          Deletar
        </button>
      </div>
    </div>
  );
};

export default MovieItem;