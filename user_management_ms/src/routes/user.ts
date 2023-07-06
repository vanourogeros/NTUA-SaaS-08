import { Router } from "express";
import * as controller from "../controllers/user.js";

const router = Router();

router.post("/api/user/new", controller.postNew);
router.get("/api/user/:userId", controller.getUser);
router.post("/api/user/tokens/:userId/:newTokens", controller.addTokens);
router.get("/api/user/tokens/:userId", controller.getTokens, controller.addTokens);
router.post(
    "/api/user/charts/:userId/created",
    controller.postCreatedChart,
    controller.updateTotalCharts
);
router.post(
    "/api/user/charts/:userId/deleted",
    controller.postDeletedChart,
    controller.updateTotalCharts
);
router.post("/api/user/updateLastLogIn/:userId", controller.updateLastSignin);

export default router;
