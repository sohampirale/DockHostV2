import mongoose, { Schema } from "mongoose";
export const instanceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    backendId: {
        type: Schema.Types.ObjectId,
        ref: "Backend",
        required: true,
    },
}, {
    timestamps: true,
});
const Instance = mongoose.model("Instance", instanceSchema);
export default Instance;
//# sourceMappingURL=instance.model.js.map