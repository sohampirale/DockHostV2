import mongoose from "mongoose";
export declare const backendSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
declare const Backend: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
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
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    maxContainers: number;
    API_KEY?: string | null;
    opearatingSystem?: string | null;
    labName?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Backend;
//# sourceMappingURL=backend.model.d.ts.map