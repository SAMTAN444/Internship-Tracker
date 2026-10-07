import Internship from "../models/Internship.js"
import HttpError from "./HttpError.js"

// Looks up an internship scoped to its owner. Someone else's id gets the same
// 404 as a missing one, so the API never confirms that an id exists.
const findOwned = async (id, userId) => {
    const internship = await Internship.findOne({ _id: id, user: userId });
    if (!internship) throw new HttpError(404, "Internship not found");
    return internship;
};

export default findOwned;
