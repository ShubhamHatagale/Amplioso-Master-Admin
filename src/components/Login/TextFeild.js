import React from 'react';
import { ErrorMessage, useField } from 'formik';
function TextField({ label, ...props }) {
  const [field, meta] = useField(props);
  let inputElement = null;
  switch (label) {
    case ('Password'):
      inputElement =
        <i className="material-icons prefix pt-2">lock_outline</i>
      break;
    case ('Username'):
      inputElement =
        <i class="material-icons prefix pt-2">person_outline</i>
      break;
  }
  return (

    <div className="input-field col s12" >
      {/* {inputElement} */}
      <input
        className={`form-control shadow-none ${meta.touched && meta.error && 'is-invalid'}`}
        {...field} {...props}
        autoComplete="off"
      />
      <label htmlFor={field.name} >{label}</label>
      <ErrorMessage component="div" name={field.name} className="error" />
    </div>
  )
}
export default TextField;