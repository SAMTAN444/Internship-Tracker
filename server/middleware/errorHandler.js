// Last middleware in the chain. Express 5 forwards rejected promises from async
// handlers here, so controllers can just throw.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err.status) {
        return res.status(err.status).json({ message: err.message, code: err.code });
    }

    // A malformed ObjectId in the URL is just "not found" from the client's view.
    if (err.name === "CastError") {
        return res.status(404).json({ message: "Not found" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
};

export default errorHandler;
