import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Form, Formik, FieldArray } from 'formik';
import * as Yup from "yup";
import TextField from '../../../components/TextField';
import QuestionTextField from '../../../components/QuestionTextField';
import MaxWidthDialog from '../../../components/AlertDialogBox';
import CustomSelect from "../../../components/SelectEdit";
require("dotenv").config();
export class Option {
    constructor() {
        this.option = "";
    }
}
export default function AddAssignManagers() {
    const history = useHistory();
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '', type: '' });
    const BackBtn = () => {
        history.push("/request_questionarie");
    }
    const GetQuestionTypes = [
        { label: 'Text Field', value: 1 },
        { label: 'Radio Field', value: 2 },
        { label: 'Chechbox Field', value: 3 },
        { label: 'Dropdown Field', value: 4 },
    ]
    const initialValues = {
        question: '',
        question_type: '',
        option: [],
    }
    useEffect(() => {

    }, [])
    const validate = Yup.object({
        question: Yup.string().matches(/^[ A-Za-z0-9\?,-]*$/, "Only alphanumeric,question,comma and dash  are allowed. ").required('Question is required').min(5, "Question must be minimum 5 characters long"),
        question_type: Yup.number().required('Question Type is required'),
        option: Yup.array().of(
            Yup.object().shape({
                option: Yup.string().required("option is required").matches(/^[ A-Za-z0-9\?,-]*$/, "Only alphanumeric,question,comma and dash  are allowed. ").required('Option is required'),
            })
        )
    })
    const OnSubmitForm = (values, props) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        var raw = JSON.stringify({
            question: values.question,
            question_type: values.question_type,
            company_id: id,
        })
        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        fetch(APIUrl + `/question`, requestOptions)
            .then((response) => response.json())
            .then((resData) => {
                console.log(resData);
                let questionId = resData.resultId;
                if (resData.status == 200) {
                    console.log(
                        values.option.length
                    );
                    if (values.option.length === 0) {
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Alert',
                            subTitle: "Question Created Successfully",
                        })
                    }
                    if (values.option.length > 0) {
                        values.option.map((item, key) => {
                            let get_option = item;
                            var myHeaders = new Headers();
                            myHeaders.append("Content-Type", "application/json");
                            myHeaders.append("Authorization", token);
                            var raw = JSON.stringify({
                                option: get_option.option,
                                question_id: questionId
                            })
                            var requestOptions = {
                                method: "POST",
                                headers: myHeaders,
                                body: raw,
                                redirect: "follow",
                            };
                            fetch(APIUrl + `/option`, requestOptions)
                                .then((response) => response.json())
                                .then((resData) => {
                                    console.log(resData);
                                    if (resData.status == 200) {
                                        if (values.option.length === (key + 1)) {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: 'Alert',
                                                subTitle: "Question Created Successfully",
                                            })
                                        }
                                    }
                                })
                                .catch((error) => console.log("error", error));
                        })
                    }
                }
            })
            .catch((error) => {
                console.log("error", error)
            });
    }
    return (
        <div className="section inner-content ">
            <div className="row">
                <div className="col s9">
                    <div className="section-title">
                        <h1>Add Question</h1>
                    </div>
                </div>
                <div className="col s3">
                    <div className="invoice-create-btn right pr-5">
                        <button onClick={BackBtn} class="waves-effect waves-light btn-large mb-1 mr-1">
                            <i className="material-icons">arrow_back</i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="pt-0 main-screen">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validate}
                        validateOnBlur={false}
                        validateOnChange={false}
                        onSubmit={(values, props) => {
                            OnSubmitForm(values, props);
                        }}
                        render={({ values, errors, touched, handleReset, setFieldValue, formik }) => {
                            return (
                                <Form>
                                    <div className="row">
                                        <TextField
                                            label="Question"
                                            elementType="add"
                                            name="question"
                                            type="text"
                                        />
                                        <div className="input-field  col m6 s12">
                                            <label style={{ marginTop: '-35px' }}>Question Type</label>
                                            <CustomSelect
                                                search={false}
                                                onChange={value => {
                                                    setFieldValue('question_type', value);
                                                }}
                                                value={values.question_type}
                                                options={GetQuestionTypes}
                                                Field={'Question_type'}
                                                Fieldname={'question_type'}
                                                className='select-dropdown dropdown-trigger'
                                            />
                                            {errors.question_type ? <div className='error'>{errors.question_type}</div> : null}
                                        </div>
                                    </div>
                                    {(values.question_type && values.question_type !== 1) ? (
                                        <div className="row">
                                            <div className="col m12 s12 padtb">
                                                <div className="col m2 s12 padtb">
                                                </div>
                                                <FieldArray
                                                    name="option"
                                                    render={({ insert, remove, push }) => (
                                                        <div>
                                                            <div>
                                                                <div className="col m1 s12 padtb">
                                                                    {/* {values.option.length}{values.question_type} */}
                                                                </div>
                                                                <div className="col m6 s12 padtb">
                                                                    <h6 >Add Options</h6>
                                                                </div>
                                                                <div className="col m1 s12 padtb">
                                                                    {values.option.length > 0 && (
                                                                        <div className="col m12 s12 pad-r" >
                                                                            <button
                                                                                type="button"
                                                                                className="waves-effect waves-light btn-large mb-1 mr-1"
                                                                                onClick={() => remove(0)}
                                                                            >
                                                                                X
                                                                            </button>
                                                                        </div>)}
                                                                </div>
                                                                <div className="col m2 s12 padtb">
                                                                    {((values.question_type === 4) ? values.option.length < 12 : values.option.length < 4) ? (
                                                                        <div className="col m12 s12 pad-r" >
                                                                            <button
                                                                                type="button"
                                                                                className="waves-effect waves-light btn-large mb-1 mr-1"
                                                                                onClick={() => push(new Option())}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    ) : (null)}
                                                                </div>
                                                            </div>
                                                            {values.option.length > 0 &&
                                                                values.option.map((friend, index) => (
                                                                    <div
                                                                        className="col m6 s12 padtb"
                                                                        key={index}
                                                                    >
                                                                        <QuestionTextField
                                                                            label="option"
                                                                            elementType="add"
                                                                            name={`option.${index}.option`}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            {/* <div className="col m1 s12 padtb">
                                                                <div className="col m12 s12 pad-r" >
                                                                    <button
                                                                        type="button"
                                                                        className="waves-effect waves-light btn-large mb-1 mr-1"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>
                                                            </div> */}
                                                            {/* {index >= 0 && (values.question_type == 4 ? index < 9 : index < 3) && (
                                                                <div className="col m2 s12 padtb">
                                                                    <div className="col m12 s12 pad-r" >
                                                                        <button
                                                                            type="button"
                                                                            className="waves-effect waves-light btn-large mb-1 mr-1"
                                                                            onClick={() => push(new Option())}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )} */}
                                                            {/* {(values.option.length === 0) ? ( */}
                                                            {/* ) : (null)} */}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ) : (null)}
                                    <div class="col m8 s8 pad-r center">
                                        <button
                                            class="waves-effect waves-light btn-large mb-1 mr-1"
                                            type="submit"
                                            name="action"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            )
                        }}
                    />
                </div>
            </div>
            <MaxWidthDialog setConfirmDialog={setConfirmDialog} confirmDialog={confirmDialog} link={'/request_questionarie'} />
        </div>
    )
}
