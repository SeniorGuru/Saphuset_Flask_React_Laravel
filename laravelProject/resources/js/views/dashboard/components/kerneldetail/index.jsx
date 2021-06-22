import React, {Component, useEffect, Fragment, useState} from "react";
import Button from "react-bootstrap/Button";
import Table from "../../../../Components/Table";


export default function KernelDetail({setKernelFlag, kDetail}) {

    return (
        <div className="p-4">
            <div className="mb-3">
                <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize"
                        onClick={() => setKernelFlag(false)}>
                    Back
                </Button>
            </div>
            <Table keyField="id" table
                   className="software-table"
                   columns={[
                       {
                           text: 'MSSYSNAME', dataField: 'MSSYSNAME'
                       },
                       {
                           text: 'KERN_REL', dataField: 'KERN_REL'
                       },
                       {
                           text: 'KERN_MAKE_VARIANT', dataField: 'KERN_MAKE_VARIANT'
                       },
                       {
                           text: 'KERN_DBLIB', dataField: 'KERN_DBLIB'
                       },{
                           text: 'KERN_COMP_ON', dataField: 'KERN_COMP_ON'
                       },{
                           text: 'KERN_COMP_TIME', dataField: 'KERN_COMP_TIME'
                       },{
                           text: 'KERN_PATCHLEVEL', dataField: 'KERN_PATCHLEVEL'
                       },{
                           text: 'KERN_SUPPORTLEVEL', dataField: 'KERN_SUPPORTLEVEL'
                       },{
                           text: 'KERN_PATCHNUMBER', dataField: 'KERN_PATCHNUMBER'
                       },{
                           text: 'KERN_SOURCEID', dataField: 'KERN_SOURCEID'
                       },{
                           text: 'KERN_COMP_LEVEL', dataField: 'KERN_COMP_LEVEL'
                       }
                   ]}
                   pagination={true}
                   data={
                       kDetail
                   }
            />
        </div>
    );
}
