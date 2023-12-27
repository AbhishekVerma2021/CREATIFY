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
import CreatePost from './views/CreatePost';
import Favourites from './views/Favourites';
import CommanProfileView from './views/CommanProfileView';
function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route
              path='/' element={
                <Sidebar>
                  <ProtectedRoute componentPath={'/'} Component={HomePage} />
                </Sidebar>
              }
            />
            <Route path='/profile' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/profile'} Component={Profile} />
              </Sidebar>
            }
            />
            <Route path='/createPost' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/createPost'} Component={CreatePost} />
              </Sidebar>
            }
            />
            <Route path='/favourites' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/favourites'} Component={Favourites} />
              </Sidebar>
            }
            />
            <Route path='/commanProfile' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/commanProfile'} Component={CommanProfileView} />
              </Sidebar>
            }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
        <ToastContainer />
      </Provider>
    </div>
  );
}

export default App;
