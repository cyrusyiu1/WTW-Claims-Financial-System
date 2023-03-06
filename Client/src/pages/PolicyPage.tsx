import React from 'react'
import Policy from '../components/Policy'
import { Col, Container, Row } from 'react-bootstrap';

export default function PolicyPage() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Policy></Policy>
        </Row>
      </Container>
    </div>
  )
}
