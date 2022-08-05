import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateAuth } from "../../middlewares/validateAuth";
import { createPlace, deletePlace, fetchPlaces, getSinglePlace, updatePlace } from "./places.controller";
import { placeShema } from "./places.schema";

const router = express.Router();

router.route("/createPlace")
    .post([validateAuth, isAuthenticated, processRequestBody(placeShema.body)], createPlace);

router.route("/")
    .get(fetchPlaces);

router.route("/:placeId")
    .get(getSinglePlace)
    .delete([validateAuth, isAuthenticated], deletePlace)
    .patch([validateAuth, isAuthenticated], updatePlace)

export default router;