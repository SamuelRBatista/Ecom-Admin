import { useEffect, useState } from 'react';
import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';
import { sellProduct, getMovements } from '../../../../infrastructure/services/ecom/sale/SaleService';

export default function SalesPage() {
  const productService = new ProductService();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Venda');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await productService.getAll();
      setProducts(data);
    })();
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    (async () => {
      const m = await getMovements(selectedProductId, 50);
      setMovements(m);
    })();
  }, [selectedProductId]);

  const handleSell = async () => {
    if (!selectedProductId) return;
    setLoading(true);
    setMessage(null);
    try {
      await sellProduct(selectedProductId, quantity, reason, documentNumber, undefined);
      setMessage('Venda registrada com sucesso.');
      const m = await getMovements(selectedProductId, 50);
      setMovements(m);
    } catch (err: any) {
      setMessage(err?.response?.data?.Error || err.message || 'Erro ao registrar venda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={{ padding: 20 }}>
        <h2>Vendas</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <select value={selectedProductId ?? ''} onChange={(e) => setSelectedProductId(Number(e.target.value) || null)}>
            <option value="">-- Selecionar produto --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} - {p.price} (Estoque: {p.stockQuantity ?? 0})</option>
            ))}
          </select>

          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ width: 80 }} />
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo" />
          <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} placeholder="Documento (opcional)" />
          <button onClick={handleSell} disabled={!selectedProductId || loading}>Registrar Venda</button>
        </div>
        {message && <div style={{ marginBottom: 12 }}>{message}</div>}

        <div>
          <h3>Movimentações recentes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Motivo</th>
                <th>Documento</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td>{new Date(m.createdAt).toLocaleString()}</td>
                  <td>{m.type}</td>
                  <td>{m.quantity}</td>
                  <td>{m.reason}</td>
                  <td>{m.documentNumber}</td>
                  <td>{m.userName ?? m.userId ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
