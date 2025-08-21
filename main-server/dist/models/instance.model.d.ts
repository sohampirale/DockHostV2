import mongoose from "mongoose";
export declare const instanceSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
declare const Instance: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Instance;
//# sourceMappingURL=instance.model.d.ts.map