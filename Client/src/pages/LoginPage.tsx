import React from 'react'
import Login from '../components/Login'
import { Col, Container, Row } from 'react-bootstrap';

export default function LoginPage() {
  return (
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} xl={4} className="my-5">
            <Login></Login>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
