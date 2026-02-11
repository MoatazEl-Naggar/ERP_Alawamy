import { Router } from "express";
import * as customer from "./customer.controller";
import * as supplier from "./supplier.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { checkPermission } from "../../middleware/permission.middleware";

const router = Router();

// Customers
router.post(
  "/customers",
  authenticate,
  checkPermission("CUSTOMERS", "add"),
  customer.createCustomer
);

router.get(
  "/customers",
  authenticate,
  checkPermission("CUSTOMERS", "view"),
  customer.getCustomers
);

router.put(
  "/customers/:id",
  authenticate,
  checkPermission("CUSTOMERS", "edit"),
  customer.updateCustomer
);

router.delete(
  "/customers/:id",
  authenticate,
  checkPermission("CUSTOMERS", "delete"),
  customer.deleteCustomer
);

// Suppliers
router.post(
  "/suppliers",
  authenticate,
  checkPermission("SUPPLIERS", "add"),
  supplier.createSupplier
);

router.get(
  "/suppliers",
  authenticate,
  checkPermission("SUPPLIERS", "view"),
  supplier.getSuppliers
);

router.put(
  "/suppliers/:id",
  authenticate,
  checkPermission("SUPPLIERS", "edit"),
  supplier.updateSupplier
);

router.delete(
  "/suppliers/:id",
  authenticate,
  checkPermission("SUPPLIERS", "delete"),
  supplier.deleteSupplier
);

export default router;
