import { Router } from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import FileController from "./app/controllers/FileController";
import Delivery from "./app/controllers/DeliveryController";
import DeliveryStart from "./app/controllers/DeliveryStartController";
import DeliveryFinish from "./app/controllers/DeliveryFinishController";
import Deliveryman from "./app/controllers/DeliverymanController";
import DeliverymanDelivery from "./app/controllers/DeliverymanDeliveryController";
import DeliveryProblems from "./app/controllers/DeliveryProblems";

import authMiddlewares from "./app/middlewares/auth";
import isAdmin from "./app/middlewares/admin";

const routes = new Router();

const upload = multer(multerConfig);

// Login
routes.post("/sesions", isAdmin, SessionController.store);

// Encomenda de cada entregador
routes.get("/listdelivery", DeliverymanDelivery.index);

// Listar encomendas já finalizadas pelo entregador
routes.get("/listdelivery/:id/finished", DeliverymanDelivery.show);

// Start encomenda
routes.put("/delivery/:idDelivery/:idDeliveryman/start", DeliveryStart.update);
// Finish encomenda
routes.put(
  "/delivery/:idDelivery/:idDeliveryman/finish",
  upload.single("file"),
  DeliveryFinish.update
);

// Problemas encomenda
routes.post("/delivery/:id/problems", DeliveryProblems.store);
routes.get("/delivery/:id/problems", DeliveryProblems.index);
routes.delete("/problem/:id/cancel-delivery", DeliveryProblems.delete);

routes.post("/recipient", isAdmin, authMiddlewares, RecipientController.store);
routes.put(
  "/recipient/:id",
  isAdmin,
  authMiddlewares,
  RecipientController.update
);
routes.delete("/recipient/:id", authMiddlewares, RecipientController.delete);
routes.get("/recipient", RecipientController.index);
routes.get("/recipient/:id", RecipientController.show);

routes.post(
  "/files",
  upload.single("file"),
  authMiddlewares,
  FileController.store
);

routes.use(authMiddlewares);
// Entregadores
routes.post("/deliveryman", Deliveryman.store);
routes.get("/deliveryman", Deliveryman.index);
routes.put("/deliveryman/:id", Deliveryman.update);
routes.get("/deliveryman/:id", Deliveryman.show);
routes.delete("/deliveryman/:id", Deliveryman.delete);
// Encomendas
routes.get("/delivery", isAdmin, Delivery.index);
routes.post("/delivery", isAdmin, Delivery.store);
routes.put("/delivery/:id", isAdmin, Delivery.update);
routes.delete("/delivery/:id", isAdmin, Delivery.delete);

export default routes;
