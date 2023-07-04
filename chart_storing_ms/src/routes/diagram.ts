import { Router } from "express";
import * as controller from "../controllers/diagram.js";

const router = Router();

router.get("/:userId", controller.getCharts);
router.post("/:userId/:id", controller.postChart);
router.post("/delete/:id", controller.postDeleteChart);

export default router;
