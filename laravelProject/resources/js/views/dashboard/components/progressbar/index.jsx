import {ProgressBar} from "react-bootstrap";
import React from "react";
import './style.css'

export default function ProgressBars({}){

    return (
        <div className="col-sm-3 p-0">
            <div className="row pr-3 pl-3 pt-4 justify-content-between align-items-center">
                <div className="row pl-3 align-items-center">
                    <p className="progress-title mb-1 mr-3">Software Up to date</p>
                    <h6 className="mb-0">20 of 60 systems</h6>
                </div>
                <div>
                    <h6 className="mb-0">33%</h6>
                </div>
            </div>
            <ProgressBar className="mb-3">
                <ProgressBar variant="success" now={15}  key={1} />
                <ProgressBar variant="warning" now={25}  key={2} />
                <ProgressBar variant="danger" now={60} key={3} />
            </ProgressBar>
            <div className="row pr-3 pl-3 mt-4 justify-content-between align-items-center">
                <div className="row pl-3 align-items-center">
                    <p className="progress-title mb-1 mr-3">Software Equal on</p>
                    <h6 className="mb-0">20 of 60 systems</h6>
                </div>
                <div>
                    <h6 className="mb-0">33%</h6>
                </div>
            </div>
            <ProgressBar className="mb-3">
                <ProgressBar variant="success" now={15}  key={1} />
                <ProgressBar variant="warning" now={25}  key={2} />
                <ProgressBar variant="danger" now={60} key={3} />
            </ProgressBar>
            <div className="row pr-3 pl-3 mt-4 justify-content-between align-items-center">
                <div className="row pl-3 align-items-center">
                    <p className="progress-title mb-1 mr-3">Kernel up to date</p>
                    <h6 className="mb-0">20 of 60 systems</h6>
                </div>
                <div>
                    <h6 className="mb-0">33%</h6>
                </div>
            </div>
            <ProgressBar className="mb-3">
                <ProgressBar variant="success" now={15}  key={1} />
                <ProgressBar variant="warning" now={25}  key={2} />
                <ProgressBar variant="danger" now={60} key={3} />
            </ProgressBar>
            <div className="row pr-3 pl-3 mt-4 justify-content-between align-items-center">
                <div className="row pl-3 align-items-center">
                    <p className="progress-title mb-1 mr-3">Kernel Equal on</p>
                    <h6 className="mb-0">20 of 60 systems</h6>
                </div>
                <div>
                    <h6 className="mb-0">33%</h6>
                </div>
            </div>
            <ProgressBar className="mb-3">
                <ProgressBar variant="success" now={15}  key={1} />
                <ProgressBar variant="warning" now={25}  key={2} />
                <ProgressBar variant="danger" now={60} key={3} />
            </ProgressBar>
        </div>
    )
}
