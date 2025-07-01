// instala lib react-router-dom - npm install react-router-dom
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom'
import { Login } from './pages/Login';

export default function Root(){
    return (
        <Router>
            <Routes>
                <Route path="/" exact element={<Login />} />
            </Routes>
        </Router>
    )
}