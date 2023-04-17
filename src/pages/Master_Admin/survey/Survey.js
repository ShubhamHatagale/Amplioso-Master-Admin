import { Box, CircularProgress, FormControl } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table'
import ConfirmDialog from "../../../components/DialogBox";
import MaxWidthDialog from '../../../components/AlertDialogBox';

import { FormControlLabel, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { Form, Formik } from 'formik';
import getYear from "date-fns/getYear";
import * as Yup from "yup";
// import M from "materialize-css";
import CustomSelect from "../../../components/SelectEdit";
// import MaxWidthDialog from '../../components/AlertDialogBox';
require("dotenv").config();

export default function Survey() {
    const range = (start, end) => {
        return new Array((end + 1) - start).fill().map((d, i) => i + start);
    };

    const token = localStorage.getItem("manager_jwt");
    const BaseURL = process.env.REACT_APP_Base_URL;
    const backendUrl = process.env.REACT_APP_Base_URL_Backend;
    //   const id = localStorage.getItem("company");
    const id = JSON.parse(localStorage.getItem("company"));
    const manager_id = JSON.parse(localStorage.getItem("manager_id"));

    let [showremind, setshowremind] = useState(false);
    let [selectedUser, setSelectedUser] = useState({});
    let [reminderIdlabel, setreminderIdlabel] = useState('');
    let [notificationIdlabel, setnotificationIdlabel] = useState('');
    let [extensionIdlabel, setextensionIdlabel] = useState('');
    let [resultLength, setresultLength] = useState('');
    let [generalmanagerid, setGenerealmanagerid] = useState('');
    const [employeeList, setemployeeList] = useState([]);
    const [ManagerList, setManagerList] = useState([]);

    const [feed_freqList, setfeed_freqList] = useState([]);
    const [feedyear, setfeedyear] = useState([]);

    // const [yearList, setyearList] = useState('');
    const yearList = range(1800, getYear(new Date()));
    const history = useHistory()

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' })

    const [DefaultItem, setDefaultItem] = useState();
    const [val_emp, setval_emp] = useState();
    const [val_feed, setval_feed] = useState();
    const [val_year, setval_year] = useState('');

    const Default = { firstName: "John", lastName: "Doe", age: 46 };


    const onInputChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
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

    const FeedFreq = [
        { feedback_frequencies: 'Annually', id: 1 },
        { feedback_frequencies: 'Semi-Annually', id: 2 },
        { feedback_frequencies: 'Quaterly', id: 3 },
        { feedback_frequencies: 'Monthly', id: 4 },
    ]

    useEffect(() => {
        // getEmployyes()
        getManagers()
        // getFeedback()
        // getRecordsByManagersId();

        const fetchData = async () => {
            const token = localStorage.getItem("manager_jwt");
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'multipart/form-data')
            myHeaders.append("Authorization", id.token);
            let res = await fetch(BaseURL + `/company/general_managers/${manager_id}`,
                {
                    method: "get",
                    headers: myHeaders
                }
            );
            let response = await res.json();
            let result = response.data;

            setresultLength(result.length);
            console.log(result.length);
            result.map((item, key) => {
                setGenerealmanagerid(item.id);
                setSelectedUser({
                    reminder_setting_manager: item.reminder_setting_manager,
                    notification_setting_menager: item.notification_setting_menager,
                    extension_survey_period: item.extension_survey_period
                })

            })
        }
        fetchData();
    }, []);

    const initialValues = {
        reminder_setting_manager: "",
        notification_setting_menager: "",
        extension_survey_period: "",
    };
    const validate = Yup.object({
        reminder_setting_manager: Yup.number().required('required'),
        notification_setting_menager: Yup.number().required('required'),
        extension_survey_period: Yup.number().required('required'),
    });

    const OnSubmitForm = async (values) => {
        let manager_id=feedyear[0].manager_id;
        console.log(feedyear[0].manager_id)
        console.log(values);
        console.log(values.manager);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", id.token);
        var raw = JSON.stringify({
            manager_id: manager_id,
            employee_id: val_emp,
            feedback_frequency: val_feed,
            year: val_year
        })
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        let res = await fetch(`${backendUrl}/masters/collect_feedback/feedback_report`, requestOptions);

        let response = await res.json();
        console.log(response)

        if (response.status == 200) {
            const respLength = response.data;
            console.log(respLength)
            // getEmployyes()
            getManagers()
            // getFeedback()
            window.location.replace(`http://dev.amplioso.com/main_amp/ReportPdf?id=${respLength.id}&company_id=${respLength.company_id}`)
            // window.location.replace(`http://dev.amplioso.com/main_amp/ReportPdf?id=${respLength.id}`)

            // history.push({
            //   state: respLength,

            //   pathname: `http://localhost:3001/main_amp/ReportPdf?id=${2}`

            // })

        } else {
            alert("no record found")
        }


    };




    const getManagers = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", id.token);
        console.log(id.userId)

        let res = await fetch(BaseURL + `/company/managers/${id.userId}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        console.log(result);
        setManagerList(result);
    }



    const getFeedback = async () => {

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", id.token);
        let res = await fetch(BaseURL + `/feedback`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        // feedback_data = result;
        console.log(employeeList)

        console.log(result)
        var arr = []
        var arr2 = []

        // var arrYear = []
        employeeList.map((item, key) => {
            console.log(FeedFreq[item.feedback_frequency])
            arr.push(FeedFreq[item.feedback_frequency - 1])
            arr2.push(item.feedback_year)

        })
        console.log(arr)
        // console.log(arr2)
        // setfeedyear(arr2)
        setfeed_freqList(arr);
    }

    const handleChangeA = async (e) => {
        console.log(e.target.value)
        var name = e.target.name;
        var value = e.target.value;



        console.log(name)
        switch (name) {
            case "manager":

                setfeed_freqList([])
                setfeedyear([])
                setfeedyear([])

                var myHeaders = new Headers();
                myHeaders.append('Content-Type', 'multipart/form-data')
                myHeaders.append("Authorization", id.token);
                console.log(id.userId)

                let res = await fetch(BaseURL + `/employeedetails/manager/${value}`,
                    {
                        method: "get",
                        headers: myHeaders
                    }
                );
                let response = await res.json();
                let result = response.data;
                console.log(result);
                setemployeeList(result);
                setDefaultItem(value)
                break;
            case "employee":
                setfeedyear([])
                setval_emp(value)
                console.log("mannage")
                let myHeaders1 = new Headers();
                myHeaders1.append('Content-Type', 'multipart/form-data')
                myHeaders1.append("Authorization", id.token);
                let res1 = await fetch(BaseURL + `/collect_feedback/employee/${value}`,
                    {
                        method: "get",
                        headers: myHeaders1
                    }
                );
                let response1 = await res1.json();
                let result1 = response1.data;
                console.log(employeeList)

                // console.log(result1)
                // var arr = []
                // var arr2 = []

                // // var arrYear = []
                // employeeList.map((item, key) => {
                //     console.log(FeedFreq[item.feedback_frequency])
                //     arr.push(FeedFreq[item.feedback_frequency - 1])
                //     arr2.push(item.feedback_year)
                // })
                // console.log(arr)
                // console.log(arr2)
                // setfeedyear(arr2)
                setfeed_freqList(result1);
                break;

            case "feedback":
                console.log(value)
                console.log(employeeList)
                setval_feed(value)

                let myHeaders2 = new Headers();
                myHeaders2.append('Content-Type', 'multipart/form-data')
                myHeaders2.append("Authorization", id.token);
                let res2 = await fetch(BaseURL + `/collect_feedback/employee/${value}`,
                    {
                        method: "get",
                        headers: myHeaders2
                    }
                );
                let response2 = await res2.json();
                let result2 = response2.data;
                console.log(employeeList)

                // console.log(result2)
                // var arr = []
                // var arr2 = []

                // // var arrYear = []
                // employeeList.map((item, key) => {
                //     console.log(FeedFreq[item.feedback_frequency])
                //     arr.push(FeedFreq[item.feedback_frequency - 2])
                //     arr2.push(item.feedback_year)
                // })
                // console.log(arr)
                // console.log(arr2)
                setfeedyear(result2)
                // setfeed_freqList(result1);
                // var yearArr = [];
                // console.log(employeeList[e - 1])
                // yearArr.push(employeeList[e - 1])
                // setfeedyear(yearArr)
                break;
            case "year":
                setval_year(value)
                break
            default:
            // text = "No value found";
        }


    }

    const handleChangeB = (e) => {
        console.log(e)
        getFeedback(e)
    }

    const handleChangeC = (e) => {
        console.log(e)
        console.log(feedyear)

        var yearArr = [];
        console.log(employeeList[e - 1])
        yearArr.push(employeeList[e - 1])
        setfeedyear(yearArr)

        // setfeedyear(feedyear[e])


        // getFeedback(e)
    }




    return (
        <div>
            <div className="section inner-content">
                <div className="section-title">
                    <h1>Survey Report</h1>
                    {/* <div className="nav-wrapper inner-breadcrumb">
                        <div className="col s12 pad-l-0">
                            <a href="#!">Dashboard </a>
                            <a href="#!">General Manager Settings</a>
                        </div>
                    </div> */}
                </div>
                {console.log("check-->" + resultLength)}
                {(resultLength == 0) ? (
                    <div className="pt-5 main-screen">

                        {ManagerList && yearList ? (
                            <div>
                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Manager
                                            {/* <span onClick={setshowremind(showremind = !showremind)}> <b>?</b> </span> */}
                                        </h6>
                                        {showremind ? (
                                            <div>
                                                <ul>
                                                    <li>Just enough : 2 week</li>
                                                    <li>Don’t be shy : 1 week</li>
                                                </ul>
                                            </div>
                                        ) : (null)}
                                    </div>

                                    <div className="col m4 s12 padtb">

                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select Manager</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='manager'
                                                    value={DefaultItem}
                                                    // placeholder="seee"
                                                    onChange={handleChangeA}
                                                    label="DefaultItem"
                                                    // onChange={(e) => setDefaultItem(e.target.value)}
                                                    style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}
                                                >

                                                    {ManagerList.map((item, key) => {
                                                        return (
                                                            <MenuItem value={item.id} >{item.first_name} {item.last_name}</MenuItem>
                                                        )
                                                    })}
                                                    {/* {Default.map((item, key) => {
                                                            return (
                                                                <MenuItem value={item.id} >{item.first_name} {item.last_name}</MenuItem>
                                                            )
                                                        })} */}
                                                </Select>
                                            </FormControl>
                                        </Box>

                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Employee
                                            {/* <span onClick={setshowremind(showremind = !showremind)}> <b>?</b> </span> */}
                                        </h6>
                                        {showremind ? (
                                            <div>
                                                <ul>
                                                    <li>Just enough : 2 week</li>
                                                    <li>Don’t be shy : 1 week</li>
                                                </ul>
                                            </div>
                                        ) : (null)}
                                    </div>

                                    <div className="col m4 s12 padtb">
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select Employee</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='employee'
                                                    value={val_emp}
                                                    // placeholder="seee"
                                                    onChange={handleChangeA}
                                                    label="DefaultItem"
                                                    // onChange={(e) => setDefaultItem(e.target.value)}
                                                    style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}
                                                >

                                                    {employeeList.map((item, key) => {
                                                        return (
                                                            <MenuItem value={item.id} >{item.first_name} {item.last_name}</MenuItem>
                                                        )
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Box>



                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Feedback Frequency</h6>
                                    </div>
                                    <div className="col m4 s12 padtb">

                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select Feedback Frequency</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='feedback'
                                                    value={val_feed}
                                                    // placeholder="seee"
                                                    onChange={handleChangeA}
                                                    label="DefaultItem"
                                                    // onChange={(e) => setDefaultItem(e.target.value)}
                                                    style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}
                                                >

                                                    {feed_freqList.map((item, key) => {
                                                        return (
                                                            <MenuItem value={item.feedback_frequency} >{FeedFreq[item.feedback_frequency - 1].feedback_frequencies} </MenuItem>
                                                        )
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Box>



                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Year</h6>
                                    </div>
                                    <div className="col m4 s12 padtb">


                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name='year'
                                                    value={val_year}
                                                    // placeholder="seee"
                                                    onChange={handleChangeA}
                                                    label="DefaultItem"
                                                    // onChange={(e) => setDefaultItem(e.target.value)}
                                                    style={{ border: "0.5px solid #e7d4d4", borderRadius: "2px", padding: "5px", height: "50px" }}
                                                >

                                                    {feedyear.map((item, key) => {
                                                        return (
                                                            <MenuItem value={item.feedback_year} >{item.feedback_year} </MenuItem>
                                                        )
                                                    })}

                                                </Select>
                                            </FormControl>
                                        </Box>

                                        {/* <CustomSelect
                                            search={false}
                                            // onChange={value => formik.setFieldValue('year', value)}

                                            // onChange={value => setFieldValue('feedback_year', value)}
                                            // value={values.feedback_year}
                                            // defValue={yearList}
                                            options={feedyear}
                                            Field={'emp_year'}
                                            Fieldname={'emp_year'}
                                            className='select-dropdown dropdown-trigger'
                                        /> */}

                                    </div>

                                    <div class="input-field col m8 s8 pad-r center">
                                        <button
                                            class="waves-effect waves-light btn-large mb-1 mr-1"
                                            type="submit"
                                            name="action"
                                            onClick={OnSubmitForm}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ) : null}

                    </div>
                ) : null}
            </div>
            <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/'} />
        </div>
    )
}
