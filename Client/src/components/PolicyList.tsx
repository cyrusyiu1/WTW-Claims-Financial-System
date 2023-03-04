import React, { useCallback, useEffect, useState } from 'react'
import { env } from "../env";
import Header from './Header';
import { Badge, Button, ButtonGroup, Col, Nav, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const api_server = env.apiOrigin;

export default function PolicyList() {
  const [allPolicy, setAllPolicy] = useState<any[]>([])

  const getAllPolicyApi = useCallback(async () => {
    const res = await fetch(`${api_server}/policy`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const result = await res.json()
    setAllPolicy(result)
  }, [setAllPolicy])

  useEffect(() => {
    getAllPolicyApi()
  }, [getAllPolicyApi])

  return (
    <div>
      <Header className="mt-md-5">
        <Header.Body>
          <Row className="align-items-center">
            <Col>
              <Header.Title className="text-truncate">Policy List</Header.Title>
            </Col>
            <Col xs="auto">
              <Link className="ms-2 btn-primary btn" to="/policy/new">Add Policy</Link>
            </Col>
          </Row>
        </Header.Body>
      </Header>
      <div style={{ flexFlow: 'wrap', marginLeft: '4%' }}>
        { allPolicy.map((policy: any, index: number) => (
            <div key={policy.id}>
              <div style={{ border: 'solid 2px', marginLeft: '5px', marginRight: '2px', marginBottom: '5px', padding: '10px' }}>
                <div style={{ textAlign: "left", marginBottom: '5px' }}>
                  <div>Username: {policy.username}</div>
                  <div>Policy number: {policy.policy_number}</div>
                  <div>Policy type: {policy.policy_type}</div>
                  <div>PolicyTerm: {policy.policy_term}</div>
                  <div>Coverage amount: {policy.coverage_amount}</div>
                  <div>Premium: {policy.premium}</div>
                  <div>Claims Amount: {policy.claims_amount}</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}