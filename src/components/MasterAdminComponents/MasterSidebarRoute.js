import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
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
    const handleClick = () => {
        setOpen(!open);
    };
    const handleClick1 = () => {
        setOpen1(!open1);
    };
    return (
        <List
        // component="nav"
        // aria-labelledby="nested-list-subheader"
        // // subheader=
        // // {
        // //     <ListSubheader component="div" id="nested-list-subheader">
        // //     </ListSubheader>
        // // }
        // className={classes.root}
        >
            <div onClick={() => { history.push("/") }}>
                <ListItem button >
                    <ListItemIcon>
                        {/* <DvrIcon /> */}
                        <i className="material-icons">dvr</i>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/password_setting") }}>
                <ListItem button>
                    <ListItemIcon>
                        <i className="material-icons">password</i>
                    </ListItemIcon>
                    <ListItemText primary="Password Settings" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/company_setting") }}>
                <ListItem button>
                    <ListItemIcon>
                        <i className="material-icons">domain</i>
                        {/* <Domain /> */}
                    </ListItemIcon>
                    <ListItemText primary="Company Settings" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/assign_manager") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <People /> */}
                        <i className="material-icons">people</i>
                    </ListItemIcon>
                    <ListItemText primary="Assign Managers" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/view_all_users") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */}
                        <i className="material-icons">manage_search </i>
                    </ListItemIcon>
                    <ListItemText primary="View All Users" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/transfer_manager_rights") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */}
                        <i className="material-icons">transform</i>
                    </ListItemIcon>
                    <ListItemText primary="Transfer Manager Rights" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/request_questionarie") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */}
                        <i className="material-icons">add_to_queue</i>
                    </ListItemIcon>
                    <ListItemText primary="Request Questionarie" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */}
                        <i className="material-icons">miscellaneous_services</i>
                    </ListItemIcon>
                    <ListItemText primary="Manage Hierarchy" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/survey") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */} 
                        <i className="material-icons">query_stats</i>
                    </ListItemIcon>
                    <ListItemText primary="Survey" />
                </ListItem>
            </div>
            <div onClick={() => { history.push("/") }}>
                <ListItem button>
                    <ListItemIcon>
                        {/* <PersonIcon /> */}
                        <i className="material-icons">production_quantity_limits</i>
                    </ListItemIcon>
                    <ListItemText primary="Other Changes" />
                </ListItem>
            </div>
        </List>
    );
}