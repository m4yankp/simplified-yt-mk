import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import VideoCard from '../components/VideoCard'
import Loader from '../layout/Loader'
import { Store } from '../Store'
import { API_URL } from '../config'

export default function Home(): JSX.Element {
  const { state, dispatch } = useContext(Store)
  const [isLoading, setLoading] = useState(false)
  const [isNoVideo, setisNoVideo] = useState(false)

  // Fetch Videos Data
  const fetchVideosData = async () => {
    setLoading((curr) => (curr = true))
    const URL: string = `${API_URL}/allVideos`
    const data = await fetch(URL)
    const dataJSON = await data.json()
    setLoading((curr) => (curr = false))
    if(dataJSON.data)
    {
      return dispatch({
        type: 'FETCH_VIDEOS',
        payload: dataJSON.data,
      })
    } else {
      setisNoVideo((curr) => curr = true);
    }
  }
  useEffect(() => {
    Object.keys(state.allVideos).length === 0 && fetchVideosData()
  }, [state.allVideos])
  return (
    <Container className="mt-3 mb-3">
      <Row>
        {isNoVideo && <Col md={12} className="mb-2 mt-2" ><Alert data-testid="alert" variant="danger">No video in database please upload a video</Alert></Col>}
        {!isLoading && !isNoVideo && 
          Object.keys(state.allVideos).map((key, index) => {
            const video = state.allVideos[key]
            return (
              <Col md={4} className="mb-2 mt-2" key={key}>
                <VideoCard video={video} />
              </Col>
            )
          })}
        {isLoading && <Loader />}
      </Row>
    </Container>
  )
}
