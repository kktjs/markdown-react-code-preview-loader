import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/docs';
import { ExamplePage } from './pages/example';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/example" element={<ExamplePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
