
import './index.css';
import 'remixicon/fonts/remixicon.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
function App() {
	const { loader } = useSelector(state => state.loaderReducer);
	return (
		<div>
			<Toaster position="top-center" reverseOrder={false} />
			{loader && <Loader />}
			<BrowserRouter>
				<Routes>
					<Route path="/" element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>

			</BrowserRouter>
		</div>
	);
}

export default App;
