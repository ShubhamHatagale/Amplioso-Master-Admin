import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory, } from "react-router-dom";
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

    return (
        <Switch>
            <Route exact path="/login" component={Login}>
            </Route>
            <Route path="/forgot-password" component={ForgotPassword}>
            </Route>
            <ProtectedRoute exact path="/">
                <MasterSidebar data={<MasterDashboard />}
                    data1={<MasterHeader />}
                />
            </ProtectedRoute>
            
            <ProtectedRoute exact path="/company_profile">
                <MasterSidebar data={<CompanySetting />}
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
    );
};
export default MasterAdminRouting