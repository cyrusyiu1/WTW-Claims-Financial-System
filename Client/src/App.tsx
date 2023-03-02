import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router'
import { history } from './redux/reducer';
import PolicyList from './components/PolicyList';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PolicyPage from './pages/PolicyPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  
  return (
    <Provider store = {store}>
      <ConnectedRouter history={history}>
      <div className="App">
        <Switch>
          {/* <Home></Home> */}
          <Route path="/" exact={true} component={Home} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/policy" component={PolicyPage} />
          {/* <Route path="/policyList" component={PolicyList} /> */}
        </Switch>
      </div>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
