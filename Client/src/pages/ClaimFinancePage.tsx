import React, { useEffect, useMemo, useState } from 'react'
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
  const [claimFinanceHistory,setClaimFinanceHistory] = useState([{id:0,claim_id: 0,item_id: 0, type:'',amount:0}]);
  const [swalProps, setSwalProps] = React.useState<any>({});
  const [reload, setReload] = React.useState(0);
  const [formattedDate,setFormmattedDate] = React.useState<any>(null)


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

  useEffect (()=>{
    async function main() {
      const res = await fetch(`${env.apiOrigin}/claim/${id}/claimFinanceHistory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      let result = await res.json()
      let created_at_list = result.map((item: { created_at: any; }) => item.created_at)
      created_at_list.forEach((created_at: string | number | Date, index: string | number) => {
        let date = new Date(created_at);
        let formatted_date = date.toISOString().replace('T', ' ').slice(0, -5)
        result[index].created_at = formatted_date;
      });
      result.reverse()
      setClaimFinanceHistory(result);
      console.log('result',result)
    }
    main();
  },[id, setClaimFinanceHistory, reload])

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


  const pendingAmounts = useMemo(() => {
    const amounts = {
      reserve: {} as any,
      payment: {} as any,
      recovery: {} as any,
    };
    if (claimFinance == null) {
      return amounts;
    }
    for (const item of claimFinanceItems) {
      amounts['reserve'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'reserve')?.pending_amount || 0;
      amounts['payment'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'payment')?.pending_amount || 0;
      amounts['recovery'][item.id] = claimFinance.find((x: any) => x.item_id === item.id && x.type === 'recovery')?.pending_amount || 0;
    }
    return amounts;
  }, [claimFinance]);

  const [hasLocked, locked] = useMemo(() => {
    const locked: any = {
    };
    let hasLocked = false;
    if (claimFinance == null) {
      return [hasLocked, locked];
    }
    for (const item of claimFinanceItems) {
      let isLocked = claimFinance.findIndex((x: any) => x.item_id === item.id && parseInt(x.pending) > 0) > -1;
      if (isLocked) {
        hasLocked = true;
      }
      locked[item.id] = isLocked
    }
    return [hasLocked, locked];
  }, [claimFinance]);

  const [canApprove, apporvable] = useMemo(() => {
    let pendingApprovalAmount = 0;
    let pendingApprovalExpense = 0;
    let canApprove = false;

    const apporvable: any = {
    };

    if (claimFinance == null) {
      return [canApprove, apporvable];
    }

    if (limits == null) {
      return [canApprove, apporvable];
    }

    for (const finance of claimFinance) {
      pendingApprovalAmount += parseInt(finance.pending_amount);
      const financeItem = claimFinanceItems.find((financeItem) => financeItem.id === finance.item_id);
      if (financeItem?.subgroup === 'expense') {
        pendingApprovalExpense += parseInt(finance.pending_amount);
      }
    }

    for (const item of claimFinanceItems) {
      if (pendingApprovalAmount < limits.per_claim_limit || limits.per_claim_limit === 0) {
        if (item.subgroup === 'expense') {
          if (pendingApprovalExpense < limits.panel_expense_limit || limits.panel_expense_limit === 0) {
            apporvable[item.id] = true
            canApprove = true
          }
        } else {
          apporvable[item.id] = true
          canApprove = true
        }
      }
    }
    return [canApprove, apporvable];
  }, [claimFinance, limits]);

  console.log(canApprove, apporvable)

  const update = watch('update');

  const newAmounts = watch(`amount`);

  async function submit(data: any) {
    if (data.update === 'approve') {
      await fetch(`${env.apiOrigin}/claim/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
    } else {
      await fetch(`${env.apiOrigin}/claim/${id}/finance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
    }

    setReload(r => r + 1)
    reset();
  }

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
            <form onSubmit={handleSubmit(submit)}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <table className="table table-sm table-nowrap card-table">
                        <thead>
                          <tr>
                            {canApprove && hasLocked && <th><Form.Check type='radio' {...register('update')} value="approve" label="Approve" /></th>}
                            <th>Item</th>
                            <th><Form.Check type='radio' {...register('update')} value="reserve" label="Reserve" /></th>
                            <th><Form.Check type='radio' {...register('update')} value="payment" label="Payment" /></th>
                            <th><Form.Check type='radio' {...register('update')} value="recovery" label="Recovery" /></th>
                          </tr>
                        </thead>
                        <tbody>
                          {claimFinanceItems.map((item, index) => {
                            const oldReserve = parseInt(amounts.reserve?.[item.id] ?? 0) - parseInt(amounts.payment?.[item.id] ?? 0) + parseInt(amounts.recovery?.[item.id] ?? 0);
                            const pendingApprovalReserve = parseInt(pendingAmounts.reserve?.[item.id] ?? 0) - parseInt(pendingAmounts.payment?.[item.id] ?? 0) + parseInt(pendingAmounts.recovery?.[item.id] ?? 0);
                            
                            const newAmount = newAmounts?.[item.id]
                            return (
                              <tr className={locked[item.id] ? 'bg-warning' : ''}>
                                {canApprove && hasLocked &&
                                  ((update === 'approve' && apporvable[item.id] && locked[item.id]) ?
                                  <td>
                                    <Form.Check type='checkbox' {...register(`approve.${item.id}`)} value={item.id} />
                                  </td> :
                                  <td></td>)
                                }
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
                                    {oldReserve - pendingApprovalReserve != 0 && <>
                                      {oldReserve > pendingApprovalReserve ? (
                                        <Badge bg="danger" className="ml-2">- ${oldReserve - pendingApprovalReserve}</Badge>
                                      ) : (
                                        <Badge bg="success" className="ml-2">+ ${pendingApprovalReserve - oldReserve}</Badge>
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
                                    {amounts.payment?.[item.id] - pendingAmounts.payment?.[item.id] != 0 && <>
                                      {amounts.payment?.[item.id] > pendingAmounts.payment?.[item.id] ? (
                                        <Badge bg="danger" className="ml-2">- ${amounts.payment?.[item.id] - pendingAmounts.payment?.[item.id]}</Badge>
                                      ) : (
                                        <Badge bg="success" className="ml-2">+ ${pendingAmounts.payment?.[item.id] - amounts.payment?.[item.id]}</Badge>
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
                                  {amounts.recovery?.[item.id] - pendingAmounts.recovery?.[item.id] != 0 && <>
                                    {amounts.recovery?.[item.id] > pendingAmounts.recovery?.[item.id] ? (
                                      <Badge bg="danger" className="ml-2">- ${amounts.recovery?.[item.id] - pendingAmounts.recovery?.[item.id]}</Badge>
                                    ) : (
                                      <Badge bg="success" className="ml-2">+ ${pendingAmounts.recovery?.[item.id] - amounts.recovery?.[item.id]}</Badge>
                                    )}
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
              { update === 'approve' ? 
              <>
                <div className='my-4 text-center'>
                  <Form.Label>Remark</Form.Label>
                  <Form.Control {...register('remark')} />
                </div> 
                <div className='my-4 text-center'>
                  <input className='btn btn-success mx-2' type="button" value="Approve" onClick={handleSubmit((data: any) => submit({...data, decision: 'approve'}))} />
                  <input className='btn btn-danger mx-2' type="button" value="Reject" onClick={handleSubmit((data: any) => submit({...data, decision: 'reject'}))} />
                </div> 
              </> :
              <div className='my-4 text-center'>
                <input className='btn btn-primary' type="submit" value="Update" />
              </div> 
              }
            </form>
          </Col>
          <Col style={{height:'100vh',overflow:'auto'}}>
            <Card >
                <h4 className="bg-warning py-2">
                  Transaction history
                </h4>
                 {claimFinanceHistory.map((history:any)=>(
                   <>
                   <Col>
                    <Row>
                    <tbody style={{borderBottom:'solid 1px',borderColor:'gainsboro'}}>
                      <table>
                        <tr>
                          <td>Amount : </td>
                          <td>{history.amount}</td>
                        </tr>
                        <tr>
                          <td>Type : </td>
                          <td>{history.type}</td>
                        </tr>
                        <tr>
                          <td>Date : </td>
                          <td>{history.created_at}</td>
                        </tr>
                      </table>
                      </tbody>
                    </Row>
                   </Col> 
                   </>
                 ))}
              </Card>
          </Col>
        </Row>
      </Container>
      <SweetAlert2 {...swalProps} />
    </div>
  )
}

export default ClaimFinancePage