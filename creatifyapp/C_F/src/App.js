import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './views/HomePage';

import Login from './views/LoginSignup/Login';
import Signup from './views/LoginSignup/Signup';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './views/Profile';
import Sidebar from './views/Sidebar';
import CreatePost from './views/CreatePost';
import Favourites from './views/Favourites';
import CommanProfileView from './views/CommanProfileView';
import UserChatView from './views/UserChatView';
import FullPageLoader from './LoadersAndShimmers/FullPageLoader';
import './App.css';
import { connect } from 'react-redux';

const App = (props) => {
  const {
    isFullPageloading
  } = props;
  


  return (
    <div>
      <div className='routerContainer'>
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
            <Route path='/favorites' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/favorites'} Component={Favourites} />
              </Sidebar>
            }
            />
            <Route path='/commanProfile' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/commanProfile'} Component={CommanProfileView} />
              </Sidebar>
            }
            />
            <Route path='/messages' element={
              <Sidebar>
                <ProtectedRoute componentPath={'/messages'} Component={UserChatView} />
              </Sidebar>
            }
            />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </Router>
        <ToastContainer />
        {/* </Provider> */}
      </div>
        <FullPageLoader />
    </div>
  );
}

const mapStateToProps = (state) => ({
  isFullPageloading: state.isFullPageloading,
});
export default connect(mapStateToProps, null)(App);
