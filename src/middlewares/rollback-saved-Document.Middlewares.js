//& rollBack Saved Document
export const rollBackSavedDocument = async (req, res, next) => {
    if(req.savedDocument){
        const {model, _id} = req.savedDocument;
        await model.findByIdAndDelete(_id);
    }
};