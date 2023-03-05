import React, { useEffect } from 'react'
import Header from '../components/Header';
import { Card, Badge, Button, ButtonGroup, Container, Col, Form, Table, Row } from 'react-bootstrap';
import { env } from '../env';
import { Link } from 'react-router-dom';

function ApprovalListPage() {
  const [claims, setClaims] = React.useState<any[]>([]);

  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/claim/approval`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setClaims(result);
    }
    main();
  }, [setClaims]);

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Title className="text-truncate">Pending Approval</Header.Title>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
          </Col>
          <Col xs={12} lg={10} xl={10}>
            <Card>
              <Table size="sm" className="card-table table-nowrap" responsive>
                <thead>
                    <tr>
                      <th>Claim #</th>
                      <th>Policy #</th>
                      <th>Description</th>
                      <th>Pending Approvals</th>
                      <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {claims.map((row: any) => {
                    return (
                      <tr key={row.id}>
                        <td>{row.claim_financial_number}</td>
                        <td>{row.policy_number}</td>
                        <td>{row.description}</td>
                        <td>{row.pending}</td>
                        <td>
                          <Link className='btn btn-primary mx-2' to={`/claim/${row.id}/finance`}>Claim Finance Section</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ApprovalListPage