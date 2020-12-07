import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { API_URL } from '../config'
import { useHistory } from 'react-router-dom'

export default function VideoCard(video: any): JSX.Element {
  const history = useHistory()
  return (
    <Card>
      <Card.Img variant="top" src={`${API_URL}/${video.video.thumbnailPath}`} />
      <Card.Body>
        <Card.Title data-testid="title">{video.video.name}</Card.Title>
        <Card.Text data-testid="description">{video.video.description}</Card.Text>
        <Button
          data-testid="playbtn"
          variant="primary"
          onClick={() => history.push(`video/${video.video.id}`, video.video)}
        >
          Play Video
        </Button>
      </Card.Body>
    </Card>
  )
}
