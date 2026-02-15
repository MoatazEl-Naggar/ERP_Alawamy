import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    api.get("/inventory/report").then(res => setItems(res.data));
  }, []);

  return (
    <div>
      <h2>{t("inventoryReport")}</h2>

      <table>
        <thead>
          <tr>
            <th>{t("item")}</th>
            <th>{t("received")}</th>
            <th>{t("shipped")}</th>
            <th>{t("balance")}</th>
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
