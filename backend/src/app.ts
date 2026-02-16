const express = require("express");
const cors = require("cors");
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import partnerRoutes from "./modules/partners/partner.routes";
import financeRoutes from "./modules/finance/finance.routes";
import purchaseRoutes from "./modules/purchases/purchase.routes";
import receivingRoutes from "./modules/receiving/receiving.routes";
import shipmentRoutes from "./modules/shipments/shipment.routes";
import containerRoutes from "./modules/containers/container.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import reportRoutes from "./modules/reports/report.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", partnerRoutes);
app.use("/api", financeRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", receivingRoutes);
app.use("/api", shipmentRoutes);
app.use("/api", containerRoutes);
app.use("/api", expenseRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", reportRoutes);

export default app;
