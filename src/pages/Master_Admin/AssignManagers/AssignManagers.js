import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import TextField from '../../../components/TextField';
import MaterialTable from 'material-table'
import ConfirmDialog from "../../../components/DialogBox";
import MaxWidthDialog from '../../../components/AlertDialogBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import MasterHeader from '../../../components/MasterAdminComponents/MasterHeader';
require("dotenv").config();

export default function AssignManagers() {
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const [listRecord, setlistRecord] = useState([]);
    const [loading, setloading] = useState(0);
    const [no_of_emp, setno_of_emp] = useState(0);

    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [deleteconfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const BackBtn = () => {
        history.push("/assign_manager/add");
    }
    useEffect(() => {
        GetallRecored();
    }, [])

    const GetallRecored = async () => {
        setloading(1);
        // console.log(get_no_emp())
        let emp_count = await get_no_emp();
        console.log(await get_no_emp())

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
                setlistRecord(result.data);
                setloading(0);
                console.log(result)
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
    }
    const ViewManager = (id) => {
        history.push({
            pathname: '/assign_manager/edit',
            state: { detail: id, type: 'View' }
        });
    }

    const get_no_emp = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/company/${id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        console.log("output");
        console.log(result[0].number_of_employee);
        return result[0].number_of_employee;


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
    return (
        <>
            <MasterHeader />
            <div className="section inner-content ">
                <div className="row">
                    <div className="col s9">
                        <div className="section-title">
                            <h1>Assign Managers</h1>
                            {/* <div className="nav-wrapper inner-breadcrumb">
                            <div className="col s12 pad-l-0">
                                <a href="#!">Dashboard </a>
                                <a href="#!">Assign Managers</a>
                            </div>
                        </div> */}
                        </div>
                    </div>
                    <div className="col s3">
                        <div className="invoice-create-btn right pr-5">
                            <button onClick={BackBtn} class="waves-effect waves-light btn-large mb-1 mr-1">Add </button>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <MaterialTable
                        title=""
                        style={{ padding: "20px" }}
                        columns={[
                            { title: 'First Name', field: 'first_name' },
                            { title: 'E-mail', field: 'user_email' },
                            { title: 'Maximum employees allowed for surveys ?', field: 'count' },
                        ]}
                        data={
                            listRecord
                        }
                        actions={[
                            {
                                icon: 'visibility',
                                tooltip: 'view',
                                onClick: (event, listRecord) => { ViewManager(listRecord.id) }
                            },
                            {
                                icon: 'create',
                                tooltip: 'edit',
                                onClick: (event, listRecord) => { EditManager(listRecord.id) }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'delete',
                                onClick: (event, listRecord) => {
                                    setConfirmDialog({
                                        isOpen: true,
                                        title: 'Are you sure to delete this record?',
                                        subTitle: "You can't undo this operation",
                                        onConfirm: () => { DeleteManager(listRecord.id) }
                                    })
                                }
                            }
                        ]}
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
                </div>
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
                <MaxWidthDialog setConfirmDialog={setDeleteConfirmDialog} confirmDialog={deleteconfirmDialog} link={'/assign_manager'} />
            </div>
        </>
    )
}
