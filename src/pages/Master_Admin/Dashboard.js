import React, { Component } from 'react'
import { useHistory } from 'react-router-dom';

export default function Dashboard() {

    const history = useHistory()
    const user = JSON.parse(localStorage.getItem("company"));
    if (user) {
        return (
            <div id="main">
                <div className="row">
                    <div className="col s12">
                        <div className="container">
                            <div className="section dashboard-content">
                                <div className="pt-0">
                                    <h1>Welcome to our Portal for Master Administrator</h1>
                                    <div className="row padding-top">
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/password_setting") }}>
                                            <div className="tiles">
                                                <i className="material-icons">password</i>
                                                <a>Password Settings</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/company_setting") }}>
                                            <div className="tiles">
                                                <i className="material-icons">domain</i>
                                                <a >Company Settings</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/assign_manager") }}>
                                            <div className="tiles">
                                                <i className="material-icons">people</i>
                                                <a >Assign Managers</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/view_all_users") }}>
                                            <div className="tiles">
                                                <i className="material-icons">manage_search </i>
                                                <a >View All Users</a>
                                            </div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/transfermaneger") }}>
                                            <div className="tiles">
                                                <i className="material-icons">transform</i>
                                                <a >Transfer Manager Rights</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/request_questionarie") }}>
                                            <div className="tiles">
                                                <i className="material-icons">add_to_queue</i>
                                                <a >Request Questionnaire Changes</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/managehierarchy") }}>
                                            <div className="tiles">
                                                <i className="material-icons">miscellaneous_services</i>
                                                <a >Managing Hierarchy Rights</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/survey") }}>
                                            <div className="tiles">
                                                <i className="material-icons">query_stats</i>
                                                <a >Survey</a>					</div>
                                        </div>
                                        <div className="col s12 m6 l6 xl4" style={{ cursor: "pointer" }} onClick={() => { history.push("/otherchanges") }}>
                                            <div className="tiles">
                                                <i className="material-icons">production_quantity_limits</i>
                                                <a >Other Packages/Amplioso <br />Support</a>					</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content-overlay" />
                    </div>
                </div>
            </div>
            // </div>
        )
    }

}

