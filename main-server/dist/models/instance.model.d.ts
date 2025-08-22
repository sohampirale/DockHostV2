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
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
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
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
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
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    userId: mongoose.Types.ObjectId;
    backendId: mongoose.Types.ObjectId;
    running: boolean;
    allocatedPorts: mongoose.Types.DocumentArray<{
        1: unknown;
        0?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        1: unknown;
        0?: any;
    }> & {
        1: unknown;
        0?: any;
    }>;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Instance;
//# sourceMappingURL=instance.model.d.ts.map