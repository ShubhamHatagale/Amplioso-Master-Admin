import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import TextField from '../../../components/TextField';
import MaxWidthDialog from '../../../components/AlertDialogBox';
import MasterHeader from '../../../components/MasterAdminComponents/MasterHeader';
require("dotenv").config();

export default function AddAssignManagers() {
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' });
    const [no_of_emp, setno_of_emp] = useState(0);

    const BackBtn = () => {
        history.push("/assign_manager");
    }
    const initialValues = {
        first_name: '',
        last_name: '',
        count: '',
        company_id: '',
        user_email: '',
        created_by: "",
        updated_by: ""
    }
    useEffect(() => {
        GetallRecored()
    }, [])
    const validate = Yup.object({
        first_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed. ").required('First Name is required').min(2, "First Name must be minimum 2 characters long").max(15, "First Name must be 2 to 15 characters long."),
        last_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.").required('Last Name is required').min(2, "Last Name must be minimum 2 characters long").max(15, "Last Name must be 2 to 15 characters long."),
        count: Yup.string().required('Count is Required').matches(/^\d+$/, "Only Numbers are Allowed"),
        user_email: Yup.string().email().required('Email is Required').matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please enter a valid email."),
    })


    const GetallRecored = async () => {
        // setloading(1);
        // console.log(get_no_man())
        console.log(await get_no_man())

        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // setlistRecord(result.data);
                // setloading(0);
                console.log(result.data[0].number_of_employee)
                // setno_of_emp(result.data[0].number_of_employee)
                setno_of_emp(result.data[0].CompanyPackage.no_of_employees)

            })
            .catch(error => console.log('error', error));
    }

    const get_no_man = async () => {

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/company/managers/${id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data.length;
        console.log(response.data.length + "output");
        console.log(result);



        // console.log(id)
        // let res2 = await fetch(
        //     APIUrl + `/employeedetails/company/${id}`,
        //     {
        //         method: "get",
        //         headers: myHeaders
        //     }
        // );
        // let res2ponse = await res2.json();
        // let res2ult = res2ponse.data.length;
        // console.log(res2ponse.data.length + "output");
        // console.log(res2ult);

        // console.log(result + "+" + res2ult);
        return result;
        // return result + res2ult;


    }

    const OnSubmitForm = async (values, props) => {
        let manager_count = await get_no_man()
        console.log(await get_no_man())
        console.log(no_of_emp + "<=" + manager_count)
        // return false;
        if (no_of_emp <= manager_count) {
            console.log("grather")
            setConfirmDialog({
                isOpen: true,
                title: 'Alert',
                subTitle: `Managers Count Should Not Be Gratherthan ${no_of_emp}`,
                // subTitle: `Employees Or Manager Count Should Not Be Gratherthan ${no_of_emp}`,
            })
            return false;
        }

        console.log("not grather")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        var raw = JSON.stringify({
            first_name: values.first_name,
            last_name: values.last_name, 
            count: values.count,
            company_id: id,
            user_email: values.user_email,
            role: 3,
            created_by: id,
            updated_by: id
        })
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        console.log(values);
        console.log(raw);
        fetch(APIUrl + `/company/managers`, requestOptions)
            .then((response) => response.json())
            .then((resData) => {
                console.log(resData);
                if (resData.status == 200) {
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Alert',
                        subTitle: "Manager Assigned Successfully",
                    })
                }
                if (resData.status == 400) {
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Error',
                        subTitle: "Manager Already Exist With This E-mail,Plaese Change E-mail and try again",
                    })
                }
                props.resetForm();
            })
            .catch((error) => {
                console.log("error", error)
            });
    }
    return (
        <>
            {/* <MasterHeader /> */}

            <div className="section inner-content ">
                <div className="row">
                    <div className="col s9">
                        <div className="section-title">
                            <h1>Add Assign Manager</h1>
                            {/* <div className="nav-wrapper inner-breadcrumb">
                            <div className="col s12 pad-l-0">
                                <a href="#!">Assign Managers </a>
                                <a href="#!">Add Assign Manager</a>
                            </div>
                        </div> */}
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="invoice-create-btn mt-10 right pr-5">
                            <button onClick={BackBtn} class="waves-effect waves-light btn-large mb-1 mr-1">
                                <i className="material-icons">arrow_back</i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="pt-0 main-screen">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validate}
                            onSubmit={(values, props) => {
                                OnSubmitForm(values, props)
                            }}
                        >
                            {formik => (
                                <Form>
                                    <div>
                                        <div className="row">
                                            <TextField
                                                label="First Name"
                                                elementType="add"
                                                name="first_name"
                                                type="text"
                                            />
                                            <TextField
                                                label="Last Name"
                                                elementType="add"
                                                name="last_name"
                                                type="text"
                                            />
                                        </div>
                                        <div className="row">
                                            <TextField
                                                label="E-mail"
                                                elementType="add"
                                                name="user_email"
                                                type="text"
                                            />
                                            <TextField
                                                label="How many employee needs to be allowed ?"
                                                elementType="add"
                                                name="count"
                                                type="text"
                                            />
                                        </div>

                                        <div class="input-field col m12 s12 pad-r center">
                                            <button
                                                class="waves-effect waves-light btn-large mb-1 mr-1"
                                                type="submit"
                                                name="action"
                                            >
                                                Submit
                                            </button>
                                        </div>

                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/assign_manager'} />
            </div>

        </>
    )
}
