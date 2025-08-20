import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"

const backendSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

backendSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,5)
    }
    next()
})

backendSchema.methods.comparePassword=async function(password:string){
    return await bcrypt.compare(password,this.password)
}

const Backend = mongoose.model("Backend",backendSchema);

export default Backend;
