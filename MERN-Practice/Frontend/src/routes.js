import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login/'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard/'

export default function Routes() {
    return (
        //route componets by pathes ex. Login, Register, Dashboard
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/dashboard' component={Dashboard} />
            </Switch>
        </BrowserRouter>
    );
}