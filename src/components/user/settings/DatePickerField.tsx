import React from 'react'
import { useField, useFormikContext } from 'formik'

import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { ru } from 'date-fns/locale'
registerLocale('ru', ru)

import 'react-datepicker/dist/react-datepicker.css'

const DatePickerField: React.FC = ({ ...props }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(props as any)

  return (
    <DatePicker
      {...field}
      {...props}
      locale="ru"
      popperPlacement="left"
      dateFormat="MMMM yyyy"
      selected={(field.value && new Date(field.value)) || new Date()}
      onChange={(val: any) => {
        setFieldValue(field.name, val)
      }}
    />
  )
}

export default DatePickerField
