import React, {Component, useState} from "react";


export default function TabSetting ({tabValue, setTabCheck}){
    const [hide, setHide] = useState(true);

    const handleHide = () => {
        setHide(!hide)
    }

    return (
        <div
            id="customizer"
            className={`customizer ${hide ? '' : 'open'}`}
        >
            <div className="handle" onClick={handleHide}>
                <i className="i-Gear spin"></i>
            </div>
            <div className="accordion" id="accordionCustomizer">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <p className="mb-0">Tab select</p>
                    </div>
                    <div
                        className="row p-16"
                    >
                        {
                            tabValue.map((val, index) =><div className="col-sm-4" key={index}>
                                <label className="checkbox checkbox-primary">
                                    <input
                                        type="checkbox"
                                        id="rtl-checkbox"
                                        checked={val.value === 1}
                                        onChange = {() => {
                                            setTabCheck(index)
                                        }}
                                    />
                                    <span>{val.key}</span>
                                    <span className="checkmark"></span>
                                </label>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
