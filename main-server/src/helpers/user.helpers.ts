export async function checkIfInstanceExists(socket:any,USERNAME:string){
  return new Promise((resolve) => {
    socket.emit("check_if_container_exists",{USERNAME})
    socket.once(USERNAME, (exists:boolean) => {
      resolve(exists);
    });
  }); 
}


export async function asyncSocketAwaiter(socket:any,event:string,handler:any){
    return new Promise((resolve)=>{
        socket.once(event,async (data:any)=>{
            await handler(data)
            resolve(true)
        })
    })
}