let header ={
  checkHeader:(req,res,next)=>{
      let headers =req.headers;
      if(headers.username=='chendanapriya' && headers.password=='12345678'){
        next();
      }else{
        return res.status(401).json({error: 'Invalid or missing Username and Password' })
      } 
  }
};

module.exports=header;