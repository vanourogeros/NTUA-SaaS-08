import { Router } from "express";
import env from "../env.js";
import * as controller from "../controllers/chart.js";

const router = Router();

router.get(`${env.CHART_TYPE}/:userId`, controller.getCharts);
router.post(`${env.CHART_TYPE}/:userId/:id`, controller.postChart);
router.post(`/${env.CHART_TYPE}/delete/:id`, controller.postDeleteChart);

export default router;
