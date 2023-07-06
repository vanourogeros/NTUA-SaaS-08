import { Router } from "express";
import env from "../env.js";
import * as controller from "../controllers/chart.js";

const router = Router();

router.get(`/api/charts/${env.DATA_TYPE}/:userId`, controller.getCharts);
router.get(`/api/chart/${env.CHART_TYPE}/${env.DATA_TYPE}/:id`, controller.getChart);
router.post(`/api/chart/${env.CHART_TYPE}/${env.DATA_TYPE}/delete/:id`, controller.postDeleteChart);

export default router;
