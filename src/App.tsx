import { Route, Switch, BrowserRouter } from "react-router-dom";
import { Main } from "./pages/Main";
import { Editor } from "./pages/Editor";
import { NavBar } from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/*">
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
