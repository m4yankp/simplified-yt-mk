import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Loader from '../layout/Loader'
import { API_URL } from '../config'

export default function Video(video: any): JSX.Element {
  const vid = video.history.location.state
  return (
    <Container className="mt-3 mb-3">
      <Row>
        <Col md="12">
          {vid.id && (
            <Card>
              <video width="100%" height="100%" controls={true}>
                <source src={`${API_URL}/stream-video/${vid.id}`} type="video/mp4" />
              </video>
              <Card.Body>
                <Card.Title>{vid.name}</Card.Title>
                <Card.Text>{vid.description}</Card.Text>
              </Card.Body>
            </Card>
          )}
          {!vid.id && <Loader />}
        </Col>
      </Row>
    </Container>
  )
}
