// Throw from any handler; errorHandler turns it into { message, code } JSON.
export default class HttpError extends Error {
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
