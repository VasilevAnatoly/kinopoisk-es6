import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

class AppContainer extends React.Component {

    static propTypes = {
        store: PropTypes.object.isRequired
    };

    render() {
        const { store, routes, history } = this.props
        return (
            <Provider store={store} >
                <ConnectedRouter history={history}>
                    {routes}
                </ConnectedRouter>
            </Provider>
        )
    }
}

export default AppContainer
