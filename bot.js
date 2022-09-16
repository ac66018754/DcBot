//#region 全域變數
    const Discord = require('discord.js'); //引用discord.js這個工具，之後如果要引用discord.js的程式碼，都可以直接調用Discord來實現!
    const client = new Discord.Client(); //宣告一個 Discord(discord.js)下的Client方法，
                                        //然後將Client方法的結果賦予到client這個常數上,之後如果要引用discord.js底下的Client，可以直接呼叫client。
                                        //這邊我們額外從Discord中拉出Client()是因為這個client是要用來當bot本體的，也就是我們的遙控器(x
    const auth = require('./JSONHome/auth.json'); //之後想調用auth.json底下的資源，可以直接呼叫auth。
    const prefix = require('./JSONHome/prefix.json');//前綴字的統整
    const GetGas=require('./Script/GetGas');
    //存放BaseExcelAPI資料
    let BaseExcelData = false; 

//#endregion

//#region 登入

    //client為機器人本身
    client.login(auth.key); //執行client的登入行為，登入的key我們放入bot的key

    // on是client的監聽行為
    client.on('ready', () => {
        GetGas.getBaseExcel(function(dataED) {
            if (dataED) {
                BaseExcelData = dataED //有資料
            }
        })
        console.log(`Logged in as ${client.user.tag}!`);
    });
    
//#endregion

//#region 監聽message事件
client.on('message',msg=>{

    //第一步:防呆機制
    try{
        if(!msg.guild||!msg.member)return; //確認訊息是傳在群組，而不是私訊給機器人
        if(!msg.member.user) return;
        if(msg.member.user.bot) return; //如果訊息來源是一個機器人，那麼就不予理會。
    }
    catch(err){
        return;
    }

    //第二步:字串分析
    try{
        let tempPrefix = '-1';  //用tempPrefix來代表前綴字的種類編號

        const prefixED = Object.keys(prefix); //Object.keys會將參數物件本身的key，由小到大排好後透過陣列回傳。若物件內沒有key，則會幫他加上去，從0開始，(像prefix.json就沒有key)
        prefixED.forEach(element => {  //element值為prefixED陣列裡的值(0、1、2....看prefix.json這個物件內的陣列物件裡面，有幾個物件)
            if (msg.content.substring(0, prefix[element].Value.length) === prefix[element].Value) {//如果傳的訊息可以跟某個前綴詞匹配到的話
                tempPrefix = element;//那就記住這個前綴詞在prefixED陣列中的位置
            }
        });

        switch (tempPrefix) {//由tempPrefix來分類前綴字

            case '0': //文字回應功能
                TextReplyFunction(msg,tempPrefix);
                break;
            case '1': //音樂指令
                msg.channel.send('music');
                break;
            default:
                BaseExcelFunction(msg);
                break;
        }
    }
    catch(err){
        console.log('OnMessageError', err);
    }
})
//msg是每當client收到message時，discord.js會給予我們的變數，我們將變數稱作msg
// 因為discord.js會回傳的變數是固定的，如果我們這邊像上面一樣寫成() => {}的話，雖然也可以執行但就不會將discord.js回傳的值再做處理。
// 反過來說，如果我們宣告了msg1跟msg2兩個變數來接回傳值，因為discord.js的message事件並沒有給我們這麼多參數，所以msg2是接收不到東西的
//#endregion

//#region 子類方法

