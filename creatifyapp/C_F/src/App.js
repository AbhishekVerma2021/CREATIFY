import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './views/HomePage';
import { Provider } from 'react-redux';
import store from './Redux/store'; 
import Login from './views/LoginSignup/Login';
import Signup from './views/LoginSignup/Signup';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './views/Profile';
import Sidebar from './views/Sidebar';
function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
        <Sidebar>
          <Routes>
            <Route path='/' element={<ProtectedRoute componentPath={'/'} Component={HomePage} />}/>
            <Route path='/profile' element={<ProtectedRoute componentPath={'/profile'} Component={Profile} />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Sidebar>
        </Router>
        <ToastContainer/>
      </Provider>
    </div>
  );
}

export default App;
