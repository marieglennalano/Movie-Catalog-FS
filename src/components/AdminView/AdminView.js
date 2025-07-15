import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import './AdminView.css';

export default function AdminView() {
  const notyf = new Notyf();

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');

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

  const handleShow = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setTitle(movie.title);
      setDirector(movie.director);
      setYear(movie.year);
      setGenre(movie.genre);
      setDescription(movie.description);
    } else {
      setEditingMovie(null);
      setTitle('');
      setDirector('');
      setYear('');
      setGenre('');
      setDescription('');
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingMovie(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !director || !year || !genre || !description) {
      notyf.error('Please fill in all fields.');
      return;
    }

    const movieData = {
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year),
      genre: genre.trim(),
      description: description.trim(),
      comments: [] // ✅ Required by backend schema
    };

    const endpoint = editingMovie
      ? `https://movie-catalog-api-zwov.onrender.com/movies/updateMovie/${editingMovie._id}`
      : 'https://movie-catalog-api-zwov.onrender.com/movies/addMovie';

    const method = editingMovie ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData)
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          notyf.success(editingMovie ? 'Movie updated.' : 'Movie added.');
          fetchAllMovies();
          handleClose();
        } else {
          throw new Error('Movie not saved');
        }
      })
      .catch((err) => {
        console.error('🔥 Error:', err);
        notyf.error('Server error. Failed to add movie.');
      });
  };

  const deleteMovie = (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      fetch(`https://movie-catalog-api-zwov.onrender.com/movies/deleteMovie/${movieId}`, {
        method: 'DELETE',
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
    <div className="dashboard-container">
      <Card className="admin-card">
        <Card.Body>
          <Row className="mb-4">
            <Col className="text-end">
              <Button variant="primary" onClick={() => handleShow()} id="addMovie">Add New Movie</Button>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="movie-table">
            <thead className="table-dark text-center">
              <tr>
                <th>Title</th>
                <th>Director</th>
                <th>Year</th>
                <th>Genre</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.description}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleShow(movie)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteMovie(movie._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No movies found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Movie Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMovie ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Director</Form.Label>
              <Form.Control value={director} onChange={e => setDirector(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control type="number" value={year} onChange={e => setYear(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control value={genre} onChange={e => setGenre(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
