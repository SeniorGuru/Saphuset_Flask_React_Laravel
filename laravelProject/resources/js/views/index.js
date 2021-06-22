import React, {Component, Suspense} from 'react';

import ReactDOM from 'react-dom';

import Group from './group';
import Team from './team';
import Setting from './settting';
import Dashboard from './dashboard';

export default class App extends Component {
    constructor(props) {
        super(props)
        this.View = this
            .View
            .bind(this);
        this.state = {
            route: window.location.pathname
        }
    }

    View() {
        const route = this.state.route;
        switch (route) {
            case "/team":
                return <Team/>
            case "/setting":
                return <Setting/>
            case "/dashboard":
                return <Dashboard/>
            case "/":
                return <Group/>
            default:
                return null;
        }

    }

    render() {
        return (
            <Suspense fallback={< div > Loading ...</div>}>
                <section>
                    <this.View/>
                </section>
            </Suspense>

        );
    }
}

ReactDOM.render(
    <App/>, document.getElementById('content'));
