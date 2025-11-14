let response = {
    success: (message)=>{
        let res = {
            success: true,
            "status":"success",
            "message":message,
            "code": "00"
        }
        return res;
    },

    successData: (data,message="success")=>{
        let res = {
            success: true,
            "status":"success",
            "message":message,
            "data":data,
            "code": "00"
        }
        return res;
    },

    failed: (message)=>{
        let res = {
            success: false,
            "status":"failed",
            "message":message,
            "code": "401"
        }
        return res;
    },
    failedData: (data,message="failed")=>{
        let res = {
            success: false,
            "status":"failed",
            "data":data,
            "message":message,
            "code": "401"
        }
        return res;
    }
}

module.exports = response;