import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useRouteMatch } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';

import Header from '../components/Header';
import { env } from '../env';
import { formatter } from '../utils';
import CurrencyControl from '../components/CurrencyControl';

function FundPage() {
  const { register, handleSubmit, control } = useForm();
  const id = useRouteMatch<{ id: string }>().params.id;
  const [policy, setPolicy] = React.useState<any>(null);
  const [fundHistory, setFundHistory] = React.useState<any[]>([]);
  const [reloadTrigger, setReloadTrigger] = React.useState(true);

  const reload = useCallback(() => {
    setReloadTrigger(reloadTrigger => !reloadTrigger);
  }, [setReloadTrigger]);

  // get policy information
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
      const res = await fetch(`${env.apiOrigin}/policy/${id}/fund`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setFundHistory(result);
    }
    main();
  }, [reloadTrigger, id]);

  // get fund balance with location params id
  const fundBalance = useMemo(() => {
    let balance = 0;
    fundHistory.forEach(h => {
      balance += h.amount;
    })
    return balance;
  }, [fundHistory]);

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Title className="text-truncate">Fund Management - #{policy?.policy_number}</Header.Title>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
            <form onSubmit={handleSubmit(async (data: any) => {
              await fetch(`${env.apiOrigin}/policy/${id}/fund`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  fund: data.amount * 100
                })
              });
              reload();
            })}>
              <Card>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="text-uppercase text-muted mb-2">Current balance</h6>
                      <span className="h2 mb-0">${formatter.format(fundBalance / 100)}</span>
                    </Col>
                  </Row>
                  <Row className="align-items-center justify-content-center my-4">
                    <Col xs="auto">
                      <CurrencyControl
                        control={control}
                        name="amount"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button type="submit" size="sm">Top Up Amount</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </form>
          </Col>
          <Col xs={12} lg={10} xl={8}>
            <Card>
              <Card.Header>
                <h5 className="card-header-title">Fund History</h5>
              </Card.Header>
              {fundHistory.length > 0 && (
                <Card.Body>
                  <Row>
                    <Col>
                      <table className="table table-sm table-nowrap card-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>User</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundHistory.map((h, i) => (
                            <tr key={i}>
                              <td>{new Date(h.created_at).toLocaleDateString()}</td>
                              <td>${formatter.format(h.amount / 100)}</td>
                              <td>{h.user}</td>
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
                      <p className="text-muted">No history found.</p>
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

export default FundPage