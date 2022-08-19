import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MaxWidthDialog from '../../../components/AlertDialogBox';
import ConfirmDialog from '../../../components/DialogBox';

const EmployeeView = () => {

    const [listRecords, setlistRecords] = useState([]);
    const token = localStorage.getItem("masters_jwt")
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [deleteconfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const history = useHistory();

    let location = useLocation();
    useEffect(() => {
        GetAllRecords();
    }, [])

    const GetAllRecords = () => {
        let id = location.state.detail;
        var myHeaders = new Headers()
        myHeaders.append("Authorization", token)
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        }
        fetch(`${APIUrl}/employeedetails/manager/${id}`, requestOptions)
            .then(res => res.json())
            .then(result => {
                setlistRecords(result.data)
            })


    }

    const BackBtn = () => {
        history.push("/transfer_manager_rights");
    }

    return (
        <div className="section inner-content ">
            <div className="row">
                <div className="col s9">
                    <div className="section-title">
                        <h1>Employee Details</h1>
                        {/* <div className="nav-wrapper inner-breadcrumb">
                        <div className="col s12 pad-l-0">
                            <a href="#!">Dashboard </a>
                            <a href="#!">Assign Managers</a>
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
                <MaterialTable
                    title=""
                    style={{ padding: "20px" }}
                    columns={[
                        { title: 'First Name', field: 'first_name' },
                        { title: 'Last Name', field: 'last_name' },
                        { title: 'E-mail', field: 'user_email' },
                        // { title: 'Maximum employees allowed for surveys ?', field: 'count' },
                    ]}
                    data={
                        listRecords
                    }
                // actions={[
                //     {
                //         icon: 'visibility',
                //         tooltip: 'view employees',
                //         onClick: (event, listRecords) => { ViewManager(listRecords.id) }
                //     },
                //     {
                //         icon: 'T',
                //         tooltip: 'Transfer Rights',
                //         onClick: (event, listRecords) => { EditManager(listRecords.id) }
                //     },
                //     // {
                //     //     icon: 'delete',
                //     //     tooltip: 'delete',
                //     //     onClick: (event, listRecords) => {
                //     //         setConfirmDialog({
                //     //             isOpen: true,
                //     //             title: 'Are you sure to delete this record?',
                //     //             subTitle: "You can't undo this operation",
                //     //             onConfirm: () => { DeleteManager(listRecords.id) }
                //     //         })
                //     //     }
                //     // }
                // ]}
                // options={{
                //     actionsColumnIndex: -1,
                //     search: true
                //     ,
                //     rowStyle: (event, rowData) => ({
                //         backgroundColor: ((rowData % 2)) ? '#fff' : '#f1f1f1',
                //         fontSize: 16,
                //     }),
                //     headerStyle: {
                //         fontSize: 17,
                //         fontWeight: 'bold',
                //         backgroundColor: '#fff',
                //         borderBottom: "1px solid #000000",
                //     }
                // }}
                />
            </div>
            <ConfirmDialog
                confirmDialog={ConfirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
            <MaxWidthDialog setConfirmDialog={setDeleteConfirmDialog} confirmDialog={deleteconfirmDialog} link={'/assign_manager'} />
        </div>
    )
}

export default EmployeeView