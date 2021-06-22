import React, {Component, useEffect, Fragment, useState} from "react";
import Button from "react-bootstrap/Button";
import Table from "../../../../Components/Table";


export default function SoftwareDetail({setSoftwareFlag, sDetail, spList}) {

    return (
        <div className="p-4">
            <div className="mb-3">
                <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize"
                        onClick={() => setSoftwareFlag(false)}>
                    Back
                </Button>
            </div>
            <Table keyField="id" table
                   className="software-table"
                   columns={spList}
                   pagination={true}
                   data={
                       sDetail
                   }
            />
        </div>
    );
}
