import React, { useCallback, useEffect, useState } from 'react'
import { env } from "../env";
import Header from './Header';
import { Badge, Card, Col, Container, Dropdown, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import NameChecked from './NameChecked';

const api_server = env.apiOrigin;

export default function PolicyList() {
  const [allPolicy, setAllPolicy] = useState<any[]>([])
  const [userType,setUserType] =useState('')

  const getAllPolicyApi = useCallback(async () => {
    const res = await fetch(`${api_server}/policy`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const result = await res.json()
    setAllPolicy(result)
  }, [setAllPolicy])

  const getuserApi = async () => {
    const res = await fetch(`${env.apiOrigin}/users/getUserById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  const result = await res.json()
  setUserType(result.userType)
}

  useEffect(()=>{
    getuserApi()
  },[])

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
              {userType !== 'claim'?
              <Link className="ms-2 btn-primary btn" to="/policy/new">Add Policy</Link>     
              :''        
              }
            </Col>
          </Row>
        </Header.Body>
      </Header>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12}>
            <Card>
              <Card.Header>
                <InputGroup className="input-group-merge input-group-flush input-group-reverse">
                  <Form.Control type="search" placeholder="Search" />
                  <InputGroup.Text>
                    <FeatherIcon icon="search" size="1em" />
                  </InputGroup.Text>
                </InputGroup>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="white" size="sm">
                    Bulk action
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#!">Action</Dropdown.Item>
                    <Dropdown.Item href="#!">Another action</Dropdown.Item>
                    <Dropdown.Item href="#!">Something else here</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Table size="sm" className="card-table table-nowrap" responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Holder</th>
                        <th>Description</th>
                        <th>Blocked</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {allPolicy.map((row) => {
                    return (
                      <tr
                        key={row.id}>
                        <td>{row.policy_number}</td>
                          <td><NameChecked name={row.holder_last_name} /></td>
                          <td>{row.description}</td>
                          <td>{row.blocked && <Badge bg={`danger-soft`}>Blocked</Badge>}</td>
                          <td>
                          {userType !== 'claim'?
                            <Link className='btn btn-primary mx-2' to={`/policy/${row.id}/fund`}>Fund Management</Link>
                            :''
                          }
                            <Link className='btn btn-primary mx-2' to={`/policy/${row.id}/claim`}>Claim Management</Link>
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