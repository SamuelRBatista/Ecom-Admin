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

import SupplierPage  from '../pages/ecom/supplier/SupplierPage';
import SupplierFormPage from '../pages/ecom/supplier/SupplierFormPage';
import SupplierEditPage from '../pages/ecom/supplier/SupplierEditPage';
import SupplierDetailsPage from '../pages/ecom/supplier/SupplierDetailsPage';
import SalesPage from '../pages/ecom/sale/SalesPage';

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
      <Route path="/register/product" element={<ProductFormPage />} />
      <Route path="/product/editar/:id" element={<ProductEditPage />} />
      <Route path="/product/detalhes/:id" element={<ProductDetailsPage />} />
   

      <Route path="/panel/client" element={<ClientPage />} />
      <Route path="/register/client" element={<ClientFormPage />} />
      <Route path="/client/editar/:id" element={<ClientEditPage />} />
      <Route path="/client/detalhes/:id" element={<ClientDetailsPage />} />

      <Route path="/panel/supplier" element={<SupplierPage />} />
      <Route path="/register/supplier" element={<SupplierFormPage />} />
      <Route path="/supplier/editar/:id" element={<SupplierEditPage />} />
      <Route path="/supplier/detalhes/:id" element={<SupplierDetailsPage />} />

      {/* Sales */}
      <Route path="/panel/vendas" element={<SalesPage />} />
     
      {/* <Route path="/products/create" element={<ProductFormPage />} />
      <Route path="/products/edit/:id" element={<ProductFormPage />} />
      <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>    

    
  );
}
