import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Home from './pages/Home';
import Video from './pages/Video';
import Upload from './pages/Upload';

export default function Routes() {
    return (
       <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/video/:id' component={Video} />
          <Route exact path='/upload' component={Upload} />
          <Route exact path='*' >
             <Container className="mt-3 mb-3">
                <Row>
                    <Col md={12}>
                        <h1>404 Page Not Found</h1>
                    </Col>
                </Row>
             </Container>
          </Route>
        </Switch>
      </BrowserRouter>
    )
}
