import './App.css';
// import LazyLoadImages from './utils/lazyLoadImages';
import { GlobalContext } from './contexts';
import MyRoute from './Router';

function App() {
  return (
    <GlobalContext>
      <MyRoute />
    </GlobalContext>
  );
}

export default App;
