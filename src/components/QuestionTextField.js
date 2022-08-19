import React from 'react';
import { ErrorMessage, useField } from 'formik';

const QuestionTextField = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className="input-field col m12 s12">
            <input
                className={`form - control shadow - none ${meta.touched && meta.error && 'is-invalid'} `}
                {...field} {...props}
                autoComplete="off"
            />
            <label htmlFor={field.name} >{label}</label>
            <ErrorMessage component="div" name={field.name} className="error" />
        </div>
    )
}
export default QuestionTextField;