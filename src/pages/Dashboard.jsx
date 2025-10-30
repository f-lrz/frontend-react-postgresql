import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import MovieForm from '../components/MovieForm';
import MovieItem from '../components/MovieItem';

const Dashboard = () => {
  const { logout } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null); // Para saber qual filme estamos editando 
  const [showForm, setShowForm] = useState(false);

  // Filtros
  const [genre, setGenre] = useState('');
  const [watched, setWatched] = useState(null); // null, true, false

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      // Constrói os parâmetros de filtro
      const params = {};
      if (genre) params.genre = genre;
      if (watched !== null) params.watched = watched;

      const response = await api.get('/movies', { params });
      setMovies(response.data);
    } catch (error) {
      toast.error('Erro ao buscar filmes');
    } finally {
      setLoading(false);
    }
  }, [genre, watched]); // Recarrega quando os filtros mudam

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSaveMovie = async (movieData) => {
    try {
      if (editingMovie) {
        // Atualização (PATCH para parcial, PUT para completo)
        // Seu backend usa PATCH
        const response = await api.patch(`/movies/${editingMovie.id}`, movieData);
        toast.success('Filme atualizado com sucesso!');
        setMovies(movies.map((m) => (m.id === editingMovie.id ? response.data : m)));
      } else {
        // Criação
        const response = await api.post('/movies', movieData);
        toast.success('Filme cadastrado com sucesso!');
        setMovies([...movies, response.data]);
      }
      closeForm();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar filme');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este filme?')) {
      try {
        await api.delete(`/movies/${id}`); //
        toast.success('Filme deletado com sucesso!');
        setMovies(movies.filter((m) => m.id !== id));
      } catch (error) {
        toast.error('Erro ao deletar filme');
      }
    }
  };

  const openEditForm = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingMovie(null);
    setShowForm(true);
  };
  
  const closeForm = () => {
    setEditingMovie(null);
    setShowForm(false);
  }

  return (
    <div className="dashboard-container">
      <header>
        <h1>Minha Lista de Filmes</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="controls">
        <button onClick={openCreateForm}>
          Adicionar Novo Filme
        </button>
        <div className="filters">
          <input 
            type="text"
            placeholder="Filtrar por gênero..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <select onChange={(e) => setWatched(e.target.value === '' ? null : e.target.value === 'true')}>
            <option value="">Todos</option>
            <option value="true">Assistidos</option>
            <option value="false">Não Assistidos</option>
          </select>
        </div>
      </div>

      {showForm && (
        <MovieForm 
          movie={editingMovie} 
          onSave={handleSaveMovie} 
          onCancel={closeForm}
        />
      )}

      <div className="movie-list">
        {loading && <p>Carregando filmes...</p>}
        {!loading && movies.length === 0 && <p>Nenhum filme cadastrado.</p>}
        {movies.map((movie) => (
          <MovieItem
            key={movie.id}
            movie={movie}
            onEdit={openEditForm}
            onDelete={handleDeleteMovie}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;