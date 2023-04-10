import { CircularProgress } from '@material-ui/core';
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
    const [employeeList, setemployeeList] = useState('');
    const [ManagerList, setManagerList] = useState('');

    const [feed_freqList, setfeed_freqList] = useState('');
    const [feedyear, setfeedyear] = useState('');

    // const [yearList, setyearList] = useState('');
    const yearList = range(1800, getYear(new Date()));
    const history = useHistory()

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' })

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

        console.log(values);
        console.log(values.manager);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", id.token);
        var raw = JSON.stringify({
            manager_id: values.manager,
            employee_id: values.emp,
            feedback_frequency: values.feed_freq,
            year: values.year
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


    const getEmployyes = async (Para_id) => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", id.token);
        console.log(id.userId)

        let res = await fetch(BaseURL + `/employeedetails/manager/${Para_id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        console.log(result);
        setemployeeList(result);

    }


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

    const handleChangeA = (e) => {
        // console.log(e)
        getEmployyes(e)
    }

    const handleChangeB = (e) => {
        console.log(e)
        getFeedback(e)
    }

    const handleChangeC = (e) => {
        console.log(e)
        console.log(feedyear)
        
        var yearArr=[];
        console.log(employeeList[e-1])
        yearArr.push(employeeList[e-1])
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
                {(resultLength > 0) ? (
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
                                        <CustomSelect
                                            onChange={handleChangeA}
                                            options={ManagerList}
                                            Field={'manager'}
                                            Fieldname={'manager'}
                                            className='select-dropdown dropdown-trigger'
                                        />
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
                                        <CustomSelect
                                            onChange={handleChangeB}
                                            options={employeeList}
                                            Field={'emp'}
                                            Fieldname={'emp'}
                                            className='select-dropdown dropdown-trigger'
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Feedback Frequency</h6>
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <CustomSelect
                                            // onChange={value => formik.setFieldValue('feed_freq', value)}
                                            onChange={handleChangeC}
                                            options={feed_freqList}
                                            Field={'feed_freq'}
                                            Fieldname={'feed_freq'}
                                            className='select-dropdown dropdown-trigger'
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col m2 s12 padtb">
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <h6 >Select Year</h6>
                                    </div>
                                    <div className="col m4 s12 padtb">
                                        <CustomSelect
                                            search={false}
                                            // onChange={value => formik.setFieldValue('year', value)}

                                            // onChange={value => setFieldValue('feedback_year', value)}
                                            // value={values.feedback_year}
                                            // defValue={yearList}
                                            options={feedyear}
                                            Field={'emp_year'}
                                            Fieldname={'emp_year'}
                                            className='select-dropdown dropdown-trigger'
                                        />

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
