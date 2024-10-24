import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './pages/docs';
import { ExamplePage } from './pages/example';
import { PkgExamplePage } from './pages/pkg';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/example" element={<ExamplePage />} />
          <Route path="/pkg-example" element={<PkgExamplePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
