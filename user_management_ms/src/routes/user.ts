import { Router } from "express";
import * as controller from "../controllers/user.js";

const router = Router();

router.post("/new", controller.postNew);
router.get("/:userId", controller.getUser);

export default router;
