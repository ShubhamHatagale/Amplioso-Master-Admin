import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import EditTextField from "../../../components/EditTextField";
import MaxWidthDialog from '../../../components/AlertDialogBox';
require("dotenv").config();

export default function EditAssignManagers() {
    const location = useLocation();
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' });
    let [showEdit, setshowEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    let [result, setresult] = useState([]);
    let [comid, setcomid] = useState("");

    const onInputChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };
    const BackBtn = () => {
        history.push("/assign_manager");
    }

    const HandleStatus = (val) => {
        result.map((item, key) => {
            setSelectedUser({
                first_name: selectedUser.first_name,
                last_name: selectedUser.last_name,
                count: selectedUser.count,
                company_id: selectedUser.company_id,
                user_email: selectedUser.user_email,
                created_by: selectedUser.created_by,
                updated_by: selectedUser.updated_by,
            });
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            let id = location.state.detail;
            setcomid(location.state.detail);
            const token = localStorage.getItem("masters_jwt");
            if (location.state.type == "Edit") {
                setshowEdit(true);
            }
            var myHeaders = new Headers();
            myHeaders.append("Authorization", token);
            myHeaders.append("Content-type", "application/json");
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            let res = await fetch(APIUrl + `/company/managers/id/${id}`, requestOptions);
            let response = await res.json();
            let result = response.data;
            console.log(result)
            setresult(result);
            result.map((item, key) => {
                setSelectedUser({
                    first_name: item.first_name,
                    last_name: item.last_name,
                    count: item.count,
                    role: 3,
                    company_id: item.company_id,
                    user_email: item.user_email,
                    created_by: item.created_by,
                    updated_by: item.updated_by,
                });
            });
        };
        fetchData();
    }, [location]);


    const validate = Yup.object({
        first_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed. ").required('First Name is required').min(2, "First Name must be minimum 2 characters long").max(15, "First Name must be 2 to 15 characters long."),
        last_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.").required('Last Name is required').min(2, "Last Name must be minimum 2 characters long").max(15, "Last Name must be 2 to 15 characters long."),
        count: Yup.string().required('Count is Required').matches(/^\d+$/, "Only Numbers are Allowed"),
        user_email: Yup.string().email().required('Email is Required').matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please enter a valid email."),
    })
    const OnSubmitForm = (values, props) => {
        console.log(JSON.stringify(values))
        const token = localStorage.getItem("masters_jwt");
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        var raw = JSON.stringify({
            first_name: values.first_name,
            last_name: values.last_name,
            user_email: values.user_email,
            role: selectedUser.role,
            company_id: values.company_id,
            created_by: selectedUser.created_by,
            count: values.count,
            updated_by: id
        });
        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(APIUrl + `/company/managers/${comid}`, requestOptions)
            .then((response) => response.json())
            .then((resData) => {
                console.log(resData);
                if (resData.status == 200) {
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Alert',
                        subTitle: "Assign Manager Updated Successfully",
                    })
                }
                if (resData.status == 400) {
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Error',
                        subTitle: "Manager Already Exist With This E-mail,Plaese Change E-mail and try again",
                    })
                }
            })
            .catch((error) => console.log("error", error));
    };
    return (
        <div className="section inner-content ">
            <div className="row">
                <div className="col s9">
                    <div className="section-title">
                        <h1>{showEdit ? "Edit" : "View"} Assigned Manager</h1>
                        {/* <div className="nav-wrapper inner-breadcrumb">
                            <div className="col s12 pad-l-0">
                                <a href="#!">Assign Managers </a>
                                <a href="#!">{showEdit ? "Edit" : "View"} Assigned Manager</a>
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
            {showEdit ? ( 
                <div className="card">
                    <div className="pt-0 main-screen">
                        <Formik
                            initialValues={selectedUser}
                            enableReinitialize
                            validationSchema={validate}
                            onSubmit={(values, props) => {
                                OnSubmitForm(values, props);
                            }}
                        >
                            {(formik) => (
                                <Form>
                                    <div>
                                        <div className="row">
                                            <EditTextField
                                                label="First Name"
                                                name="first_name"
                                                type="text"
                                                elementtype="edit"
                                                onInputChange={onInputChange}
                                                value={selectedUser.first_name}
                                            />
                                            <EditTextField
                                                label="Last Name"
                                                name="last_name"
                                                type="text"
                                                elementtype="edit"
                                                onInputChange={onInputChange}
                                                value={selectedUser.last_name}
                                            />
                                        </div>
                                        <div className="row">
                                            <EditTextField
                                                label="E-mail"
                                                name="user_email"
                                                type="text"
                                                elementtype="edit"
                                                onInputChange={onInputChange}
                                                value={selectedUser.user_email}
                                            />
                                            <EditTextField
                                                label="How many employee needs to be allowed ?"
                                                name="count"
                                                type="text"
                                                elementtype="edit"
                                                onInputChange={onInputChange}
                                                value={selectedUser.count}
                                            />
                                        </div>
                                        <div class="input-field col m12 s12 pad-r center">
                                            <button
                                                class="waves-effect waves-light btn-large mb-1 mr-1"
                                                type="submit"
                                                name="action"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            ) : (<div className="card">
                <div className="pt-0 main-screen">
                    <Formik
                        initialValues={selectedUser}
                        enableReinitialize
                        validationSchema={validate}
                        onSubmit={(values, props) => {
                            OnSubmitForm(values, props);
                        }}
                    >
                        {(formik) => (
                            <Form>
                                <div>
                                    <div className="row">
                                        <EditTextField
                                            label="First Name"
                                            name="first_name"
                                            type="text"
                                            elementtype="View"
                                            onInputChange={onInputChange}
                                            value={selectedUser.first_name}
                                            disabled
                                        />
                                        <EditTextField
                                            label="Last Name"
                                            name="last_name"
                                            type="text"
                                            elementtype="View"
                                            onInputChange={onInputChange}
                                            value={selectedUser.last_name}
                                            disabled
                                        />
                                    </div>
                                    <div className="row">
                                        <EditTextField
                                            label="E-mail"
                                            name="user_email"
                                            type="text"
                                            elementtype="View"
                                            onInputChange={onInputChange}
                                            value={selectedUser.user_email}
                                            disabled
                                        />
                                        <EditTextField
                                            label="How many employee needs to be allowed ?"
                                            name="count"
                                            type="text"
                                            elementtype="View"
                                            onInputChange={onInputChange}
                                            value={selectedUser.count}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>)}
            <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/assign_manager'} />
        </div>
    )
}
