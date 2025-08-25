import { Routes, Route } from 'react-router-dom';

import ProductPage from '../../pages/Product/ProductPage';
import ProductDetails from '../../pages/ProductDetails';

export default function ProductRoutes() {
  return (
    <Routes>
      <Route index element={<ProductPage/>} />
      <Route path=":id" element={<ProductDetails />} />
    </Routes>
  );
}