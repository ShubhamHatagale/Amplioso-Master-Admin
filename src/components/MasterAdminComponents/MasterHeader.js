import React, { useEffect, useState } from 'react'

function MasterHeader() {
    const id = localStorage.getItem("masters_id");
    const token = localStorage.getItem("masters_jwt");
    const APIUrl = process.env.REACT_APP_Base_URL;
    const [manager_mastercount, set_manager_mastercount] = useState();
    const [no_of_emp, setno_of_emp] = useState(0);

    useEffect(() => {
        getPackEmpCount()
        get_no_man()

    })

    const getPackEmpCount = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(APIUrl + `/company/${id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                // setlistRecord(result.data);
                // setloading(0);
                console.log(result.data)

                console.log(result.data[0].CompanyPackage.no_of_employees)
                // setno_of_emp(result.data[0].number_of_employee)

                setno_of_emp(result.data[0].CompanyPackage.no_of_employees)
            })
            .catch(error => console.log('error', error));
    }
    const get_no_man = async () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'multipart/form-data')
        myHeaders.append("Authorization", token);
        let res = await fetch(
            APIUrl + `/company/managers/${id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let response = await res.json();
        let result = response.data.length;
        console.log(response.data.length + "output");
        console.log(result);



        console.log(id)
        let res2 = await fetch(
            APIUrl + `/employeedetails/company/${id}`,
            {
                method: "get",
                headers: myHeaders
            }
        );
        let res2ponse = await res2.json();
        let res2ult = res2ponse.data.length;
        console.log(res2ponse.data.length + "output");
        console.log(res2ult);

        console.log(result + "+" + res2ult);


        // console.log(result.length +"+"+ res2ult.lenght)

        set_manager_mastercount(result);


    }

    return (
        <div>
            <div className="row menu-bottom">
                <div className="col s12 m6 l6 xl6">Total Manager(s) Assigned : {manager_mastercount ? manager_mastercount : 0}</div>
                {/* <div className="col s12 m6 l6 xl6 right">Total Employee(s) Assigned : {manager_mastercount ? manager_mastercount : 0}/{no_of_emp ? no_of_emp : 0}</div> */}
                <div className="col s12 m6 l6 xl6 right">Total Manager(s) Assigned : {manager_mastercount ? manager_mastercount : 0}/{no_of_emp ? no_of_emp : 0}</div>

            </div>
        </div>
    )
}

export default MasterHeader


