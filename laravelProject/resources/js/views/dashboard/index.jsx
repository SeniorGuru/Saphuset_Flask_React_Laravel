import React, {Component, Suspense} from 'react';
import {
    Badge,
    Container, Tab, Tabs,

} from "react-bootstrap";

import Dumps from "./dumps"
import TabSetting from './tabsetting'
import Axios from "axios";
import Processes from "./processes";
import Components from "./components";

const customTabHeader = (title, number) => (
    <div className="d-flex align-items-center">
        <span>{title}</span>
        {number != 0 && <Badge pill variant="primary" className="m-1">
            {number}
        </Badge>}
    </div>
);
export default class UserComplianceDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stat: "",
            tab_value : [],
            keys: 'Dumps'
        }
        this.setTabCheck = this.setTabCheck.bind(this)
        this.getComponent = this.getComponent.bind(this)
        this.setTabsBadge = this.setTabsBadge.bind(this)
    }
    componentDidMount() {
        loaderToggle(true);
        this.getTabsData()
    }
    async getTabsData() {
        let response = await Axios.get("/api/q/rest?api=SystemMonitor@dumps@getTabs");
        this.setState({ tab_value: response.data.response.message.tabs_list })
    }

    setTabsBadge(index, number) {
        console.log(index, number)
        this.state.tab_value[index].number = number
        this.setState({})
    }

    async setTabCheck(index) {
        try {
            const data = {
                tab: this.state.tab_value[index].key,
            };
            await Axios.post("/api/q/rest?api=SystemMonitor@dumps@setTabs", {data});
            this.getTabsData();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }

    getComponent(key, index){

        if(key === 'Dumps') {
            // return  <Dumps keys={this.state.keys} index={index} setTabsBadge={this.setTabsBadge}/>
            return <div/>
        }
        else if(key === 'Dialog Processes') {
            return <Processes/>
        }else if(key === 'Components'){
            return <Components/>
        }
        else {
            return <div/>
        }

    }

    render() {

        return (
            <Suspense>
                <Container fluid className="main-content p-10">
                    <div className="breadcrumb p-10">
                        <h1>Dashboard</h1>
                    </div>
                    <div className="separator-breadcrumb border-top"/>
                    <section className="contact-list">
                        <Tabs defaultActiveKey="Components" id="uncontrolled-tab-example" onSelect={(k) => {
                            console.log(k)
                            this.setState({
                                keys: k
                            })
                        }}>
                            {
                                this.state.tab_value.map((val, index) =>  val.value===1&&<Tab eventKey={val.key}  key={index} title={customTabHeader(val.key, val.number)}>
                                    {this.getComponent(val.key, index)}
                                </Tab>)
                            }
                        </Tabs>
                    </section>
                </Container >
                <TabSetting tabValue = {this.state.tab_value} setTabCheck={this.setTabCheck}/>
            </Suspense>

        );
    }
}
