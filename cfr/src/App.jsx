import { Navbar } from "./components/navbar";
import { Problem } from "./components/problem";

const App = () => {
  return (
    <div>
      <Navbar loggedIn={false} />
      <Problem code="123A" />
    </div>
  );
};

export default App;
