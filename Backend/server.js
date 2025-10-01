const express=require('express');
const app=express();
app.get('/',(rer,res)=> 
res.send("fitness backend is running")
);
const PORT=process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("server is running on port http://localhost:5000/ "
    
)); //to start express server
