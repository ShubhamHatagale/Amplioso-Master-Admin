import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import * as Yup from "yup";
import PasswordTextField from '../../components/passwordTextfield';
import MaxWidthDialog from '../../components/AlertDialogBox';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff"

require("dotenv").config();
var crypto = require("crypto");
export default function PasswordSetting() {
    let [oldpassword, setoldpassword] = useState('')
    const [showPass, setshowPass] = useState(false)
    const [showConfirmPass, setshowConfirmPass] = useState(false)

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' })
    const [confirmDialog1, setConfirmDialog1] = useState({ isOpen: false, title: '', subTitle: '', type: '' })
    const BaseURL = process.env.REACT_APP_Base_URL;
    const id = localStorage.getItem("masters_id")
    const initialValues = {
        oldpassword: "",
        password: "",
        confirmpassword: "",
    };
    const validate = Yup.object({
        oldpassword: Yup.string().required('required'),
        password: Yup.string().required('required'),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('required')
    });
    // etc appacche host 000/cns settings


    // const showHidePass = () => {
    //     setshowPass(!showPass)
    // }
    const OnSubmitForm = async (values) => {
        const checkPassword = crypto.createHash('sha512').update(values.oldpassword).digest('hex');
        const token = localStorage.getItem("masters_jwt");
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            BaseURL + `/company/${id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        if (result) {
            let old_Password;
            result.map((item, key) => {
                old_Password = item.password;
                setoldpassword(item.password)
            })
            if (checkPassword === old_Password) {
                try {
                    fetch(BaseURL + `/company/resetpassword/${id}`, {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        },
                        body: JSON.stringify({
                            password: values.password,
                        }),
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((resData) => {
                            if (resData.status == 200) {
                                setConfirmDialog1({
                                    isOpen: true,
                                    title: 'Alert',
                                    subTitle: "Password Updated Successfully",
                                })
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } catch (err) {
                    console.log(err);
                }
            }
            else {
                console.log(checkPassword, old_Password)
                setConfirmDialog({
                    isOpen: true,
                    title: 'Error Massage',
                    subTitle: "Wrong Old Password",
                })
            }
        }
    }
    return (
        <div>
            <div className="section inner-content">
                <div className="section-title">
                    <h1> Change Your Password</h1>
                    {/* <div className="nav-wrapper inner-breadcrumb">
                        <div className="col s12 pad-l-0">
                            <a href="#!">DashBoard </a>
                            <a href="#!"> Change Your Password</a>
                        </div>
                    </div> */}
                </div>
                <div className="pt-0 main-screen">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validate}
                        onSubmit={(values) => {
                            OnSubmitForm(values);
                        }}
                    >
                        {(formik) => (
                            <Form>
                                <div className="row">
                                    {/* <input type="checkbox" >Show Password</input> */}

                                    <div className="password-settings">
                                        <PasswordTextField
                                            label="Old Password"
                                            elementType="add"
                                            name="oldpassword"
                                            type="text"
                                        />
                                        <PasswordTextField
                                            label="New Password"
                                            elementType="add"
                                            name="password"
                                            type={showPass ? "text" : "password"}
                                        />
                                        {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" /> */}

                                        {/* <div ><span style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowPass(!showPass)}> show passsword</span></div> */}
                                        {/* <div><Visibility style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowPass(!showPass)} /></div> */}
                                        <div>{showPass ? <Visibility style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowPass(!showPass)} /> : <VisibilityOff style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowPass(!showPass)} />}</div>

                                        <div>
                                            <PasswordTextField
                                                label="Confirm Password"
                                                elementType="add"
                                                name="confirmpassword"
                                                type={showConfirmPass ? "text" : "password"}
                                            />
                                            {/* <div ><span style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowConfirmPass(!showConfirmPass)}>show passsword</span></div> */}
                                            <div>{showConfirmPass ? <Visibility style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowConfirmPass(!showConfirmPass)} /> : <VisibilityOff style={{ position: "relative", left: "500px", top: "-56px", fontSize: "16px", textTransform: "capitalize", textDecoration: "underline", cursor: "pointer" }} onClick={() => setshowConfirmPass(!showConfirmPass)} />}</div>

                                        </div>

                                        <div className="input-field col m12 s12 pad-r center">
                                            <button
                                                class="waves-effect waves-light btn-large mb-1 mr-1"
                                                type="submit"
                                                name="action"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/password_setting'} />
            <MaxWidthDialog setConfirmDialog={setConfirmDialog1} confirmDialog={confirmDialog1} link={'/'} />
        </div>
    )
}
