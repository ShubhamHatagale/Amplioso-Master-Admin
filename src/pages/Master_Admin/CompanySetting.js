import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import EditTextField from "../../components/EditTextField";
import CustomSelect from "../../components/SelectEdit";
import * as moment from "moment";
import MaxWidthDialog from '../../components/AlertDialogBox';
import { getAllEmployeeApi } from '../services/AllEmployee';
import { getAllAvgEmployeeApi } from '../services/AllAvgEmployee';
import { getAllFeedbackApi } from '../services/AllFeedback';
import { getAllSectorApi } from '../services/allSector';
import { getAllHeadquatersApi } from '../services/AllHeadquaters';
import { getAllPackagesApi } from '../services/AllPackages'
import getYear from "date-fns/getYear";
import CircularProgress from '@material-ui/core/CircularProgress';
import MasterSidebarRoute from '../../components/MasterAdminComponents/MasterSidebarRoute';
import { useHistory } from 'react-router-dom';
require("dotenv").config();

export default function CompanySetting() {
    const range = (start, end) => {
        return new Array((end + 1) - start).fill().map((d, i) => i + start);
    };
    const years = range(1800, getYear(new Date()));
    const APIUrl = process.env.REACT_APP_Base_URL;
    const token = localStorage.getItem("masters_jwt");
    const id = localStorage.getItem("masters_id");
    const [selectedUser, setSelectedUser] = useState({});
    const [loading, setloading] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '', link: '' })
    const [getHeadquaterdata, setgetHeadquaterdata] = useState('');
    const [getbusinessdata, setgetbusinessdata] = useState('');
    const [getEmployeeNo, setgetEmployeeNo] = useState('');
    const [getBusinessSectordata, setgetBusinessSectordata] = useState('');
    const [getinceptiondata, setgetinceptiondata] = useState('');
    const [getfeeddata, setgetfeeddata] = useState('');
    let [packagesIdName, setPackagesIdName] = useState('')
    let [packages, setgetPackage] = useState('');
    // let [loading, setLoading] = useState(false);
    let [imageurl, setImageurl] = useState('');
    let [imageUpload, setimageUpload] = useState("");
    let [HeadquatersIdName, setHeadquatersIdName] = useState('');
    let [employeeIdName, setEmployeeIdName] = useState('');
    let [avgEmployeeIdName, setAvgEmployeeIdName] = useState('');
    let [sectorIdName, setSectorIdName] = useState('');
    let [feedbackIdName, setFeedbackIdName] = useState('');
    let [userid, setUserId] = useState(0)
    const history = useHistory()
    const onInputChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };
    const fileHandler = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImageurl(URL.createObjectURL(event.target.files[0]))
            setimageUpload(event.target.files[0]);
        }
    };

    useEffect(() => {
        setloading(1);
        getHeadquaters();
        getBusiness();
        getEmployee();
        getBusinessSector();
        getInception();
        getFeedback();
        getAllPackage();
        const fetchData = async () => {
            const token = localStorage.getItem("masters_jwt");
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
            console.log("output--0");
            console.log(result);
            result.map((item, key) => {
                const yearOfInception = [];
                yearOfInception[0] = item.date_of_inception;
                setSelectedUser({
                    company_name: item.company_name,
                    company_logo: item.company_logo,
                    comapany_headquaters: item.comapany_headquaters,
                    feedback_frequency: item.feedback_frequency,
                    average_employee_compansation: item.average_employee_compansation,
                    business_sector: item.business_sector,
                    number_of_employee: item.number_of_employee,
                    current_package: item.current_package,
                    date_of_inception: yearOfInception,
                    username: item.username,
                    password: item.password,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    created_by: item.created_by
                });
                setImageurl("http://dev.amplioso.com/images/" + item.company_logo)
                const fetchEmployeeddl = async () => {
                    const employee = await getAllEmployeeApi(item.number_of_employee)
                    setEmployeeIdName(employee)
                };
                const fetchAvgEmployeeddl = async () => {
                    const avgemployee = await getAllAvgEmployeeApi(item.average_employee_compansation)
                    setAvgEmployeeIdName(avgemployee)
                };
                const fetchSectorddl = async () => {
                    const sector = await getAllSectorApi(item.business_sector);
                    setSectorIdName(sector)
                };
                const fetchFeedbackddl = async () => {
                    console.log("feedback : " + item.feedback_frequency);
                    const feedback = await getAllFeedbackApi(item.feedback_frequency)
                    setFeedbackIdName(feedback);
                    console.log(feedback);
                };
                const fetchHeadquatersId = async () => {
                    const feedback = await getAllHeadquatersApi(item.comapany_headquaters)
                    setHeadquatersIdName(feedback);
                };
                const fetchPackageId = async () => {
                    const feedback = await getAllPackagesApi(item.current_package)
                    setPackagesIdName(feedback);
                };
                fetchHeadquatersId();
                fetchEmployeeddl();
                fetchAvgEmployeeddl();
                fetchSectorddl();
                fetchFeedbackddl();
                fetchPackageId();
            });
            setloading(0);
        };
        fetchData();
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        // }, 4000);
    }, []);

    if (loading === 1) {
        return <div className="loader"> <CircularProgress /></div>
    }
    const getHeadquaters = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(APIUrl + `/country`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetHeadquaterdata(result);
    }
    const getAllPackage = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/package`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetPackage(result);
    }
    const getBusiness = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/company`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetbusinessdata(result);
    }
    const getEmployee = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/employee`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetEmployeeNo(result);
    }
    const getBusinessSector = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/sector`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetBusinessSectordata(result);
    }
    const getInception = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/averageEmp`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        console.log(result)
        setgetinceptiondata(result);
    }
    const getFeedback = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(APIUrl + `/feedback`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data;
        setgetfeeddata(result);
    }

    const validate = Yup.object({
        company_name: Yup.string()
            .matches(
                /^.[a-zA-Z0-9-. ]+$/,
                {
                    message: 'Allow  only Alphanumric dash and dot',
                    excludeEmptyString: true,
                },
            )
            .required('Comapny Name is required').min(2, "Company Name must be minimum 2 characters long").max(100, "Company Name must be 2 to 15 characters long."),
        // imageUpload: Yup.string().required("Profile Image is Required"),
        comapany_headquaters: Yup.string()
            .required('Comapany Headquater is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        first_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed. ").required('First Name is required').min(2, "First Name must be minimum 2 characters long").max(15, "First Name must be 2 to 15 characters long."),
        last_name: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed.").required('Last Name is required').min(2, "Last Name must be minimum 2 characters long").max(15, "Last Name must be 2 to 15 characters long."),
        number_of_employee: Yup.string()
            .required('No of employee is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        business_sector: Yup.string()
            .required('Business Sector is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        feedback_frequency: Yup.string()
            .required('feed back Frequency is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        average_employee_compansation: Yup.string()
            .required('Average Employee Compansation is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        date_of_inception: Yup.number()
            .required('Date of Inception is required'),
        current_package: Yup.string()
            .required('Current PAckage is required').matches(/^\d+$/, "Only Numbers are Allowed"),
        username: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 charaters')
            .required('Password is required'),
    });

    const OnSubmitForm = (values, props) => {
        console.log(values.date_of_inception)
        console.log(imageurl)
        console.log(imageUpload)
        if (imageurl.includes(null)) {
            setConfirmDialog({
                isOpen: true,
                title: 'Error',
                subTitle: "Please Select Profile Image",
                // link:'/dbt'
            })
            return false
        }



        setloading(1)
        var myHeaders = new Headers();
        const token = localStorage.getItem("masters_jwt");
        myHeaders.append("Authorization", token);
        var formdata = new FormData();
        formdata.append('company_name', values.company_name);
        if (imageUpload) {
            formdata.append("company_logo", imageUpload, imageUpload.name);
        }
        formdata.append('comapany_headquaters', values.comapany_headquaters);
        formdata.append('date_of_inception', values.date_of_inception);
        formdata.append('first_name', values.first_name);
        formdata.append('last_name', values.last_name);
        formdata.append('number_of_employee', values.number_of_employee);
        formdata.append('business_sector', values.business_sector);
        formdata.append('feedback_frequency', values.feedback_frequency);
        formdata.append('average_employee_compansation', values.average_employee_compansation);
        formdata.append('current_package', values.current_package);
        formdata.append('username', values.username);
        formdata.append('password', values.password);
        formdata.append("updated_by", selectedUser.created_by);
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };
        fetch(APIUrl + `/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(resData => {
                if (resData.status == 200) {
                    setloading(0)
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Alert',
                        subTitle: "Record Updated Successfully",

                    })
                    window.location.replace("/master_admin")
                    return false
                    setConfirmDialog({
                        isOpen: true,
                        title: 'Alert',
                        subTitle: "Record Updated Successfully",
                        link: '/'

                    }).then(() => {
                        window.location.replace("/master_admin")

                    })
                    // history.push({
                    //     pathname:"/",
                    //     state:true,
                    // })

                    // return (<MasterSidebarRoute data={true} />)
                    // console.log("Records Submitted");
                }
            })
            .catch(error => console.log('error', error));
    };
    return (
        <div>
            <div className="section inner-content">
                <div className="section-title">
                    <h1>Company Profile</h1>
                    {/* <div className="nav-wrapper inner-breadcrumb">
                        <div className="col s12 pad-l-0">
                            <a href="#!">DashBoard </a>
                            <a href="#!">Company Settings</a>
                        </div>
                    </div> */}
                </div>
                <div className="pt-0 main-screen">
                    <Formik
                        initialValues={selectedUser}
                        enableReinitialize
                        validateOnBlur={false}
                        validateOnChange={false}
                        validationSchema={validate}
                        onSubmit={(values, props) => {
                            OnSubmitForm(values, props);
                        }}
                    >
                        {formik => (
                            <Form>
                                {getHeadquaterdata && getbusinessdata && getEmployeeNo && years && getBusinessSectordata && getfeeddata && getinceptiondata && HeadquatersIdName && employeeIdName && sectorIdName && avgEmployeeIdName && feedbackIdName ? (
                                    <div>
                                        <div className="row">
                                            {/* <div class="input-field col m6 s12 pad-r"> */}
                                            {/* <TextField
                                                label="First Name"
                                                elementType="add"
                                                name="first_name"
                                                type="text"
                                            /> */}
                                            <EditTextField
                                                label="Company Name"
                                                elementtype="edit"
                                                name="company_name"
                                                type="text"
                                                onInputChange={onInputChange}
                                                value={selectedUser.company_name}
                                            />
                                            {/* </div> */}
                                            <div className="col m6 s12 padtb">
                                                <div className="col m8 s12 file-field input-field">
                                                    <div className="btn float-right">
                                                        <span>File</span>
                                                        <input type="file"
                                                            onChange={fileHandler}
                                                        />
                                                        {/* <img src={imageurl} className="comapnylogoimg" width="120" height="85" /> */}
                                                    </div>
                                                    <div className="file-path-wrapper">
                                                        <input className="file-path validate"
                                                            type="text"
                                                            defaultValue="Company Logo"
                                                        />
                                                    </div>
                                                </div>
                                                {/* {console.log(imageUpload.name)} */}
                                                <img src={imageurl}
                                                    className="comapnylogoimg imageurl"
                                                    width="120" height="85"
                                                />
                                                {formik.errors.imageUpload ? <div className='error'>{formik.errors.imageUpload}</div> : null}

                                            </div>
                                        </div>
                                        <div className="row">
                                            <EditTextField
                                                label="First Name"
                                                elementtype="edit"
                                                name="first_name"
                                                type="text"
                                                onInputChange={onInputChange}
                                                value={selectedUser.first_name}
                                            />
                                            <EditTextField
                                                label="Last Name"
                                                elementtype="edit"
                                                name="last_name"
                                                type="text"
                                                onInputChange={onInputChange}
                                                value={selectedUser.last_name}
                                            />
                                        </div>
                                        <div className="row">
                                            {/* <div>
                                        <label>Organizations Headquarters Location</label>
                                    </div> */}
                                            {/* <div className="col m6 s12 padtb">
                                                <label className='.input-field.col label'>Organizations Headquarters Location</label>
                                                <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('hedquarters', value.value)}
                                                    value={formik.values.hedquarters}
                                                    options={getHeadquaterdata}
                                                    Field="Headquarter"
                                                />
                                                {formik.errors.hedquarters ? <div className='error'>{formik.errors.hedquarters}</div> : null}
                                            </div> */}
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">Company Headquarters</label>
                                                <CustomSelect
                                                    search={false}
                                                    onChange={value => formik.setFieldValue('comapany_headquaters', value)}
                                                    value={formik.values.comapany_headquaters}
                                                    defValue={HeadquatersIdName}
                                                    options={getHeadquaterdata}
                                                    Field={'Headquaters'}
                                                    Fieldname={'comapany_headquaters'}
                                                    className='select-dropdown dropdown-trigger'
                                                />
                                                {formik.errors.number_of_employee ? <div className='error'>{formik.errors.number_of_employee}</div> : null}
                                            </div>
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">Year of Business Inception (Optional) </label>
                                                <CustomSelect
                                                    search={true}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('date_of_inception', value)}
                                                    defValue={selectedUser.date_of_inception}
                                                    value={formik.values.date_of_inception}
                                                    options={years}
                                                    Field="Bussiness"
                                                />
                                                {formik.errors.date_of_inception ? <div className='error'>{formik.errors.date_of_inception}</div> : null}
                                                {/* <DatePicker
                                                    selected={year}
                                                    onChange={(date) => setYear(date)}
                                                    showYearPicker
                                                    dateFormat="yyyy"
                                                    yearItemNumber={12}
                                                /> */}
                                            </div>
                                        </div>
                                        <div className="row">
                                            {/* <div className="col m6 s12 padtb">
                                                <label>Number of Employees </label>
                                                <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('noofemployee', value.value)}
                                                    value={formik.values.noofemployee}
                                                    options={getEmployeeNo}
                                                    Field="EmployeeNo"
                                                />
                                                {formik.errors.noofemployee ? <div className='error'>{formik.errors.noofemployee}</div> : null}
                                            </div> */}
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">Number of Employees</label>
                                                <CustomSelect
                                                    search={false}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('number_of_employee', value)}
                                                    value={formik.values.number_of_employee}
                                                    defValue={employeeIdName}
                                                    options={getEmployeeNo}
                                                    Field={'Employee'}
                                                    Fieldname={'number_of_employee'}
                                                />
                                                {formik.errors.number_of_employee ? <div className='error'>{formik.errors.number_of_employee}</div> : null}
                                            </div>
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">What Sector Best Describes Your Primary Line Business</label>
                                                {/* <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('linebusiness', value.value)}
                                                    value={formik.values.linebusiness}
                                                    options={getBusinessSectordata}
                                                    Field="Bussiness"
                                                />
                                                {formik.errors.linebusiness ? <div className='error'>{formik.errors.linebusiness}</div> : null}
                                                 */}
                                                <CustomSelect
                                                    search={false}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('business_sector', value)}
                                                    value={formik.values.business_sector}
                                                    defValue={sectorIdName}
                                                    options={getBusinessSectordata}
                                                    Field={'Sector'}
                                                    Fieldname={'business_sector'}
                                                />
                                                {formik.errors.business_sector ? <div className='error'>{formik.errors.business_sector}</div> : null}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">Average Employee Annual Compensation in USD (Optional)</label>
                                                {/* <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('bussinessinception', value.value)}
                                                    value={formik.values.bussinessinception}
                                                    options={getinceptiondata}
                                                    Field="BussinessInception"
                                                />
                                                {formik.errors.bussinessinception ? <div className='error'>{formik.errors.bussinessinception}</div> : null} */}
                                                <CustomSelect
                                                    search={false}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('average_employee_compansation', value)}
                                                    value={formik.values.average_employee_compansation}
                                                    defValue={avgEmployeeIdName}
                                                    options={getinceptiondata}
                                                    Field={'AvgEmployee'}
                                                    Fieldname={'average_employee_compansation'}
                                                />
                                                {formik.errors.average_employee_compansation ? <div className='error'>{formik.errors.average_employee_compansation}</div> : null}
                                            </div>
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">360 Degree Feedback Frequency</label>
                                                {/* <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('feedback', value.value)}
                                                    value={formik.values.feedback}
                                                    options={getfeeddata}
                                                    Field="Feedback"
                                                />
                                                {formik.errors.feedback ? <div className='error'>{formik.errors.feedback}</div> : null} */}
                                                <CustomSelect
                                                    search={false}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('feedback_frequency', value)}
                                                    value={formik.values.feedback_frequency}
                                                    defValue={feedbackIdName}
                                                    options={getfeeddata}
                                                    Field={'FeedBack'}
                                                    Fieldname={'feedback_frequency'}
                                                />
                                                {formik.errors.feedback_frequency ? <div className='error'>{formik.errors.feedback_frequency}</div> : null}
                                            </div>
                                        </div>
                                        {/* <div className="row">
                                            <div className="col m6 s12 padtb">
                                                <label className="label_active">Current Package</label> */}
                                        {/* <CustomSelect
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('bussinessinception', value.value)}
                                                    value={formik.values.bussinessinception}
                                                    options={getinceptiondata}
                                                    Field="BussinessInception"
                                                />
                                                {formik.errors.bussinessinception ? <div className='error'>{formik.errors.bussinessinception}</div> : null} */}
                                        {/* <CustomSelect
                                                    search={false}
                                                    disable={true}
                                                    className='select-dropdown dropdown-trigger'
                                                    onChange={value => formik.setFieldValue('current_package', value)}
                                                    value={formik.values.current_package}
                                                    defValue={packagesIdName}
                                                    options={packages}
                                                    Field={'Package'}
                                                    Fieldname={'current_package'}
                                                />
                                                {formik.errors.current_package ? <div className='error'>{formik.errors.current_package}</div> : null}
                                            </div>
                                        </div> */}
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
                                ) : (null)}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <MaxWidthDialog
                setConfirmDialog={setConfirmDialog}
                confirmDialog={confirmDialog}
            // link={'/'} 
            />
        </div>
    )
}
