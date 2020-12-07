import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { API_URL } from '../config'
import Loader from '../layout/Loader'

export default function Upload(): JSX.Element {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('success')
  const fileHandler = (e: any): void => {
    if (e.target.files[0]) {
      setVideoFile((curr) => (curr = e.target.files[0]))
    }
  }
  const submitForm = async (e: any) => {
    e.preventDefault()
    if (title && description && videoFile) {
      setLoading((curr) => (curr = true))
      setError((curr) => (curr = 'success'))
      setMessage((curr) => (curr = ''))
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('video', videoFile)
      try {
        await fetch(`${API_URL}/uploadVideo`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setMessage((curr) => (curr = data.message))
            if (data.error) {
              setError((curr) => (curr = 'danger'))
            } else {
              setError((curr) => (curr = 'success'))
            }
            setLoading((curr) => (curr = false))
            resetForm()
          })
      } catch (err: any) {
        setLoading((curr) => (curr = false))
        setMessage((curr) => (curr = 'An error occurred'))
        resetForm()
      }
    } else {
      setMessage((curr) => (curr = 'Please complete the form, all fields are mandatory!'))
      setError((curr) => (curr = 'danger'))
    }
  }
  const resetForm = (): void => {
    setTitle('')
    setDescription('')
  }
  return (
    <Container className="mt-3 mb-3">
      <Row>
        <Col md="12">
          {message && <Alert data-testid="alert" variant={error}>{message}</Alert>}
          <Form>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Video Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="title"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicUploadVideo">
              <Form.Label>Select Video File</Form.Label>
              <Form.Control type="file" name="video" onChange={(e) => fileHandler(e)} data-testid="videoFile" />
              <Form.Text className="text-muted">
                Please make sure you upload a .mp4 file with maximum 100 mb size.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Label>Video Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Video Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="description"
              />
            </Form.Group>
            {!loading && (
              <Button variant="primary" type="submit" data-testid="submitBtn" onClick={(e) => submitForm(e)}>
                Upload Video
              </Button>
            )}
            {loading && <Loader />}
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
