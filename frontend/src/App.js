import './App.css';
import { HashRouter, Routes, Route} from "react-router-dom";

import { Home, Signup, Signin, Profile} from "./pages";

function App() {
  return (
    <HashRouter>
      <Routes className="App-header">
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
