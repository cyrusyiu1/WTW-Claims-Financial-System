import './styles/theme.scss';

import './App.css';
import Home from './pages/Home';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import PolicyList from './components/PolicyList';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PolicyPage from './pages/PolicyPage';
import RegisterPage from './pages/RegisterPage';
import PolicyListPage from './pages/PolicyListPage';
import { useSelector } from 'react-redux';
import { IRootState } from './redux/state';
import Sidebar from './components/Sidebar';
import FundPage from './pages/FundPage';

function App() {
  const isAuthenticated = useSelector(
    (state: IRootState) => state.auth.isAuthenticated
  );
  return (
    <div className="App">
      {isAuthenticated &&
        <>
          <Sidebar />
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/policy/:id/fund" component={FundPage} />
            <Route path="/policy/new" component={PolicyPage} />
            <Route path="/policy" component={PolicyListPage} />
          </Switch>
        </>
      } {
        !isAuthenticated && <LoginPage />
      }
    </div>
  );
}

export default App;
