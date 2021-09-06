//import txCommon from './transaction_com.js';
//Vue.prototype.txCommon=txCommon;

var app = new Vue({
    el: '#app',
    data: {
        query: window.location.search,
        blockNumber: 0,  
        time:0, 
        nConfirm:0,
        hash:0,
        virtualSize:0,          
        size:0,
        weight:0,        

        inAmount:0,
        outAmount:0, 
        sigops:0, 
        vin: [],
        out: [], 
        inval: [], 
        fee:1,
        minerFee:0,
        outLength:"",
        inLength:"",
    },
    created () {
        this.get_transaction_detail();
    },
    methods:{
        getTxTo:function(n){
            return this.hash;
        },
        getTxFrom:function(n){   
            //var tx = this.transaction_list[n];
            //alert(tx);
            //var obj = JSON.parse(tx);   
             return "CoinBase";  
            //console.log(obj["hash"]);
           //var inVal =  tx["hash"];
           //return inVal["coinbase"];
            //return inVal["scriptPubKey"];//return app.transaction_list[n]["scriptPubKey"];
        },
          
        appendTxUnitArray:function(id, addressArr, contentArr){   
            for (var i = 0;i < addressArr.length; i++) { 
                var text = "";   
                text += "<tr style='border: none;'><th >" + addressArr[i] + "</th><td rowspan='1' colspan='1' class='is-left' style='border: none;'>";

                text += "<div class='cell'>" + contentArr[i] + "</div></td></tr>"; 

                var trObj = document.createElement("tr");   
                trObj.innerHTML = text; 
                document.getElementById(id).appendChild(trObj);  
            }  
        }, 

        appendTxOutput:function(addressArr, amountArr){ 
            console.log(addressArr.length);
            this.appendTxUnitArray("outArray" , addressArr, amountArr); 
        },

        appendTxInput:function(addressArr, amountArr){
            this.appendTxUnitArray("inArray" , addressArr, amountArr); 
        }, 
 
        appendInScript:function(typeArr, contentArr){ 
            this.appendTxUnitArray("inSriptArray" , typeArr, contentArr); 
        },

        appendOutScript:function(typeArr, contentArr){
            this.appendTxUnitArray("outSriptArray" , typeArr, contentArr); 
        },

        appendTxIn:function(vin, inval){ 
             var amountArr = new Array();
             for(var i = 0;i < inval.length; i++){
                var inVal = inval[i]; 
                amountArr[i] = inVal["val"].toFixed(8) + " BTC";
             } 

             var addressArr = new Array(); 
             //alert(vin.length);
             for(var i = 0;i < vin.length; i++){
                var inVal = vin[i];
                //alert(inVal);
                console.log(inVal["coinbase"]);
                if(inVal["coinbase"] ===undefined)
                    addressArr[i] = inVal["asm"];
                else{
                    addressArr[i] = "Coinbase";
                    amountArr[i] = "";
                }
             }   
          
             this.appendTxInput(addressArr, amountArr);
        },

        appendTxOut:function(vout){ 
             var amountArr = new Array();
             var addressArr = new Array(); 
             var typeArr = new Array(); 
             for(var i = 0;i < vout.length; i++){
                var outVal = vout[i];
                var pubkey = outVal["scriptPubKey"];
                addressArr[i] = pubkey["asm"];
                typeArr[i] = pubkey["type"].toUpperCase();
                if(typeArr[i] === "PUBKEY")
                    typeArr[i] = "P2PKH";
                amountArr[i] = outVal.value.toFixed(8) + " BTC";
                console.log(amountArr[i]);
                //alert(pubkey[""]);

                //alert(outVal["type"]);  
                //alert(outVal["asm"]);  
                //if(in["coinbase"] ===undefined)
                   // addressArr2[i] = in["asm"];
                //else
                   // addressArr2[i] = in["coinbase"];
             } 
             this.appendTxOutput(addressArr, amountArr); 
             this.appendOutScript(typeArr, addressArr);   
            // var amountArr2 = new Array();
            // for(var i = 0;i < app.inval.length; i++){
              //  var in = app.inval[i]; 
               // amountArr2[i] = in["val"];
            // } 
        },
        getInLength:function(n){ 
            return "输入（" + n + "）";  
        },
        getOutLength:function(n){ 
            return "输出（" + n + "）";  
        },

        get_transaction_detail: function(){
            console.log('发送请求')
            var childArr = this.query.split("=");  

            var hash = childArr[1];
            $.ajax({   
                url:"../php/btcinfo.php?fun=9&txhash=" + hash,

                //data是成功返回的json串
                success:function(data,status){  
                    console.log(data); 
                    var obj = JSON.parse(data);  
                    
                    app.hash = obj["hash"];

                    app.blockNumber = obj["height"];
                    app.time = obj["time"];
                    app.size = obj["size"]; 
                    app.virtualSize = obj["vsize"];
                    app.weight = obj["weight"]; 
 
                    //app.total = obj["total"];
                    //app.fee = obj["fee"];
                    //app.pay = obj["pay"];
                    app.difficulty = obj["difficulty"];
                    app.nConfirm = obj["confirmations"]; 

                    app.bits = "0x" + obj["bits"];
                    app.nonce = "0x" + obj["nonce"];
                    app.nextHash = obj["nextblockhash"];
                    app.priHash = obj["previousblockhash"];
                    app.nConfirm = obj["confirmations"];

                    app.vin = obj["vin"]; 
                    //alert(this.vin.length);
                    app.vout = obj["vout"];  
                    app.inval = obj["inval"];  
                    app.outLength = app.$options.methods.getInLength(app.vin.length);  
                    app.inLength = app.$options.methods.getOutLength(app.vout.length);  

                    var inTotal = (obj["inTotal"]/1e8).toFixed(8);
                    var outAmount = (obj["outTotal"]/1e8).toFixed(8);
                    var fee = app.inAmount - app.outAmount;
                    if(fee < 0)
                        fee = 0;
                   
                     app.inAmount = inTotal + " BTC";
                     app.outAmount = outAmount + " BTC";
                     app.fee = fee + " BTC";

                     var minerFee = (fee/(app.virtualSize*1000)).toFixed(8);
                     app.minerFee = minerFee + " BTC";
                     
                     app.$options.methods.appendTxIn(app.vin, app.inval);
                     app.$options.methods.appendTxOut(app.vout);
                },
                error:function(data,status){
                    alert('失败');
                }
            });     
        },
    }
});
