import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
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

  const addMovie = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title || !director || !year || !genre || !description) {
      notyf.error('Please fill in all fields.');
      return;
    }

    const movieData = {
      title: title.trim(),
      director: director.trim(),
      year: parseInt(year),
      genre: genre.trim(),
      description: description.trim()
    };

    try {
      const response = await fetch('https://movie-catalog-api-zwov.onrender.com/movies/addMovie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(movieData)
      });

      const data = await response.json();

      if (response.ok) {
        notyf.success('Movie added successfully!');
        fetchAllMovies();
        handleClose();
      } else {
        notyf.error(data.message || 'Failed to add movie.');
      }
    } catch (err) {
      console.error('Error:', err);
      notyf.error('Server error while adding movie.');
    }
  };

  const handleUpdateMovie = (e) => {
  e.preventDefault();

  if (!title || !director || !year || !genre || !description) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill in all fields.',
    });
    return;
  }

  const updatedMovie = {
    title: title.trim(),
    director: director.trim(),
    year: parseInt(year),
    genre: genre.trim(),
    description: description.trim(),
  };

    const token = localStorage.getItem('token');
    const movieId = editingMovie?._id;

    // ✅ Debug log to make sure ID exists
    console.log("Updating Movie ID:", movieId);

    fetch(`https://movie-catalog-api-zwov.onrender.com/movies/updateMovie/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ Make sure token is added
      },
      body: JSON.stringify(updatedMovie),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Update response:", data); // ✅ Debug log

        if (data.movie) {
          Swal.fire({
            icon: 'success',
            title: 'Movie Updated',
            text: `${data.movie.title} has been updated successfully!`,
            timer: 2000,
            showConfirmButton: false,
          });
          fetchAllMovies();
          handleClose();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: data.message || 'Unknown error occurred.',
          });
        }
      })
      .catch(err => {
        console.error("Error during update:", err);
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: err.message || 'Something went wrong.',
        });
      });
  };

  const deleteMovie = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Delete this movie?')) {
      fetch(`https://movie-catalog-api-zwov.onrender.com/movies/deleteMovie/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
              <Button variant="primary" onClick={() => handleShow()} id="addMovie">➕ Add New Movie</Button>
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
                movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.genre}</td>
                    <td className="text-start">
                      <div style={{ whiteSpace: 'pre-line' }}>{movie.description}</div>
                      <div className="mt-2">
                        <ButtonGroup size="sm">
                          <Button variant="warning" onClick={() => handleShow(movie)}>
                            <FaEdit /> Edit
                          </Button>
                          <Button variant="danger" onClick={() => deleteMovie(movie._id)}>
                            <FaTrash /> Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted">No movies found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMovie ? 'Edit Movie' : 'Add Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editingMovie ? handleUpdateMovie : addMovie}>
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
