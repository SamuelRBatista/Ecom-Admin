// src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';

import DashboardPage from '../pages/DashboardPage';
import ProductPage  from '../pages/ecom/product/ProductPage';
import ProductFormPage from '../pages/ecom/product/ProductFormPage';
import ProductEditPage from '../pages/ecom/product/ProductEditPage';
import ProductDetailsPage from '../pages/ecom/product/ProductDetailsPage';

import ClientPage  from '../pages/ecom/client/ClientPage';
import ClientFormPage from '../pages/ecom/client/ClientFormPage';
import ClientEditPage from '../pages/ecom/client/ClientEditPage';
import ClientDetailsPage from '../pages/ecom/client/ClientDetailsPage';
// import NotFoundPage from '../presentation/pages/NotFoundPage';

export function AppRoutes() {
  return (

    <Routes>  
      <Route
        path="/panel"
        element={<DashboardPage />}
      />

         {/* Product */}
      <Route path="/panel/product" element={<ProductPage />} />
      <Route path="/cadastro/product" element={<ProductFormPage />} />
      <Route path="/product/editar/:id" element={<ProductEditPage />} />
      <Route path="/product/detalhes/:id" element={<ProductDetailsPage />} />

      <Route path="/panel/client" element={<ClientPage />} />
      <Route path="/cadastro/client" element={<ClientFormPage />} />
      <Route path="/client/editar/:id" element={<ClientEditPage />} />
      <Route path="/client/detalhes/:id" element={<ClientDetailsPage />} />
     
      {/* <Route path="/products/create" element={<ProductFormPage />} />
      <Route path="/products/edit/:id" element={<ProductFormPage />} />
      <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>    

    
  );
}
