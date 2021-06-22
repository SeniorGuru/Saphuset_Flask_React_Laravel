import React, {Component, useEffect, useState} from "react";
import Table from "../../../../Components/Table";
import {Card} from "react-bootstrap";
import './style.css'

export default function ErrorTable({snapList, statusDefault}) {

    useEffect(()=>{
        console.log(statusDefault[3])
    }, [statusDefault])
    return (
        <div className="col-xl-4 col-lg-6 col-md-12 p-2">
            <Card className="p-2 error-parent" style={{height: "400px"}}>
                <Table keyField="id" table
                       className="error-table"
                       columns={[
                           {text: 'Status', dataField: 'status' , formatter: (cell, row) => {
                                   return <div className="circle"></div>;
                               }},
                           {text: 'Date', dataField: 'DATUM'},
                           {text: 'SID', dataField: 'sid'},
                           {text: 'App Server', dataField: 'AHOST'},
                           {text: 'Nr of dumps', dataField: 'totalDays'},
                       ]}
                       data={
                           snapList.filter(list => list.totalDays >= statusDefault[3] )
                       }
                />
            </Card>
        </div>
    );
}
