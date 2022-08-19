import { Height, Widgets } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default ({ onChange, options, value, className, Field, defValue, disable, search }) => {
    let issearch = search == true ? true : false;
    const dot = () => ({
        alignItems: "center",
        display: "flex",
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
    const defaultValue = () => {
        if (Field == 'Employee') {
            return (defValue.map(data => ({ label: data.number_of_employee, value: data.id })))
        }
        if (Field == 'Sector') {
            return (defValue.map(data => ({ label: data.sector_name, value: data.id })))
        }
        if (Field == 'AvgEmployee') {
            return (defValue.map(data => ({ label: data.average_employees, value: data.id })))
        }
        if (Field == 'FeedBack') {
            return (defValue.map(data => ({ label: data.feedback_frequencies, value: data.id })))
        }
        if (Field == 'Role') {
            return (defValue.map(data => ({ label: data.role, value: data.id })))
        }
        if (Field == 'Headquaters') {
            return (defValue.map(data => ({ label: data.country_name, value: data.id })))
        }
        if (Field == 'Package') {
            return (defValue.map(data => ({ label: data.package_name, value: data.id })))
        }
        if (Field == 'Bussiness') {
            return (defValue.map(data => ({ label: data, value: data })))
        }
    };

    const renderList = () => {
        if (Field == 'Sector') {
            return (options.map(data => ({ label: data.sector_name, value: data.id })))
        }
        if (Field == 'Bussiness') {
            return (options.map(data => ({ label: data, value: data })))
        }
        if (Field == 'Employee') {
            return (options.map(data => ({ label: data.number_of_employee, value: data.id })))
        }
        if (Field == 'AvgEmployee') {
            return (options.map(data => ({ label: data.average_employees, value: data.id })))
        }
        if (Field == 'FeedBack') {
            return (options.map(data => ({ label: data.feedback_frequencies, value: data.id })))
        }
        if (Field == 'Role') {
            return (options.map(data => ({ label: data.role, value: data.id })))
        }
        if (Field == 'Headquaters') {
            return (options.map(data => ({ label: data.country_name, value: data.id })))
        }
        if (Field == 'Package') {
            return (options.map(data => ({ label: data.package_name, value: data.id })))
        }
        if (Field == 'Question_type') {
            return (options.map(data => ({ label: data.label, value: data.value })))
        }
    }
    return (
        <div>
            <Select
                className="inputselect"
                isSearchable={issearch}
                styles={colourStyles}
                defaultValue={defaultValue()}
                onChange={e => {
                    onChange(e.value)
                }}
                placeholder="Select Option"
                options={renderList()}
                isDisabled={disable}
            />
        </div >
    )
}