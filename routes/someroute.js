import { Router } from "express";

const router = Router();

router.post("/someroute", (req, res) => {
  console.log(req.body);
});

export default router;
