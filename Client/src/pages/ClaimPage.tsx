import React, { useEffect } from 'react'
import Header from '../components/Header';
import { Badge, Button, ButtonGroup, Container, Col, Form, Table, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { env } from '../env';

export default function ClaimPage() {
  const { register, handleSubmit, watch, control } = useForm();
  const id = useRouteMatch<{ id: string }>().params.id;
  let history = useHistory();

  const [policy, setPolicy] = React.useState<any>(null);
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
  }, [id, setPolicy]);


  const submit = async (data: any) => {
    await fetch(`${env.apiOrigin}/policy/${id}/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    });

    history.push(`/policy/${id}/claim`);
  }

  const legalCase = watch('legal_case')

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Title className="text-truncate">Add a Claim - #{policy?.policy_number}</Header.Title>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
            <form onSubmit={handleSubmit(submit)} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '2em' }}>
              <div className="form-group">
                <Form.Label>Policy Number</Form.Label>
                <p>{policy?.policy_number}</p>
              </div>
              <div className="form-group">
                <Form.Label>Claim Financial Number</Form.Label>
                <Form.Control {...register('claim_financial_number')} />
              </div>
              <div className="form-group">
                <Form.Label>HKEC Number</Form.Label>
                <Form.Control {...register('hkec_claim_number')} />
              </div>
              <div className="form-group">
                <Form.Label>Insurer Number</Form.Label>
                <Form.Control {...register('insurer_number')} />
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Date of Accident</Form.Label>
                    <Form.Control {...register('date_of_accident')} type="date" />
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Client Report Date</Form.Label>
                    <Form.Control {...register('client_report_date')} type="date" />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Main Contractor Name</Form.Label>
                    <Form.Control {...register('main_contractor_name')} />
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Claimant</Form.Label>
                    <Form.Control {...register('claimant')} />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Refer to Insurer</Form.Label>
                    <Form.Check {...register('refer_to_insurer')} label="" />
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>TPARTY</Form.Label>
                    <Form.Check {...register('tparty')} label="" />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>RECTYPE</Form.Label>
                    <Form.Control {...register('rec_type')} />
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Recovery</Form.Label>
                    <Form.Control {...register('recovery')} />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Severity</Form.Label>
                      <Controller
                        control={control}
                        name="severity"
                        render={({
                          field: { onChange, onBlur, value, name, ref },
                          fieldState: { invalid, isTouched, isDirty, error },
                          formState,
                        }) => (
                          <Select
                            options={[
                              { value: '1', label: '1' },
                              { value: '2', label: '2' },
                              { value: '3', label: '3' },
                              { value: '4', label: '4' },
                              { value: '5', label: '5' },
                            ]} 
                            onBlur={onBlur}
                            onChange={(values) => onChange(values?.value)}
                            value={{ value: value, label: value }}
                          />
                        )}
                      />
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Next Review Date</Form.Label>
                    <Form.Control {...register('next_review_date')} type="date" />
                  </Col>
                </Row>
              </div>
              <div className="form-group">
                <Row className="g-3">
                  <Col xs={12} md={6} className="mb-3">
                    <Form.Label>Legal Case</Form.Label>
                    <Form.Check {...register('legal_case')} label="" />
                  </Col>
                </Row>
              </div>
              {legalCase &&
                <div className="form-group">
                  <Row className="g-3">
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>Claimant Solicitor</Form.Label>
                      <Form.Control {...register('claimant_solicitor')} />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>Own Solicitor</Form.Label>
                      <Form.Control {...register('own_solicitor')} />
                    </Col>
                  </Row>
                </div>
              }
              <div>
                <div className="form-group">
                  <Row className="g-3">
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>HC User</Form.Label>
                      <Select />
                    </Col>
                    <Col xs={12} md={6} className="mb-3">
                      <Form.Label>Claim Handler User</Form.Label>
                      <Select />
                    </Col>
                  </Row>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <input className='btn btn-primary' type="Submit" value="Add claim" />
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
