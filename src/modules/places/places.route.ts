import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateAuth } from "../../middlewares/validateAuth";
import { createPlace, deletePlace, fetchPlaces, getSinglePlace, updatePlace } from "./places.controller";
import { placeShema } from "./places.schema";

const router = express.Router();

router.post("/createPlace", [validateAuth, isAuthenticated, processRequestBody(placeShema.body)], createPlace);

router.get("/", fetchPlaces);

router.get("/:placeId", getSinglePlace);

router.delete("/:placeId", [validateAuth, isAuthenticated], deletePlace);

router.patch("/:placeId", [validateAuth, isAuthenticated], updatePlace)


export default router;