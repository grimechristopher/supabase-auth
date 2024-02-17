import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import LoginPage from './components/LoginPage'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router>
      <LoginPage />
    </Router>
  )
}

export default App
