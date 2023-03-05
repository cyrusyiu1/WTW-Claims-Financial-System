import React, { useEffect, useState } from 'react'
import { env } from '../env';
import ClipLoader from "react-spinners/ClipLoader";
import SweetAlert2 from 'react-sweetalert2';

// @ts-ignore
import FeatherIcon from 'feather-icons-react';

function NameChecked(props: {
  name: string
}) {
  const [sanction, setSanction] = useState<any>(null);
  const [swalProps, setSwalProps] = useState<any>({});

  useEffect(() => {
    async function sync() {
      const res = await fetch(`${env.apiOrigin}/sanction/?name=${props.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const result = await res.json()
      setSanction(result)
    }

    sync();
  }, [props.name, setSanction]);

  return (
    <div>{props.name} {sanction == null ?
      <ClipLoader
        color='#999'
        loading={true}
        size={25}
        aria-label="Loading"
        data-testid="loader"
      />
      : sanction.numberOfMatches > 0 ? <FeatherIcon onClick={() => {
        setSwalProps({
          show: true,
          title: props.name,
        });
      }} icon="alert-circle" size="1em" /> : <FeatherIcon icon="check" size="1em" />}
      <SweetAlert2 {...swalProps} onConfirm={() => {
        setSwalProps({
          show: false
        });
      }}>
        {sanction?.matches?.map((match: any) => {
          return (
            <div style={{textAlign: 'left'}}>
              <h3 className='text-danger'>{match.matchRate}% {match.name}</h3>
              <p>{match.category} / {match.referenceType}</p>
              <p>{match.references.map((r: any) => r.name)}</p>
              <p>{match.summary}</p>
            </div>
          )
        })}
      </SweetAlert2>
    </div>
  )
}

export default NameChecked