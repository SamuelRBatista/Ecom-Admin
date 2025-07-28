// src/components/Nav.tsx

import { Link } from 'react-router-dom';
import {
  IoHomeOutline,
  IoPeopleOutline,
  IoBusinessOutline,
  IoBriefcaseOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5';

export default function Nav() {
  return (
    <div className="navigation">
      <ul>
        <li>
          <Link to="/">
            <span className="icon">
              <IoBusinessOutline />
            </span>
            <span className="title">Srb-Comercial</span>
          </Link>
        </li>
        <li>
          <Link to="/panel">
            <span className="icon">
              <IoHomeOutline />
            </span>
            <span className="title">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/panel/product">
            <span className="icon">
              <IoPeopleOutline />
            </span>
            <span className="title">Produtos</span>
          </Link>
        </li>
        <li>
          <Link to="/panel/fornecedor">
            <span className="icon">
              <IoBusinessOutline />
            </span>
            <span className="title">Fornecedor</span>
          </Link>
        </li>
        <li>
          <Link to="/panel/client">
            <span className="icon">
              <IoBriefcaseOutline />
            </span>
            <span className="title">Clientes</span>
          </Link>
        </li>
        <li>
          <Link to="/panel/vendas">
            <span className="icon">
              <IoChatbubbleOutline />
            </span>
            <span className="title">Vendas</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
