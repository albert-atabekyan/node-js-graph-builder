const functions = {
    cors: function cors(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
    },
    isNotValidDate: function isNotValidDate(d) {
        return isNaN(d);
    }
}

export const cors = functions.cors;
export const isNotValidDate = functions.isNotValidDate;