import { unwatchFile } from 'fs';
import { env } from "../env";
import React, { useState, useEffect } from 'react'
import Header from './Header';
import { Badge, Button, ButtonGroup, Col, Form, Table, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

export default function Policy() {
  const { register, handleSubmit } = useForm();
  let history = useHistory();

  const api_server = env.apiOrigin;

  const submit = async (data: any) => {
    await fetch(`${api_server}/policy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    });
    
    history.push('/policy');
  }

  return (
    <div>
      <Header className="mt-md-5">
        <Header.Body>
          <Row className="align-items-center">
            <Col>
              <Header.Title className="text-truncate">Add a Policy</Header.Title>
            </Col>
          </Row>
        </Header.Body>
      </Header>
      <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '2em' }}>
        <div className="form-group">
          <Form.Label>Policy Number</Form.Label>
          <Form.Control {...register('policy_number')} />
        </div>
        <div className="form-group">
          <Form.Label>Policy Holder</Form.Label>
          <Form.Control {...register('policy_holder')} />
        </div>
        <div className="form-group">
          <Form.Label>Insurer</Form.Label>
          <Form.Control {...register('insurer')} />
        </div>
        <div className="form-group">
          <Form.Label>Cover Period</Form.Label>
          <Row className="g-3">
            <Col xs={12} md={6} className="mb-3">
              <Form.Control type="date" {...register('start_date')} />
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <Form.Control type="date" {...register('end_date')} />
            </Col>
          </Row>
        </div>
        <div className="form-group">
          <Form.Label>Policy Description</Form.Label>
          <Form.Control {...register('description')} />
        </div>
        <div className="form-group">
          <Row className="g-3">
            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Fund Management</Form.Label>
              <Form.Check {...register('fund_management')} label="Enable Fund Management" />
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Email Notification</Form.Label>
              <Form.Check {...register('email_notification')} label="Enable Email Notification" />
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <Form.Label>Blocked</Form.Label>
              <Form.Check {...register('blocked')} label="Blocked" />
            </Col>
          </Row>
        </div>
        <div>
          <Form.Label>User Limits</Form.Label>
          <Table size="sm" responsive>
            <thead>
              <tr>
                <th scope="col">Authority</th>
                <th scope="col">Panel Expense Limit</th>
                <th scope="col">Per Claim Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Level 1</th>
                <td><Form.Control {...register('panel_expense_limit1')} /></td>
                <td><Form.Control {...register('per_claim_limit1')} /></td>
              </tr>
              <tr>
                <th scope="row">Level 2</th>
                <td><Form.Control {...register('panel_expense_limit2')} /></td>
                <td><Form.Control {...register('per_claim_limit2')} /></td>
              </tr>
              <tr>
                <th scope="row">Level 3</th>
                <td><Form.Control {...register('panel_expense_limit3')} /></td>
                <td><Form.Control {...register('per_claim_limit3')} /></td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <div className="form-group">
            <Form.Label>Add User</Form.Label>
            <Select />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <input className='btn btn-primary' type="Submit" value="Add policy" />
        </div>
      </form>
    </div>
  )
}
