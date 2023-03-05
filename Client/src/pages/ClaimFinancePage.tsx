import React, { useEffect, useMemo } from 'react'
import Header from '../components/Header';
import { Card, Badge, Button, ButtonGroup, Container, Col, Form, Table, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { env } from '../env';
import { claimFinanceItems } from '../models';
import CurrencyControl from '../components/CurrencyControl';
import { formatter } from '../utils';
import SweetAlert2 from 'react-sweetalert2';

function ClaimFinancePage() {
  const { register, handleSubmit, watch, control, reset } = useForm();
  const id = useRouteMatch<{ id: string }>().params.id;
  let history = useHistory();

  const [limits, setLimits] = React.useState<any>(null);
  const [claim, setClaim] = React.useState<any>(null);
  const [claimFinance, setClaimFinance] = React.useState<any>(null);
  const [swalProps, setSwalProps] = React.useState<any>({});
  const [reload, setReload] = React.useState(0);

  // get policy information
  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/claim/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setClaim(result);
    }
    main();
  }, [id, setClaim, reload]);

  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/claim/${id}/limits`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setLimits(result);
    }
    main();
  }, [id, setLimits, reload]);
  
  useEffect(() => {
    async function main() {
      const res = await fetch(`${env.apiOrigin}/claim/${id}/finance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setClaimFinance(result);
    }
    main();
  }, [id, setClaimFinance, reload]);

  const amounts = useMemo(() => {
    const amounts = {
      reserve: {} as any,
      payment: {} as any,
      recovery: {} as any,
    };
    if (claimFinance == null) {
      return amounts;
    }
    for (const item of claimFinanceItems) {
      amounts['reserve'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'reserve')?.amount || 0;
      amounts['payment'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'payment')?.amount || 0;
      amounts['recovery'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'recovery')?.amount || 0;
    }
    return amounts;
  }, [claimFinance]);

  const locked = useMemo(() => {
    const locked: any = {
    };
    if (claimFinance == null) {
      return locked;
    }
    for (const item of claimFinanceItems) {
      locked[item.id] = claimFinance.findIndex((x: any) => x.item_id === item.id && parseInt(x.pending) > 0) > -1;
    }
    return locked;
  }, [claimFinance]);
  
  const update = watch('update');

  const newAmounts = watch(`amount`);

  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={10}>
            <Header className="mt-md-5">
              <Header.Body>
                <Row className="align-items-center">
                  <Col>
                    <Header.Title className="text-truncate">Claim Finance - #{claim?.policy_number}</Header.Title>
                  </Col>
                </Row>
              </Header.Body>
            </Header>
          </Col>
          <Col xs={12} lg={10} xl={8}>
            <form onSubmit={handleSubmit(async (data: any) => {
              await fetch(`${env.apiOrigin}/claim/${id}/finance`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data),
              });

              setReload(r => r + 1)
              reset();
            })}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <table className="table table-sm table-nowrap card-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th><Form.Check type='radio' {...register('update')} value="reserve" label="Reserve" /></th>
                            <th><Form.Check type='radio' {...register('update')} value="payment" label="Payment" /></th>
                            <th><Form.Check type='radio' {...register('update')} value="recovery" label="Recovery" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          {claimFinanceItems.map((item, index) => {
                            const oldReserve = parseInt(amounts.reserve?.[item.id] ?? 0) - parseInt(amounts.payment?.[item.id] ?? 0) + parseInt(amounts.recovery?.[item.id] ?? 0);
                            const newAmount = newAmounts?.[item.id]
                            return (
                              <tr className={locked[item.id] ? 'bg-warning' : ''}>
                                <td>{item.name}</td>
                                <td>
                                  <p>
                                    <span className='mx-2'>{oldReserve ? '$' + formatter.format(oldReserve) : '-'}</span>
                                    {update === 'reserve' && <>
                                      {newAmount && newAmount > 0 && (
                                        <Badge bg="success" className="ml-2">+ ${newAmount}</Badge>
                                      )}
                                    </>
                                    }
                                    {update === 'payment' && <>
                                      {newAmount && newAmount > 0 && (
                                        <Badge bg="danger" className="ml-2">- ${newAmount}</Badge>
                                      )}
                                    </>
                                    }
                                    {update === 'recovery' && <>
                                      {newAmount && newAmount > 0 && (
                                        <Badge bg="success" className="ml-2">+ ${newAmount}</Badge>
                                      )}
                                    </>
                                    }
                                  </p>
                                  {update === 'reserve' && !locked[item.id] && <>
                                    <CurrencyControl
                                      control={control}
                                      name={`amount.${item.id}`}
                                    />
                                  </>
                                  }
                                </td>
                                <td>
                                  <p>
                                    <span className='mx-2'>{amounts.payment?.[item.id] ? '$' + formatter.format(amounts.payment?.[item.id]) : '-'}</span>
                                    {update === 'payment' && <>
                                      {newAmount && newAmount > 0 && (
                                        <Badge bg="success" className="ml-2">+ ${newAmount}</Badge>
                                      )}
                                    </>
                                    }
                                  </p>
                                  {update === 'payment' && !locked[item.id] && <>
                                    <CurrencyControl
                                      control={control}
                                      name={`amount.${item.id}`}
                                    />
                                  </>
                                  }
                                </td>
                                <td>
                                  <p>
                                    <span className='mx-2'>{amounts.recovery?.[item.id] ? '$' + formatter.format(amounts.recovery?.[item.id]) : '-'}</span>
                                    {update === 'recovery' && <>
                                      {newAmount && newAmount > 0 && (
                                        <Badge bg="success" className="ml-2">+ ${newAmount}</Badge>
                                      )}
                                    </>
                                    }
                                  </p>
                                  {update === 'recovery' && !locked[item.id] && <>
                                    <CurrencyControl
                                      control={control}
                                      name={`amount.${item.id}`}
                                    />
                                  </>
                                  }
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <div className='my-4 text-center'>
                <input className='btn btn-primary' type="Submit" value="Update" />
              </div>
            </form>
          </Col>
        </Row>
      </Container>
      <SweetAlert2 {...swalProps} />
    </div>
  )
}

export default ClaimFinancePage