/**
 * 
 */
exports.getParams = function(req){
    let paramObj = Object.assign({}, req.params);
    return paramObj;
}

/**
 * 
 */
exports.FindMethod = {
    findById: function(Model, Id, populateInfo, callback, isEnd){
        let currentModel = Model.findById(userId).populate(populateInfo);
        if(isEnd) currentModel.exec(callback);
        return currentModel;
    },
    findAll: {
        populateOne: function(Model, populateInfo, callback, isEnd){
            let currentModel = Model.find({}).populate(populateInfo);
            if (isEnd) currentModel.exec(callback);
            return currentModel;
        },
        populateMany: function(Model, populateInfoArr, callback){
            for(let i=0; i<populateInfoArr.length; i++){
                if(i< populateInfoArr.length){
                    this.populateOne(Model, populateInfoArr[i], null, false)
                }else{
                    this.populateOne(Model, )
                }
            }
        }
    }
}

/**
 * 
 */
exports.checkIsLogin = function({loginUser}){
    if(loginUser){
        return true
    }
    return false
}