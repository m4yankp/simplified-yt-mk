import React from 'react'
import { Navbar, Image, Nav } from 'react-bootstrap'

export default function Header(): JSX.Element {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">
        <Image src={'/shootsta-logo.png'} height={24} className="p5" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/Upload">Upload Video</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
