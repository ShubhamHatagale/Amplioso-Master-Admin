import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory, useLocation } from 'react-router-dom';
import MaxWidthDialog from '../AlertDialogBox';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function MasterSidebarRoute() {
    const history = useHistory()
    const classes = useStyles();
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
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '', link: '' })

    const handleClick = () => {
        setOpen(!open);
    };
    const handleClick1 = () => {
        setOpen1(!open1);
    };


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

        if (result[0].comapany_headquaters && result[0].company_logo && result[0].date_of_inception && result[0].number_of_employee && result[0].business_sector && result[0].average_employee_compansation && result[0].feedback_frequency) {
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


    const gotoPage = (path) => {
        // alert("hh")

        // disableStatus===false ?history.push("/assign_manager"):history.push("/company_profile") }
        // alert(path)
        if (disableStatus === false) {
            history.push(path)
        } else {
            // alert(path)
            setConfirmDialog({
                isOpen: true,
                title: 'Notification',
                subTitle: "Please Fill In The Company Profile All The Details To Access All The Other Functionalities",
                // link:'/dbt'
            })
            history.push("/company_profile")
        }
    }

    console.log(locatonData)

    useEffect(() => {
        fetchData();
        console.log(locatonData)
    }, [])

    return (
        <>
            <MaxWidthDialog
                setConfirmDialog={setConfirmDialog}
                confirmDialog={confirmDialog}
            // link={'/'} 
            />
            {selectedUser ? (<div>
                <List>

                    {console.log(disableStatus)}

                    <div onClick={() =>  gotoPage("/") }>
                        <ListItem button >
                            <ListItemIcon>
                                {/* <DvrIcon /> */}
                                <i className="material-icons">dvr</i>
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </div>
                    <div onClick={() => gotoPage("/password_setting") }>
                        <ListItem button>
                            <ListItemIcon>
                                <i className="material-icons">password</i>
                            </ListItemIcon>
                            <ListItemText primary="Password Settings" />
                        </ListItem>
                    </div>

                    <div onClick={() => { history.push("/company_profile") }}>
                        <ListItem button>
                            <ListItemIcon>
                                <i className="material-icons">domain</i>
                                {/* <Domain /> */}
                            </ListItemIcon>
                            <ListItemText primary="Company Profile" />
                        </ListItem>
                    </div>


                    <div >
                        <ListItem button onClick={() => gotoPage("/assign_manager")}>
                            <ListItemIcon >
                                {/* <People /> */}
                                <i className="material-icons">people</i>
                            </ListItemIcon>
                            <ListItemText primary="Assign Managers" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/view_all_users")}>
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">manage_search </i>
                            </ListItemIcon>
                            <ListItemText primary="View All Users" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/transfer_manager_rights")}>
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">transform</i>
                            </ListItemIcon>
                            <ListItemText primary="Transfer Manager Rights" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/request_questionarie")}>
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">add_to_queue</i>
                            </ListItemIcon>
                            <ListItemText primary="Request Questionarie" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/")} >
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">miscellaneous_services</i>
                            </ListItemIcon>
                            <ListItemText primary="Manage Hierarchy" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/survey")}>
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">query_stats</i>
                            </ListItemIcon>
                            <ListItemText primary="Survey" />
                        </ListItem>
                    </div>
                    <div >
                        <ListItem button onClick={() => gotoPage("/")}>
                            <ListItemIcon>
                                {/* <PersonIcon /> */}
                                <i className="material-icons">production_quantity_limits</i>
                            </ListItemIcon>
                            <ListItemText primary="Other Changes" />
                        </ListItem>
                    </div>


                </List>
            </div>) : null}
        </>
    );
}