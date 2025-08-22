import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"

export const backendSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  API_KEY:{
    type:String
  },
  opearatingSystem:{
    type:String
  },
  labName:{
    type:String
  },
  maxContainers:{
    type:Number,
    default:10
  },
  portNo:{
    type:Number,
    default:1024
  }
},{
  timestamps:true,
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