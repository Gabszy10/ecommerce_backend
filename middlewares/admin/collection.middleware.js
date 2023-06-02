// db
const db = require("../../models");
const Collection = db.collections;

module.exports = {
    checkCollection: async (req, res, next) => {
        try {
            const { collectionId } = req.params;

            const collection = await Collection.findOne({
                where: {
                    id: collectionId,
                },
            });

            if (collection === null) throw "collection not found";

            req.collection = collection;

            next();
        } catch (err) {
            console.log(err);

            return res.status(400).json({
                err,
            });
        }
    },
};
