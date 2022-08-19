import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import TextField from '../../components/Login/TextFeild';
import MaxWidthDialog from '../../components/AlertDialogBox';
import * as Yup from 'yup';
import M from "materialize-css"
import logo from "../../assets/MasterAdmin/images/default-logo.png";
import { useHistory } from 'react-router-dom';

export const ForgotPassword = () => {
    const APIUrl = process.env.REACT_APP_Base_URL_Backend;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' })
    const history = useHistory()
    const initialValues = {
        user_email: ''
    }
    const validate = Yup.object({
        user_email: Yup.string()
            .email('Company E-mail is invalid')
            .required('Company E-mail is required')
    })
    const OnSubmitForm = (values, props) => {
        try {
            fetch(APIUrl + `/masters/company/forgot_password`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: values.user_email
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.error) {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Alert',
                            subTitle: "Please Enter Currect Company E-mail address",
                        })
                    }
                    else {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Alert',
                            subTitle: "Temporary Password Auto-generated Successfully. Plaese check your E-mail",
                        })
                        // M.toast({ html: data.massage, classes: "#e#00e676 green accent-3" });
                        // const user = JSON.parse(localStorage.getItem("company"));
                        // if (user) {
                        // history.push('/');
                        // }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        // <div>
        //     <div className="login_wrapper" >
        //         <div className="container">
        //             <div className="row">
        //                 <div className="col s12 m6 logo">
        //                     <img src={logo} alt="logo" style={{ width: '50%' }} />
        //                 </div>
        //                 <Formik
        //                     initialValues={
        //                         initialValues
        //                     }
        //                     validationSchema={validate}
        //                     onSubmit={(values, props) => {
        //                         OnSubmitForm(values, props)
        //                     }}
        //                 >
        //                     {formik => (
        //                         <Form>
        //                             <div className="col s12 m6 brdr">
        //                                 <div className="right_panel">
        //                                     <h2>Forgot Password</h2>
        //                                     <div className="row margin">
        //                                         <TextField label="Company E-mail" name="user_email" type="text" />
        //                                         <div className="col s5 topm">
        //                                             <button type="submit" className="btn waves-effect waves-light border-round  col s12 login-btn">Submit</button>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </Form>
        //                     )}
        //                 </Formik>
        //             </div>
        //         </div>
        //     </div >
        //     <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/login'} />
        // </div >
        <div>
            <div className="login_wrapper" >
                <div className="container">
                    <div className="row">
                        <div className="col s12 m6 logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="col s12 m6 brdr ">
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
                                        {/* <div className="col s12 m6 brdr"> */}
                                        <div className="right_panel">
                                            <h1>Forgot Password</h1>
                                            <div className="row margin">
                                                <TextField label="Email Id" name="user_email" type="text" />
                                                <div className="col s5 topm">
                                                    <button type="submit" className="btn  waves-light border-round  col s12 login-btn">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
export default ForgotPassword;