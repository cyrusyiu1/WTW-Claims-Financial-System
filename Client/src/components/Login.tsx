import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { env } from "../env";
import { loginSuccess, logoutAction } from '../redux/auth/action';
import { IRootState } from '../redux/state';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState({ type: "", message: "" })

  const dispatch = useDispatch()

  const isAuthenticated = useSelector(
    (state: IRootState) => state.auth.isAuthenticated
  );

  const api_server = env.apiOrigin;

  const loginApi = async () => {
    const res = await fetch(`${api_server}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    // return res;
    const result = await res.json()
    if (res.status === 200) {
      localStorage.setItem('token', result)
      setLoginResult({ type: 'success', message: 'Login Success' })
      dispatch(loginSuccess())
    } else {
      console.log(result.message)
      setLoginResult({ type: 'fail', message: result.message })
    }
  }

  const submitButton = (event: FormEvent) => {
    event.preventDefault();
    loginApi()
  };
  return (
    <div>
        <div className='p-4'>
          <img className="navbar-brand-img" src="/img/logo.svg" alt="WTW" />
        </div>
        <h1 className="display-4 text-center mb-3">WTW Claims Finance Platform</h1>
        <form>
          <div className="form-group">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
          </div>
          <div className="form-group">
            <Row>
              <Col>
                <Form.Label>Password</Form.Label>
              </Col>
            </Row>
            <InputGroup className="input-group-merge">
              <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
              <InputGroup.Text>
                <FeatherIcon icon="eye" size="1em" />
              </InputGroup.Text>
            </InputGroup>
          </div>
          <Button size="lg" className="w-100 mb-3" onClick={submitButton}>
            Sign in
          </Button>
        </form>
      </div>
  )
}
