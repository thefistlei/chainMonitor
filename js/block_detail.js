var app = new Vue({
    el: '#app',
    data: {
        blockNumber: 0, 
        difficulty: 0,
        nonce:0,
        time:0, 
        nTx:0,
        hash:0,
        transaction_list: [],
        vin: [],
        out: [],
        query: window.location.search,
        block_detail: '',
        block_detail_str: '',
        nextHash:0,
        priHash:0,
        merkerRoot:0,
        bits:0,
        fee:1,
        pay:1,
        weight:0,
        size:0,
        total:1,
        firstTx:[]
    }, 

    created () {
        this.get_block_detail();
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

        appendTxUnitArray:function(strText, amout, addressArr, amountArr){ 
            //col1
            var text = ""; 
            text += "<td><table width=600 class = 'chtable'><colgroup><col width='360'> <col width='240'></colgroup><tbody>";
            text += "<tr style='border: none;'><th width='360'>" + strText + "</th><td width='240' rowspan='1' colspan='1' class='is-right' style='border: none;'>";
            text += amout + "</td></tr>";  
    
            text += "<tr style='border: none;'><td><hr width= 360 /></td></tr>"; 
            text += this.appendUTXOArray(addressArr, amountArr);
            text += "</tbody></table></td>";
            return text;              
        },
        
/*
        appendTxUnitArray:function(id, addressArr, contentArr){   
            for (var i = 0;i < addressArr.length; i++) { 
                var text = "";   
                text += "<tr style='border: none;'><th >" + addressArr[i] + "</th><td rowspan='1' colspan='1' class='is-left' style='border: none;'>";

                text += "<div class='cell'>" + contentArr[i] + "</div></td></tr>"; 

                var trObj = document.createElement("tr");   
                trObj.innerHTML = text; 
                document.getElementById(id).appendChild(trObj);  
            }  
        }, */     
       
        appendTitle:function(tx){
            //per transaction
            var trObj = document.createElement("tr");   

            //title
            var text = "<tr style='border: none;'><td>";
            text += "<table width=1351 class = 'chtable'><colgroup> <col width='710'> <col width='300'> <col width='351'> </colgroup>";
            text += "<tbody><tr width=1351px style='border: none;'> <table class='chtable'> <tr style='border: none;'>";

            text += "<td>  <table class = 'chtable'><colgroup> <col width='100'> <col width='610'></colgroup>";
            text += "<tbody><tr style='border: none;'><th>交易哈希 </th> <td style='border: none;'><div class='cell'>" + tx["hash"] + "</div></td></tr></tbody></table></td>"; 
                           
            var vSize = tx["vsize"];
            var inTotal = (tx["inTotal"]/1e8);
            var outAmount = (tx["outTotal"]/1e8); 
            var fee = inTotal - outAmount; 
            var minerFee;
            if(fee < 0){
                fee = 0; 
                minerFee = "0 Satoshis/vByte";
            }
            else 
                minerFee = (fee/(vSize*1000))*1e8.toFixed(0) + " Satoshis/vByte";
          

            text += "<td>  <table class = 'chtable'><colgroup> <col width='100'> <col width='200'></colgroup>";
            text += "<tbody><tr style='border: none;'><th>交易费率 </th> <td style='border: none;'><div class='cell'>" + minerFee + "</div></td></tr></tbody></table></td>";  

            text += "<td>  <table class = 'chtable'><colgroup> <col width='100'> <col width='251'></colgroup>";
            text += "<tbody><tr style='border: none;'><th>虚拟交易大小 </th> <td style='border: none;'><div class='cell'>" + vSize + "</div></td></tr></tbody></table></td>";  

            text += "</tr></table></tr> </tbody></table>";  

            text += "</td></tr>";  

            trObj.innerHTML = text; 
            document.getElementById("tb").appendChild(trObj); 
        },
        
        appendTxToImg:function(){

            return "<td><img src='./pic/arrow.png' style=\'width:30px;height:30px;\'/></td>";  
        },

        appendUTXOArray:function(addressArr, amountArr){  
            var text = "";    
            for (var i = 0;i < addressArr.length; i++) {

                text += "<tr style='border: none;'><th width='360'>" + addressArr[i] + "</th><td width='240' rowspan='1' colspan='1' class='is-right' style='border: none;'>";

                text += "<div class='cell'>" + amountArr[i] + "</div></td></tr>"; 
            }
            return text;
        },
        getInLength:function(n){ 
            return "输入（" + n + "）";  
        },
        getOutLength:function(n){ 
            return "输出（" + n + "）";  
        },

        appendTxOutput:function(vout, outTotal){   
            var amountArr = new Array();
            var addressArr = new Array(); 
      
             for(var i = 0;i < vout.length; i++){
                var outVal = vout[i];
                var pubkey = outVal["scriptPubKey"];
                addressArr[i] = pubkey["asm"].substring(16);
      
         
                amountArr[i] = outVal.value.toFixed(8) + " BTC";
                console.log(amountArr[i]); 
             }   

            return this.appendTxUnitArray(this.getOutLength(vout.length), outTotal.toFixed(8) + " BTC", addressArr, amountArr); 
        },

        appendTxInput:function(inTotal, vin, inval){
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
                 
                if(inVal["coinbase"] ===undefined)
                    addressArr[i] = inVal["asm"];
                else{
                    addressArr[i] = "Coinbase";
                    amountArr[i] = "";
                }
             }   
          

            return this.appendTxUnitArray(this.getInLength(vin.length), inTotal.toFixed(8) + " BTC", addressArr, amountArr); 
        },


        appendTx:function(tx){
            //per transaction
            this.appendTitle(tx);// app.$options.methods.appendTx();
             
            var trObj1 = document.createElement("tr");  

            //txin and txout
            //
            var text = "<tr style='border: none;'><td>";
            text += "<table width=1351 class = 'chtable'><colgroup><col width='600'><col width='101'><col width='650'></colgroup><tbody><tr width=1351px style='border: none;'>";

            //col1  
            text += this.appendTxInput(tx["inTotal"], tx["vin"], tx["inval"]); 
            
            //col2           
            text += this.appendTxToImg();  

            //col3            
            text += this.appendTxOutput(tx["vout"], tx["outTotal"]); 

            //col table end
            text += "</tr></tbody></table>";  
 
            text += "</td></tr>";  
            trObj1.innerHTML = text; 
            document.getElementById("tb").appendChild(trObj1); 
        },
        get_block_detail: function(){
            console.log('发送请求')
            var childArr = this.query.split("=");  

            $.ajax({   
                url:"../php/btcinfo.php?fun=5&blockParam=" + childArr[1],

                //data是成功返回的json串
                success:function(data1,status){   
                    
                    var obj = JSON.parse(data1);  

                    app.hash = obj["hash"];

                    app.blockNumber = obj["height"];
                    app.time = obj["time"];
                    app.size = obj["size"]; 
                    app.nTx = obj["nTx"];
                    app.weight = obj["weight"]; 


                    //app.total = obj["total"];
                    //app.fee = obj["fee"];
                    //app.pay = obj["pay"];
                    app.difficulty = obj["difficulty"];
                    app.confirm = obj["confirmations"]; 

                    app.bits = "0x" + obj["bits"];
                    app.nonce = "0x" + obj["nonce"];
                    app.nextHash = obj["nextblockhash"];
                    app.priHash = obj["previousblockhash"];
                    app.merkerRoot = obj["merkleroot"];

                    app.transaction_list = obj["tx"]; 

                    for(var i = 0; i < app.transaction_list.length;i++)
                        app.$options.methods.appendTx(app.transaction_list[i]);
                    //app.vin = obj["tx"]["vin"];
                    //app.out = obj["vout"];
                    //alert(app.vin.length);  
                },
                error:function(data,status){
                    alert('失败');
                }
            });      
        },
    }
});
