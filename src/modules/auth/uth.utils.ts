import jwt from "jsonwebtoken";
import constants from "../../constants/constants.config"

export  function signJwt(payload: string | Buffer | object) {
    return jwt.sign(payload, constants.jwtSecret, { expiresIn: constants.expiresIn });
}


export default function verifyJwt(token: string) {
    try {
        const decoded = jwt.verify(token, constants.jwtSecret)
        return decoded;

    } catch (err) {
        return null;
    }

}