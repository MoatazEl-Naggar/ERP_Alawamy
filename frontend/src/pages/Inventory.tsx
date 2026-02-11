import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/inventory/report").then(res => setItems(res.data));
  }, []);

  return (
    <div>
      <h2>Inventory Report</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Received</th>
            <th>Shipped</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i: any) => (
            <tr key={i.id}>
              <td>{i.itemName}</td>
              <td>{i.totalReceived}</td>
              <td>{i.totalShipped}</td>
              <td>{i.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
