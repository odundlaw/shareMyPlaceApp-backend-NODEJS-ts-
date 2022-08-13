import express from "express";
import { processRequestBody } from "zod-express-middleware";
import { placeFileHelper } from "../../middlewares/fileHelper";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateAuth } from "../../middlewares/validateAuth";
import { createPlace, deletePlace, fetchPlaces, getSinglePlace, getUserPlacesById, updatePlace } from "./places.controller";
import { placeShema } from "./places.schema";

const router = express.Router();

router.route("/createPlace")
    .post([validateAuth, isAuthenticated, placeFileHelper, processRequestBody(placeShema.body)], createPlace);

router.route("/")
    .get(fetchPlaces);

router.route("/:placeId")
    .get(getSinglePlace)
    .delete([validateAuth, isAuthenticated], deletePlace)
    .patch([validateAuth, isAuthenticated, placeFileHelper], updatePlace)

router.route("/user/:userId")
    .get([validateAuth, isAuthenticated], getUserPlacesById);

export default router;