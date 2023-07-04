import { Router } from "express";
import * as controller from "../controllers/user.js";

const router = Router();

router.post("/new", controller.postNew);
router.get("/:userId", controller.getUser);
router.post("/tokens/:userId/:newTokens", controller.addTokens);
router.get("/tokens/:userId", controller.getTokens, controller.addTokens);
router.post(
    "/charts/:userId/created",
    controller.postCreatedChart,
    controller.updateTotalCharts
);
router.post(
    "/charts/:userId/deleted",
    controller.postDeletedChart,
    controller.updateTotalCharts
);
router.post("/updateLastLoginIn/:userId", controller.updateLastSignin);

export default router;
