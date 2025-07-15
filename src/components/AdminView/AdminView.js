// src/components/AdminView/AdminView.js
import { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Card, Row, Col, ButtonGroup
} from 'react-bootstrap';
import { Notyf } from 'notyf';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './AdminView.css';

export default function AdminView() {
  const notyf = new Notyf();

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

  // Fetch all movies from backend
  const fetchAllMovies = () => {
    fetch('https://movie-catalog-api-zwov.onrender.com/movies/getMovies')
      .then(res => res.json())
      .then(data => {
        setMovies(Array.isArray(data.movies) ? data.movies : []);
      })
      .catch(() => notyf.error('Failed to fetch movies.'));
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDirector('');
    setYear('');
    setGenre('');
    setDescription('');
    setSelectedMovieId(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (movie) => {
    setIsEditing(true);
    setSelectedMovieId(movie._id);
    setTitle(movie.title);
    setDirector(movie.director);
    setYear(movie.year);
    setGenre(movie.genre);
    setDescription(movie.description);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !director || !year || !genre || !description) {
      notyf.error('Please fill in all fields.');
      return;
    }

    const movieData = { title, director, year, genre, description };

    const url = isEditing
      ? `https://movie-catalog-api-zwov.onrender.com/movies/updateMovie/${selectedMovieId}`
      : 'https://movie-catalog-api-zwov.onrender.com/movies/addMovie';

    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    })
      .then(res => res.json())
      .then(() => {
        notyf.success(isEditing ? 'Movie updated.' : 'Movie added.');
        fetchAllMovies();
        handleClose();
      })
      .catch(() => notyf.error('Server error.'));
  };

  const deleteMovie = (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      fetch(`https://movie-catalog-api-zwov.onrender.com/movies/deleteMovie/${movieId}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(() => {
          notyf.success('Movie deleted.');
          fetchAllMovies();
        })
        .catch(() => notyf.error('Failed to delete movie.'));
    }
  };

  return (
    <div className="dashboard-container p-4">
      <Card className="admin-card shadow-sm">
        <Card.Body>
          <Row className="mb-4">
            <Col className="text-end">
              <Button variant="primary" onClick={openAddModal} id="addMovie">
                ➕ Add New Movie
              </Button>
            </Col>
          </Row>

          <Table striped bordered responsive hover className="movie-table text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Description & Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map(movie => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.genre}</td>
                    <td className="text-start">
                      <div>{movie.description}</div>
                      <div className="mt-2">
                        <ButtonGroup size="sm">
                          <Button variant="warning" onClick={() => openEditModal(movie)}>
                            <FaEdit className="me-1" /> Edit
                          </Button>
                          <Button variant="danger" onClick={() => deleteMovie(movie._id)}>
                            <FaTrash className="me-1" /> Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted text-center">No movies found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Director</Form.Label>
              <Form.Control value={director} onChange={e => setDirector(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" value={year} onChange={e => setYear(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Genre</Form.Label>
              <Form.Control value={genre} onChange={e => setGenre(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="success" className="mt-2">
              {isEditing ? 'Update Movie' : 'Add Movie'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
