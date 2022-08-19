// import { Height, Widgets } from '@material-ui/icons';
// import React from 'react';
// import Select from 'react-select';

// export default ({ onChange, options, value, className }) => {


//     const dot = () => ({
//         alignItems: "center",
//         display: "flex"
//     });

//     const colourStyles = {
//         control: (styles) => ({
//             // width: '103%',
//             // height: '50px',
//             // backgroundColor: "white",
//             // borderRadius: "none",
//             // boxShadow: '0 !important',
//             ...styles,
//             // fontSize: "1rem",
//             // boxSizzing: "content- box",
//             // width: " 100 %",
//             // height: "3rem",
//             // margin: " 0 0 8px",
//             // padding: "0",
//             // transition: "box - shadow .3s, border .3s",
//             // border: "none",
//             // borderBottom: "1px solid #9e9e9e",
//             // borderRadius: "0",
//             // outline: "0",
//             // backgroundColor: " transparent",
//             // boxShadow: "none",
//             border: "solid 2px #c9d4fa !important",
//         }),
//         valueContainer: (styles) => ({ ...styles, height: '50px' }),
//         indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
//         input: (styles) => ({ ...styles, ...dot() }),
//         placeholder: (styles) => ({ ...styles, ...dot() }),
//         singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) })
//     };
//     const defaultValue = (options, value) => {
//         return options ? options.find(option => option.value === value) : "";
//     };
//     return (
//         <div>
//             <Select
//                 // className="inputselect"
//                 isSearchable={false}
//                 styles={colourStyles}
//                 value={defaultValue(options, value)}
//                 onChange={value => {
//                     onChange(value)
//                 }}
//                 placeholder="Select Option"
//                 options={options} />
//         </div >
//     )
// }
import { Height, Widgets } from '@material-ui/icons';
import React from 'react';
import Select from 'react-select';

export default ({ onChange, options, value, className, Field, Fieldname }) => {

    const dot = () => ({
        alignItems: "center",
        display: "flex"
    });

    const colourStyles = {
        control: (styles) => ({
            width: '103%',
            ...styles,
            border: "solid 2px #c9d4fa !important",
        }),
        valueContainer: (styles) => ({ ...styles, height: '50px' }),
        indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        input: (styles) => ({ ...styles, ...dot() }),
        placeholder: (styles) => ({ ...styles, ...dot() }),
        singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) })
    };
    const defaultValue = (options, value) => {
        return options ? options.find(option => option.value === value) : "";
    };
    const renderList = () => {
        if (Field == 'Headquarter') {
            return (options.map(data => ({ label: data.country_name, value: data.id })))
        }
        if (Field == 'Bussiness') {
            return (options.map(data => ({ label: data.sector_name, value: data.id })))
        }
        if (Field == 'EmployeeNo') {
            return (options.map(data => ({ label: data.number_of_employee, value: data.id })))
        }
        if (Field == 'BussinessInception') {
            return (options.map(data => ({ label: data.average_employees, value: data.id })))
        }
        if (Field == 'Feedback') {
            return (options.map(data => ({ label: data.feedback_frequencies, value: data.id })))
        }
    }

    return (
        <div>
            <Select
                className="inputselect"
                isSearchable={false}
                styles={colourStyles}
                value={defaultValue(options, value)}
                onChange={value => {
                    onChange(value)
                }}
                placeholder="Select Option"
                options={renderList()}
            />
        </div >
    )
}