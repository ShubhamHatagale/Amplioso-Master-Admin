import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import MaterialTable from 'material-table'
import ConfirmDialog from "../../components/DialogBox";
import MaxWidthDialog from '../../components/AlertDialogBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getAllRoleApi } from '../services/AllRole'
require("dotenv").config();

export default function ViewAllUsers() {
    let all_roles;
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const [getEmployee, setgetEmployee] = useState(false);
    const [getFeedback, setgetFeedback] = useState(false);
    const [listRecord, setlistRecord] = useState([]);
    let listAllRecords = [];
    const [roles, setRoles] = useState([]);
    const [AlllistRecord, setAlllistRecord] = useState([]);
    const [loading, setloading] = useState(0);
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [deleteconfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

    useEffect(() => {
        GetAllRoles();
        GetRecored();
        GetallRecored();
        console.log("listAllRecords : ");
        console.log(listAllRecords);
    }, [])
    const GetAllRoles = async () => {
        const APIUrl = process.env.REACT_APP_Base_URL;
        const token = localStorage.getItem("masters_jwt");
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/role`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        const empResult = response.data;
        setRoles(empResult);
    }

    const GetRecored = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/company/all_users/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.data);
                setAlllistRecord(result.data);
            })
            .catch(error => console.log('error', error));
    }

    const GetallRecored = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/company/managers/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.data);
                setlistRecord(result.data);
                // Managers = result.data;
                // Managers.map((item, key) => {
                //     listAllRecords.push(item);
                // })
            })
            .catch(error => console.log('error', error));
        GetallEmployee();
    }

    const getRoles = (data) => {
        for (var i = 0; i < roles.length; i++) {
            if (data === roles[i].id) {
                return roles[i].role
            }
        }
    }

    const GetallEmployee = () => {
        setloading(1);
        let Employees;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/employeedetails/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Employee :");
                console.log(result.data);
                Employees = result.data;
                Employees.map((item, key) => {
                    setlistRecord(oldArray => [...oldArray, item]);
                    // listAllRecords.push(item);
                    if (Employees.length == (key + 1)) {
                        setgetEmployee(true);
                    }
                    setloading(0);
                })
            })
            .catch(error => console.log('error', error));
        GetallFeedback();
    }

    const GetallFeedback = () => {
        setloading(1);
        let Managers;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/collect_feedback/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("Survey Recipients");
                console.log(result.data);
                Managers = result.data;
                Managers.map((item, key) => {
                    setlistRecord(oldArray => [...oldArray, item]);
                    // listAllRecords.push(item);
                    if (Managers.length == (key + 1)) {
                        setgetFeedback(true);
                    }
                    setloading(0);
                })
            })
            .catch(error => console.log('error', error));
    }

    if (loading === 1) {
        return <div className="loader"> <CircularProgress /></div>
    } 

    const EditManager = (id) => {
        history.push({
            pathname: '/assign_manager/edit',
            state: { detail: id, type: 'Edit' }
        });
        // }
        const ViewManager = (id) => {
            history.push({
                pathname: '/assign_manager/edit',
                state: { detail: id, type: 'View' }
            });
        }
        const DeleteManager = async (id) => {
            setConfirmDialog({
                ...confirmDialog,
                isOpen: false
            })
            var myHeaders = new Headers();
            myHeaders.append("Authorization", token);
            myHeaders.append("Content-type", "application/json");
            var requestOptions = {
                method: 'delete',
                headers: myHeaders,
                redirect: 'follow'
            };
            let res = await fetch(APIUrl + `/company/managers/${id}`, requestOptions);
            let response = await res.json();
            console.log(response)
            if (response.status == 200) {
                setDeleteConfirmDialog({
                    isOpen: true,
                    title: 'Delete',
                    subTitle: "Record Deleted Successfully",
                })
                GetallRecored()
            }
        };
    }

    return (
        <div className="section inner-content ">
            <div className="row">
                <div className="col s9">
                    <div className="section-title">
                        <h1>View All Users</h1>
                        {/* <div className="nav-wrapper inner-breadcrumb">
                            <div className="col s12 pad-l-0">
                                <a href="#!">Dashboard </a>
                                <a href="#!">Assign Managers</a>
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* <div className="col s3">
                    <div className="invoice-create-btn right pr-5">
                        <button onClick={BackBtn} class="waves-effect waves-light btn-large mb-1 mr-1">Add </button>
                    </div>
                </div> */}
            </div>
            <div className="card">
                <div>
                    {/* <div>{JSON.stringify(getEmployee)}</div> */}
                    {/* <div>{JSON.stringify(getFeedback)}</div> */}
                    {/* <div>{JSON.stringify(listRecord)}</div> */}
                    {/* <div>{JSON.stringify(listAllRecords)}</div> */}
                    {/* <div>{JSON.stringify(listAllRecord.Managers)}</div> */}
                </div>
                {roles && AlllistRecord ? (
                    <MaterialTable
                        title=""
                        style={{ padding: "20px" }}
                        columns={[
                            { title: 'First Name', field: 'first_name' },
                            { title: 'Last Name', field: 'last_name' },
                            { title: 'E-mail', field: 'user_email' },
                            { title: 'Role', field: 'role', render: rowData => <div>{getRoles(rowData.role)}</div> },
                            // { title: 'Role', field: 'ViewRole.role' },
                        ]}
                        data={
                            AlllistRecord
                            // listRecord
                        }
                        // actions={[
                        //     {
                        //         icon: 'visibility',
                        //         tooltip: 'view',
                        //         onClick: (event, listRecord) => { ViewManager(listRecord.id) }
                        //     },
                        //     {
                        //         icon: 'create',
                        //         tooltip: 'edit',
                        //         onClick: (event, listRecord) => { EditManager(listRecord.id) }
                        //     },
                        //     {
                        //         icon: 'delete',
                        //         tooltip: 'delete',
                        //         onClick: (event, listRecord) => {
                        //             setConfirmDialog({
                        //                 isOpen: true,
                        //                 title: 'Are you sure to delete this record?',
                        //                 subTitle: "You can't undo this operation",
                        //                 onConfirm: () => { DeleteManager(listRecord.id) }
                        //             })
                        //         }
                        //     }
                        // ]}
                        options={{
                            actionsColumnIndex: -1,
                            search: true
                            ,
                            rowStyle: (event, rowData) => ({
                                backgroundColor: ((rowData % 2)) ? '#fff' : '#f1f1f1',
                                fontSize: 16,
                            }),
                            headerStyle: {
                                fontSize: 17,
                                fontWeight: 'bold',
                                backgroundColor: '#fff',
                                borderBottom: "1px solid #000000",
                            }
                        }}
                    />
                ) : (null)}
            </div>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <MaxWidthDialog setConfirmDialog={setDeleteConfirmDialog} confirmDialog={deleteconfirmDialog} link={'/assign_manager'} />
        </div>
    )
}
