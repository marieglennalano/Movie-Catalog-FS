import React from 'react';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="home-section">
      <Container className="text-center">
        <h1 className="mb-4">🎬 Movie Catalog</h1>
        <p className="mb-5">Discover and review your favorite Marvel movies!</p>

        {/* Carousel */}
        <div className="carousel-wrapper mb-4">
          <Carousel fade interval={3000} controls={false} indicators={true}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SL1500_.jpg"
                alt="Captain America: The First Avenger"
              />
              <Carousel.Caption>
                <h5>Captain America</h5>
                <p>The origin story of the First Avenger.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://m.media-amazon.com/images/I/81lEJfQ7C8L._AC_UF1000,1000_QL80_.jpg"
                alt="Iron Man"
              />
              <Carousel.Caption>
                <h5>Iron Man</h5>
                <p>The beginning of the Marvel Cinematic Universe.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SL1500_.jpg"
                alt="Avengers: Endgame"
              />
              <Carousel.Caption>
                <h5>Avengers: Endgame</h5>
                <p>The epic conclusion of the Infinity Saga.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>

        {/* Browse Button directly under carousel */}
        <div className="mb-5">
          <Button
            variant="light"
            size="lg"
            className="browse-button"
            onClick={() => navigate('/movies')}
          >
            🎥 Browse Movies
          </Button>
        </div>

        {/* Features Section */}
        <h2 className="feature-heading mt-5">📌 Why Movie Catalog?</h2>
        <Row className="feature-grid justify-content-center">
          <Col md={4} className="mb-4">
            <Card className="feature-card p-3 h-100 text-center">
              <h5>Track Movies</h5>
              <p>Easily manage your watchlist and favorite titles.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="feature-card p-3 h-100 text-center">
              <h5>Write Reviews</h5>
              <p>Share your thoughts and see what others think.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="feature-card p-3 h-100 text-center">
              <h5>Discover Classics</h5>
              <p>Explore curated picks and hidden gems.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
