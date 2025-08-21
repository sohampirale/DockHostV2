import mongoose from "mongoose";
export declare function getUserWithId(_id: string): Promise<(mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare function getAllInstancesOfUserWithId(_id: string): Promise<any>;
//# sourceMappingURL=user.services.d.ts.map