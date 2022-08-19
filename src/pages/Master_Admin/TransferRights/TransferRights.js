import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Form, Formik } from 'formik';
import MaterialTable from 'material-table';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import MaxWidthDialog from '../../../components/AlertDialogBox';
import ConfirmDialog from '../../../components/DialogBox';
// import CustomSelect from "../../../components/SelectEdit";

const TransferRights = () => {
    const location = useLocation();
    let location_id = useLocation().state.detail

    const [Default, setDefault] = useState([]);
    const [listRecords, setlistRecords] = useState([]);
    const token = localStorage.getItem("masters_jwt")
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [deleteconfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const history = useHistory();
    const [age, setAge] = useState();
    const [DefaultItem, setDefaultItem] = useState('');
    const [ToManTrans, setToManTrans] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };



    const ReminderOption = [
        { label: 'No ongoing reminders', value: 1 },
        { label: 'Just enough', value: 2 },
        { label: 'Don’t be shy', value: 3 },
    ]
    const NotificationOption = [
        { label: 'At the end of the survey period', value: 1 },
        { label: 'As responses are received', value: 2 },
        { label: 'Daily through the survey period', value: 3 },
    ]
    const ExtensionOption = [
        { label: 'No Extension', value: 0 },
        { label: 'By 1 week with a reminder sent out', value: 1 },
        { label: 'By 2 weeks with a reminder sent out', value: 2 },
    ]



    useEffect(() => {
        GetAllRecords();
    }, [])

    const GetAllRecords = () => {
        const id = localStorage.getItem("masters_id");

        var myHeaders = new Headers()
        myHeaders.append("Authorization", token)
        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        }
        fetch(`${APIUrl}/company/managers/id/${location_id}`, requestOptions)
            .then(res => res.json())
            .then(result => {
                setDefault(result.data)
            })

        fetch(`${APIUrl}/company/managers/${id}`, requestOptions)
            .then(res2 => res2.json())
            .then(res2ult => {
                setlistRecords(res2ult.data)
            })



    }


    const OnSubmitForm = (e) => {
        e.preventDefault()
        console.log(Default[0].id)
        console.log(ToManTrans)

        var myHeaders = new Headers()
        myHeaders.append("Application", token)
        myHeaders.append("Content-type", "application/json")
        var raw = JSON.stringify({
            manager_id: ToManTrans
        })

        var requestOptions = {
            method: 'put',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        }
        fetch(`${APIUrl}/employeedetails/manager_id/update/${Default[0].id}`, requestOptions)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setConfirmDialog({
                    isOpen: true,
                    title: 'Alert',
                    subTitle: "Manager Rights Transfered Successfully",
                })
            })

        fetch(`${APIUrl}/collect_feedback/manager_id/update/${Default[0].id}`, requestOptions)
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setConfirmDialog({
                    isOpen: true,
                    title: 'Alert',
                    subTitle: "Manager Rights Transfered Successfully",
                })
            })



    }

    const BackBtn = () => {
        history.push('/transfer_manager_rights')
    }

    return (
        <div>
            <div className="section inner-content">
                <div className="section-title">
                    <h1>Transfer Manager Rights</h1>

                    <button onClick={BackBtn} class=" invoice-create-btn right waves-effect waves-light btn-large mb-1 mr-1" style={{marginBottom:"10px",position:"relative",top:"-60px"}}>
                        <i className="material-icons">arrow_back</i>
                    </button>
                </div>


                <div className="pt-0 main-screen">
                    <Formik
                    // initialValues={initialValues}
                    // validationSchema={validate}
                    // validateOnBlur={false}
                    // validateOnChange={false}
                    // onSubmit={(values, props) => {
                    //     OnSubmitForm(values, props);
                    // }}
                    >
                        {formik => (
                            <Form>
                                <div>
                                    <div className="row">
                                        <div className="col m2 s12 padtb">
                                        </div>
                                        <div className="col m4 s12 padtb">
                                            <Box sx={{ minWidth: 120 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">From</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={DefaultItem}
                                                        placeholder="seee"
                                                        // displayEmpty
                                                        label="DefaultItem"
                                                        onChange={(e) => setDefaultItem(e.target.value)}
                                                        style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}
                                                    >

                                                        {Default.map((item, key) => {
                                                            return (
                                                                <MenuItem value={item.id} selected>{item.first_name} {item.last_name}</MenuItem>
                                                            )
                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                        <div className="col m4 s12 padtb">
                                            <Box sx={{ minWidth: 120 }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">To</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={ToManTrans}
                                                        label="Age"
                                                        onChange={(e) => setToManTrans(e.target.value)}
                                                        style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}

                                                    >
                                                        {/* <MenuItem value="0">optionm</MenuItem> */}

                                                        {listRecords.map((item, key) => {
                                                            if (Default[0].id != item.id) {
                                                                return (
                                                                    <MenuItem value={item.id}>{item.first_name} {item.last_name}</MenuItem>
                                                                )
                                                            }

                                                        })}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>

                                    </div>

                                    <div class="input-field col m8 s8 pad-r center">
                                        <button
                                            class="waves-effect waves-light btn-large mb-1 mr-1"
                                            type="submit"
                                            name="action"
                                            onClick={OnSubmitForm}
                                        >
                                            Transfer
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

            </div>
            <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/transfer_manager_rights'} />
        </div>
    )
}

export default TransferRights