import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './views/HomePage';
import { Provider } from 'react-redux';
import store from './Redux/store'; 


function App() {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
