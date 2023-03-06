import React from 'react'
import PolicyList from '../components/PolicyList'
import { Col, Container, Row } from 'react-bootstrap';

export default function PolicyListPage() {
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <PolicyList></PolicyList>
        </Row>
      </Container>
    </div>
  )
}
