// import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomePage from './views/HomePage';
import { Provider } from 'react-redux';
import store from './Redux/store'; 


function App() {
  return (
    <div>
      <Provider store={store}>
        <HomePage/>
      </Provider>
    </div>
  );
}

export default App;