//文字回復
function TextReplyFunction(msg,tempPrefix){
    const cmd = msg.content.substring(prefix[tempPrefix].Value.length).split(' '); //以空白分割前綴以後的字串(去掉驚嘆號，並將後面的訊息依空格分開，並存到cmd陣列中)
        switch (cmd[0]) {//判斷接在驚嘆號後的第一個"詞"(也有可能是空格，ex:! xxx)
            case 'help':
                msg.channel.send('目前可以使用!help、!embed、@等指令');
                break;
            case '用msg.reply':
                msg.reply('test');
                break;
            case '記錄體重':
                let newWeight=cmd[1];
                GetGas.requestPost(getDate(),newWeight);//將資料Post過去
                newdataED=false;
                setTimeout( () => {
                    GetGas.getBaseExcel(function(newdataED) {
                        if (newdataED) {
                            BaseExcelData = newdataED //有資料
                            let todayWeight,weightAvg7,weightAvg30;
                            todayWeight=BaseExcelData[BaseExcelData.length-1].WEIGHT;
                            weightAvg7=BaseExcelData[BaseExcelData.length-1].WEIGHT_AVG7;
                            weightAvg30=BaseExcelData[BaseExcelData.length-1].WEIGHT_AVG30;
                            msg.channel.send('今日體重:'+todayWeight+'kg\t近7日平均體重:'+weightAvg7+'kg\t近30日平均體重:'+weightAvg30+'kg');
                        }
                    })
                }, 1000)
                break;
            case 'Melody':    
                const melody = new Discord.MessageEmbed()
                .setColor('#FFFF99')
                .setTitle('你問農')
                .addField('21歲', '性別:女', true)
                .addField('興趣', '不知道', true)
                .setTimestamp()
                .setFooter('這樣可以ㄇ');
                msg.channel.send(melody);
                break;
            case 'embed':
                const embed = new Discord.MessageEmbed()
                .setColor('#FFFF99')
                .setTitle('測試Embed鑲嵌式訊息')
                .setURL('https://discord.js.org/')
                .setAuthor('李宗恩', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .setDescription('這裡可以放描述...')
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addField('Regular field title', 'Some value here')
                .addField('\u200B', '\u200B')
                .addField('Field標題', '可以放一些東西', true)
                .addField('Field標題', '可以放一些東西', true)
                .addField('Field標題', '可以放一些東西', true)
                .setImage('https://i.imgur.com/wSTFkRM.png')
                .setTimestamp()
                .setFooter('這裡是Footer區', 'https://i.imgur.com/wSTFkRM.png');
                msg.channel.send(embed);
        }
};
function getDate(){
    let date=new Date();
    let todayYear=date.getFullYear();
    let todayMonth=date.getMonth()+1;
    let todayDay=date.getDate();
    return todayYear+"/"+todayMonth+"/"+todayDay;
};
//對話資料庫系統
function BaseExcelFunction(msg) {
    const messageED = GetBaseExcelData(msg);
    if (messageED) msg.channel.send(messageED);
}   
//BaseExcel字串比對
function GetBaseExcelData(msg) {
    try {
        if (BaseExcelData) {  //BaseExcelData是JSON格式
            console.log(BaseExcelData);
            // const userMessage = msg.content;
            // e = BaseExcelData.filter(element => element.WEIGHT === userMessage)
            // if (e) return e[0].WEIGHT;
            // else return false;
        }
    } catch (err) {
        console.log('GetBaseExcelDataError', err);
    }
}
//#endregion

//#region 不知道錯哪邊區
//抓刪 刪除事件
client.on('messageDelete', function (message) {
    if (!message.guild) return; //只要是來自群組的訊息
    let mStr = '';
    try{
        mStr = mStr+
            `事件 刪除\n`+
            `使用者 ${message.member.user.username}\n`+
            `群組 ${message.channel.name}\n`+
            `刪除內容 ${message.content}`;

            client.channels.fetch(message.channel.id).then(channel => channel.send(mStr)).catch(err => { console.log(err + 'messageUpdate 文字錯誤')})
    }catch(err){
        console.log("messageDeleteError",err);
    }
});

//抓刪 更新事件
client.on('messageUpdate', function (oldMessage, newMessage) {
    if (!oldMessage.guild || !newMessage.guild) return;
    mStr = '';
    try {
        mStr = mStr +
            `事件 更新\n` +
            `使用者 ${oldMessage.member.user.username}\n` +
            `群組   ${oldMessage.channel.name}\n` +
            `舊對話 ${oldMessage.content}\n` +
            `新對話 ${newMessage.content}`;

            client.channels.fetch(oldMessage.channel.id).then(channel => channel.send(mStr)).catch(err => { console.log(err + 'messageUpdate 文字錯誤')})
    } catch (err) {
        console.log('messageUpdateError', err);
    }
})
//#endregion

// var sa = require('superagent');
// sa.post(auth.Gas.Get[0].baseExcel)
//   .send({"method": "write",
//   name: "Wayne",
//   sex: "male",
//   remark: "測試寫入功能"})
//   .end(function(err, res) {
//     //TODO
//   });

//這段會失敗
// const axios = require('axios')
// axios
//   .post(auth.Gas.Get[0].baseExcel, {
//     "method": "write",
//     "name": "Wayne",
//   })
//   .then(res => {
//   })
//   .catch(error => {
//   })
//這段會成功
// const request = require("request");
// const options = {
//     url:auth.Gas.Get[0].baseExcel,
//     method: 'POST',
//     followAllRedirects: true,
//     form:{
//         "method": "write",
//         "name": "Wayne",
//     }
// }
// request(options,function(err, res, body){});

