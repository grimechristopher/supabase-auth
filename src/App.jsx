import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
// import LoginPage from './components/LoginPage'
import Login from './components/Login'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router>
      <Login />
      {/* <LoginPage /> */}
    </Router>
  )
}

export default App
