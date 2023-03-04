import React, { Children, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon';
import Avatar from './Avatar';
import style from '../style/sidebar.module.css'
import { Collapse, Container, Dropdown, Form, InputGroup, Nav, Navbar } from 'react-bootstrap';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { logoutAction } from '../redux/auth/action';
import { useDispatch } from 'react-redux';

export default function Sidebar() {
  const dispatch = useDispatch()

  const logoutButton = (event: FormEvent) => {
    event.preventDefault();
    localStorage.removeItem('token');
    dispatch(logoutAction())
  }

  return (
    <>
      <Navbar expand="md" className="navbar-vertical fixed-start" collapseOnSelect={true}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img className="navbar-brand-img" src="/img/logo.svg" alt="WTW" />
          </Navbar.Brand>
              
          <Navbar.Collapse>
            <hr className="navbar-divider" />
            <Nav>
              <Nav.Item>
                <Nav.Link as={Link} to="/approval" role="button">
                  Pending Approval
                </Nav.Link>
                <Nav.Link as={Link} to="/policy" role="button">
                  Policy Management
                </Nav.Link>
                <Nav.Link as={Link} to="/claim" role="button">
                  Claims Management
                </Nav.Link>
                <Nav.Link as={Link} to="/fund" role="button">
                  Fund Management
                </Nav.Link>
                <Nav.Link as={Link} to="/payee" role="button">
                  Payees Management
                </Nav.Link>
                <Nav.Link as={Link} to="/insurer" role="button">
                  Insurer Management
                </Nav.Link>
                <Nav.Link as={Link} to="/admin" role="button">
                  Users Management
                </Nav.Link>
                <Nav.Link as={Link} to="/report" role="button">
                  Reporting
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="mt-auto mb-md-4" />

            <div className="navbar-user d-none d-md-flex">
              <Dropdown drop="up">
                <Dropdown.Toggle as={Avatar} size="sm" role="button">
                  <Avatar.Image className="rounded-circle" src="/img/avatars/profiles/avatar-1.jpg" alt="..." />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile-posts">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/account-general">
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logoutButton}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}