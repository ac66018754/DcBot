//#region 全域引用
const auth = require('../JSONHome/auth.json');
const request = require('request');
//#endregion

//#region 宣告請求
const baseExcel = {
    'method': 'GET',
    'url': auth.Gas.Get[0].baseExcel,
    'headers': {}
};
//#endregion

//#region 傳送請求
exports.getBaseExcel = function(callback) {
    request(baseExcel, function(error, response) {
        try {
            if (error) {
                console.log('getBaseExcelError1', error);
                callback(false);
            } else {
                const data = JSON.parse(response.body); //接收回傳(response)的body
                callback(data);
            }
        } catch (err) {
            console.log('getBaseExcelError2', err);
            callback(false);
        }
    });
};
//#endregion
//#region POST請求
exports.requestPost=function(date,newWeight){
    request.post(
        auth.Gas.Get[0].baseExcel, 
        {
            form:{
                "method": "write",
                "date":date,
                "newWeight":newWeight
            }
        },function(error, response){
            try {
                if (error) {
                    console.log("錯誤1");
                } else {
                    //console.log(response); 
                }
            } catch (err) {
                console.log("錯誤2",err);
            }
            
        }
    )

};
//#endregion
