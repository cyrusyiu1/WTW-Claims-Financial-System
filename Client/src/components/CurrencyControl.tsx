import React from 'react'
import { Form } from 'react-bootstrap'
import CurrencyFormat from 'react-currency-format'
import { Control, Controller, FieldValues } from 'react-hook-form'

function CurrencyControl(props: {
  control?: Control<FieldValues, any> | undefined,
  name: string
}) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState,
      }) => (
        <CurrencyFormat
          thousandSeparator={true}
          prefix={'$'}
          customInput={Form.Control}
          onBlur={onBlur} // notify when input is touched
          onValueChange={(values) => onChange(values.value)} // send value to hook form
          value={value}
        />
      )}
    />
  )
}

export default CurrencyControl