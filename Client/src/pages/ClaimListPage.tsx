import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { Link, useRouteMatch } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';

import Header from '../components/Header';
import { env } from '../env';
import { formatter } from '../utils';

function ClaimListPage() {
  const { register, handleSubmit, control } = useForm();
  const id = useRouteMatch<{ id: string }>().params.id;
  const [policy, setPolicy] = React.useState<any>(null);
  const [fundHistory, setFundHistory] = React.useState<any[]>([]);
  const [reloadTrigger, setReloadTrigger] = React.useState(true);

  const reload = useCallback(() => {
    setReloadTrigger(reloadTrigger => !reloadTrigger);
  }, [setReloadTrigger]);

  // get fund information
  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/policy/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setPolicy(result);
    }
    main();
  }, [reloadTrigger, id, setPolicy]);

  // get fund history with location params id
  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/policy/${id}/claim`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setFundHistory(result);
    }
    main();
  }, [reloadTrigger, id]);

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Title className="text-truncate">Claim Management - #{policy?.policy_number}</Header.Title>
                  </Col>
                  <Col xs="auto">
                    <Link className="ms-2 btn-primary btn" to={`/policy/${id}/claim/new`}>Add Claim</Link>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
          </Col>
          <Col xs={12} lg={10} xl={8}>
            <Card>
              <Card.Header>
                <h5 className="card-header-title">All Claims</h5>
              </Card.Header>
              {fundHistory.length > 0 && (
                <Card.Body>
                  <Row>
                    <Col>
                      <table className="table table-sm table-nowrap card-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Insurer</th>
                            <th>Refer to Insurer</th>
                            <th>Date Of Accident</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundHistory.map((h, i) => (
                            <tr key={i}>
                              <td>{new Date(h.created_at).toLocaleDateString()}</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>
                                <Link className='btn btn-primary mx-2' to={`/claim/${h.id}/finance`}>Finance Section</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Card.Body>
              )}
              {fundHistory.length === 0 && (
                <Card.Body>
                  <Row>
                    <Col>
                      <p className="text-muted">No claim found.</p>
                    </Col>
                  </Row>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ClaimListPage