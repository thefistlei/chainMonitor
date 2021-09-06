 
 export default {            

    function appendTxUnitArray(id, addressArr, contentArr){   
        for (var i = 0;i < addressArr.length; i++) { 
            var text = "";   
            text += "<tr style='border: none;'><th >" + addressArr[i] + "</th><td rowspan='1' colspan='1' class='is-left' style='border: none;'>";

            text += "<div class='cell'>" + contentArr[i] + "</div></td></tr>"; 

            var trObj = document.createElement("tr");   
            trObj.innerHTML = text; 
            document.getElementById(id).appendChild(trObj);  
        }  
    }

    function appendTxOutput(addressArr, amountArr){ 
        console.log(addressArr.length);
        this.appendTxUnitArray("outArray" , addressArr, amountArr); 
    }

    function appendTxInput(addressArr, amountArr){
        this.appendTxUnitArray("inArray" , addressArr, amountArr); 
    }

    function appendTxIn(vin, inval){ 
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
      
         appendTxInput(addressArr, amountArr);
    }

    function appendTxOut(vout){ 
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
         } 
         appendTxOutput(addressArr, amountArr); 
         appendOutScript(typeArr, addressArr);  
    } 
}