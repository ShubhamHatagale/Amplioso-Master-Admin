import React from 'react'
import { Redirect } from 'react-router-dom'
export default function Check(props,{ children }) {

    return props.data===true ? (
        children) : (
        <Redirect to={{ pathname: '/' }} />
    );
}

