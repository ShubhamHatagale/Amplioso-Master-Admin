import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory, Redirect, } from "react-router-dom";
import MasterHeader from "./components/MasterAdminComponents/MasterHeader";
import MasterSidebar from "./components/MasterAdminComponents/MasterSidebar";
import ProtectedRoute from "./components/Protected";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/forgotPassword";
import MasterDashboard from "./pages/Master_Admin/Dashboard";
import CompanySetting from "./pages/Master_Admin/CompanySetting";
import PasswordSetting from "./pages/Master_Admin/PasswordSetting";
import AssignManagers from "./pages/Master_Admin/AssignManagers/AssignManagers";
import ListQuestions from "./pages/Master_Admin/RequestQuestionarie/ListQuestions";
import AddQuestion from "./pages/Master_Admin/RequestQuestionarie/AddQuestion";
import AddAssignManagers from "./pages/Master_Admin/AssignManagers/addAssignManager";
import EditAssignManagers from "./pages/Master_Admin/AssignManagers/editAssignManager";
import ViewAllUsers from "./pages/Master_Admin/ViewAllUsers";
import { useLocation } from "react-router-dom";
import TransferManagersRights from "./pages/Master_Admin/TransferRights/TransferManagersRights";
import EmployeeView from "./pages/Master_Admin/TransferRights/EmployeeView";
import TransferRights from "./pages/Master_Admin/TransferRights/TransferRights";
import Survey from "./pages/Master_Admin/survey/Survey";
import Check from "./components/Check";
const MasterAdminRouting = () => {
    // const history = useHistory();
    // const location = useLocation();
    // const [loggedIn, setloggedIn] = useState(true); 
    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("company"));
    //     if (user) {
    //         history.push("/");
    //     }
    //     else {
    //         history.push("/")
    //     }
    // }, []);


    const history = useHistory()
    // const classes = useStyles();
    const [open1, setOpen1] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const APIUrl = process.env.REACT_APP_Base_URL;
    const token = localStorage.getItem("masters_jwt");
    const id = localStorage.getItem("masters_id");
    const [selectedUser, setSelectedUser] = useState({});
    const [loading, setloading] = useState(0);
    let [imageurl, setImageurl] = useState('');
    const [disableStatus, setdisableStatus] = useState(true);
    const locatonData = useLocation()



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
        // console.log(result[0].company_logo);
        // if(result[0].comapany_headquaters && result[0].date_of_inception ){
        //     console.log("yes")
        // }

        if (result[0].comapany_headquaters && result[0].company_logo && result[0].number_of_employee && result[0].business_sector && result[0].feedback_frequency) {
            setdisableStatus(false)
        }


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


        });
        setloading(0);

    };


    console.log(locatonData)

    useEffect(() => {
        fetchData();
        console.log(locatonData)
    }, [])

    // if(disableStatus === false){
    //     return(
    //         <Redirect to={{ pathname: '/company_profile' }} />
    //     )
    //     return false
    // }


    return (
        <>
            {disableStatus === false ? (
                <Switch>
                    <Route exact path="/login" component={Login}>
                    </Route>
                    <Route path="/forgot-password" component={ForgotPassword}>
                    </Route>

                    <ProtectedRoute exact path="/company_profile">
                        <MasterSidebar data={<CompanySetting />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                
                    <ProtectedRoute exact path="/">
                        <MasterSidebar data={<MasterDashboard />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>


                    <ProtectedRoute exact path="/password_setting">
                        <MasterSidebar data={<PasswordSetting />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>


                    <ProtectedRoute exact path="/assign_manager">
                        <MasterSidebar data={<AssignManagers />}
                        // data1={<MasterHeader />}
                        />
                    </ProtectedRoute>

                    <ProtectedRoute exact path="/view_all_users">
                        <MasterSidebar data={<ViewAllUsers />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/assign_manager/add">
                        <MasterSidebar data={<AddAssignManagers />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/assign_manager/edit">
                        <MasterSidebar data={<EditAssignManagers />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/request_questionarie">
                        <MasterSidebar data={<ListQuestions />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                    <ProtectedRoute exact path="/request_questionarie/add">
                        <MasterSidebar data={<AddQuestion />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>

                    <ProtectedRoute path="/transfer_manager_rights">
                        <MasterSidebar data={<TransferManagersRights />}
                            data1={<MasterHeader />}>
                        </MasterSidebar>
                    </ProtectedRoute>

                    <ProtectedRoute path="/employee/view">
                        <MasterSidebar data={<EmployeeView />}
                            data1={<MasterHeader />}
                        ></MasterSidebar>
                    </ProtectedRoute>
                    <ProtectedRoute path="/managers/transfer_rights">
                        <MasterSidebar data={<TransferRights />}
                            data1={<MasterHeader />}
                        ></MasterSidebar>
                    </ProtectedRoute>
                    <ProtectedRoute path="/survey">
                        <MasterSidebar data={<Survey />}
                            data1={<MasterHeader />}
                        ></MasterSidebar>
                    </ProtectedRoute>

                </Switch>
            ) :
                <Switch>
                     <Route exact path="/login" component={Login}>
                    </Route>
                    <Route path="/forgot-password" component={ForgotPassword}>
                    </Route>
                    <ProtectedRoute exact path="/company_profile">
                        <MasterSidebar data={<CompanySetting />}
                            data1={<MasterHeader />}
                        />
                    </ProtectedRoute>
                </Switch>}
            <Redirect to={{ pathname: '/company_profile' }} />
        </>

    );
};
export default MasterAdminRouting