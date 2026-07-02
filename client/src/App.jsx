import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Watch from './pages/Watch';
import Search from './pages/Search';
import MyList from './pages/MyList';
import ProfileSelect from './pages/ProfileSelect';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/search" element={<Search />} />
      <Route path="/mylist" element={<MyList />} />
      <Route path="/profiles" element={<ProfileSelect />} />
    </Routes>
  );
}

export default App;