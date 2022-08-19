import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import MaterialTable from 'material-table'
import ConfirmDialog from "../../../components/DialogBox";
import MaxWidthDialog from '../../../components/AlertDialogBox';
import CircularProgress from '@material-ui/core/CircularProgress';
require("dotenv").config();

export default function ListQuestions() {
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const [listRecord, setlistRecord] = useState([]);
    const [loading, setloading] = useState(0);
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [deleteconfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const BackBtn = () => {
        history.push("/request_questionarie/add");
    }
    useEffect(() => {
        GetallRecored();
    }, [])

    const GetallRecored = () => {
        setloading(1);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/question/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setlistRecord(result.data);
                setloading(0);
            })
            .catch(error => console.log('error', error));
    }
    if (loading === 1) {
        return <div className="loader"> <CircularProgress /></div>
    }

    const GetType = (id) => {
        switch (id) {
            case 1:
                return 'Text Field';
                break;
            case 2:
                return 'Radio Field';
                break;
            case 3:
                return 'Chechbox Field';
                break;
            case 4:
                return 'Dropdown Field';
                break;
            default:
                break;
        }
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
        let res = await fetch(APIUrl + `/question/${id}`, requestOptions);
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
        <div className="section inner-content ">
            <div className="row">
                <div className="col s8">
                    <div className="section-title">
                        <h1>List Questions </h1>
                        {/* <div className="nav-wrapper inner-breadcrumb">
                            <div className="col s12 pad-l-0">
                                <a href="#!">Dashboard </a>
                                <a href="#!">Assign Managers</a>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="col s4">
                    <div className="invoice-create-btn right pr-5">
                        {listRecord.length <= 5 && (
                            <button onClick={BackBtn} class="waves-effect waves-light btn-large mb-1 mr-1">Add_Question</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="card">
                <MaterialTable
                    title=""
                    style={{ padding: "20px" }}
                    columns={[
                        { title: 'Question', field: 'question' },
                        { title: 'Question Type', field: 'question_type', render: rowData => <div>{GetType(rowData.question_type)}</div> },
                    ]}
                    data={
                        listRecord
                    }
                    actions={[
                        // {
                        //     icon: 'visibility',
                        //     tooltip: 'view',
                        //     onClick: (event, listRecord) => { ViewManager(listRecord.id) }
                        // },
                        // {
                        //     icon: 'create',
                        //     tooltip: 'edit',
                        //     onClick: (event, listRecord) => { EditManager(listRecord.id) }
                        // },
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
            <MaxWidthDialog setConfirmDialog={setDeleteConfirmDialog} confirmDialog={deleteconfirmDialog} link={'/request_questionarie'} />
        </div>
    )
}
