import './App.css';
import Home from './Components/Home/index.js';
import Navbar from "./Components/Navbar/index.js";
import WhoUs from "./Components/WhoUs/index.js";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home />
       <WhoUs />
    </div>
  );
}

export default App;