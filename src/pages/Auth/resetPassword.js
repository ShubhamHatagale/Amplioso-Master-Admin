import React from 'react';
import { Formik, Form } from 'formik';
import TextField from '../../components/Login/TextFeild';
import * as Yup from 'yup';
import logo from "../../assets/MasterAdmin/images/logo_login.png";
import { useHistory, useParams } from 'react-router-dom';
import M from "materialize-css"
export const ResetPassword = () => {
    const history = useHistory()
    const { token } = useParams()
    console.log(token)
    const initialValues = {
        password: ''
    }
    const validate = Yup.object({
        password: Yup.string()
            .min(6, 'Password must be at least 6 charaters')
            .required('Password is required')
    })
    const OnSubmitForm = (values, props) => {
        try {
            fetch("http://localhost:8000/masters/users/reset-password", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: values.password,
                    token
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#ef5350 red lighten-1" })
                    }
                    else {
                        M.toast({ html: "Password Updated Successfully", classes: "#e#00e676 green accent-3" })
                        const user = JSON.parse(localStorage.getItem("company"));
                        if (!user) {
                            history.push("/dash_board");
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div className="login_wrapper" >
                <div className="container">
                    <div className="row">
                        <div className="col s12 m6 logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <Formik
                            initialValues={
                                initialValues
                            }
                            validationSchema={validate}
                            onSubmit={(values, props) => {
                                OnSubmitForm(values, props)
                            }}
                        >
                            {formik => (
                                <Form>
                                    <div className="col s12 m6 brdr">
                                        <div className="right_panel">
                                            <h1>Reset Password</h1>
                                            <div className="row margin">
                                                <TextField label="Reset Password" name="password" type="password" />
                                                <div className="col s5 topm">
                                                    <button type="submit" className="btn waves-effect waves-light border-round  col s12 login-btn">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div >
        </div >
    )
}