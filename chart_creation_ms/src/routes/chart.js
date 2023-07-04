import { Router } from "express";
import env from "../env.js";
import * as controller from "../controllers/chart.js";

const router = Router();

router.post(`/${env.CHART_TYPE}/create`, controller.postCreate);
router.post(`/${env.CHART_TYPE}/:chartId/confirm`, controller.postCofirm);

export default router;
