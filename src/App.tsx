import { Route, Switch, BrowserRouter, Link } from "react-router-dom";
import { Main } from "./pages/Main";
import { Editor } from "./pages/Editor";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/*">
          <Main />
        </Route>
      </Switch>
      <div className="flex justify-around underline pt-28">
        <Link to="/">Home</Link>
        <Link to="/editor">Editor</Link>
      </div>
    </BrowserRouter>
  );
}

export default App;
