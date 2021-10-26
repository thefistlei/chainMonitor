
var app = new Vue({
    el: '#app',
    data: {
        totalNum: 1,
        intervalData:null,    // 定时器
        intervalUI:null,    // 定时器
        intervalBlock:null,    // 定时器        
        server_list: [],
        server_list2: [],
        nCurrBlock:1,
        nBeginBlock:1,
        strTxIDQuery:"",
        webServer:[],
        port:[]
    },
    created () {
        console.log('1') 
 /*
        for(var i = 0; i < 50; i++) { 
            this.webServer.push('192.168.0.35')
        }

        var nBegin = 8888;
        for(var i = 0; i < 50; i++) {
            var nPort = nBegin + i; 
            this.port.push(nPort.toString())
        }
 
        this.port = new Array(
            "8888",
            "8888",
            "8888",
            "8888",
            "8888"
        );   

        this.webServer = new Array(
            "49.232.107.236",
            "47.105.185.24",
            "192.168.101.53",
            "192.168.0.78",
            "192.168.0.233"
        );      

        this.port = new Array(
            "8888",
            "8888",
            "8888" 
        );   

        this.webServer = new Array(
            "192.168.101.50",
            "192.168.101.51", 
            "192.168.101.52"
        );
       */         
        //this.readFile();    
        
        let f = this.getAllServer;
        this.readUrlFile(function(){
            f(); 

            // 计时器正在进行中，退出函数
            if (this.intervalData != null) {
                return;
            }     
            this.intervalData = setInterval(() => {
                f();
            }, 1000*60);
        });        
    }, 

    destroyed() {
         //页面关闭时清空
         this.clear();
    },
    methods:{  
        readUrlFile: function(callback){ 
            var ipServer = "192.168.0.233";
            var port = "8000";
            var strUrl = "http://" + ipServer + ":" + port;
            console.log(strUrl);
 
            jQuery.support.cors = true;
              
            $.ajax({   
                url: strUrl,

                //data是成功返回的json串
                success:function(data1,status){  
                    console.log(data1); 
                    var retArr = data1.split("\n"); 
                    console.log(retArr);   
                    console.log(retArr.length); 

                    app.port = new Array();
                    app.webServer = new Array();

                    for (i = 0; i < retArr.length; i++) { 
                        if (retArr[i].length > 0){ 
                            console.log(retArr[i]);   
                            var childArr = retArr[i].split(" "); 
                            console.log(childArr);   
                            console.log(childArr.length); 

                            if(childArr.length === 4) { 
                                app.webServer[i] = childArr[0]; 
                                app.port[i] = childArr[1]; 
                            }
                            else
                                console.log("server file error")
                        }
                    }               

                    console.log(app.webServer)
                    console.log(app.port) 
                    callback();
                },
                error:function(data1,status){
                    console.log(data1);        
                }
            });   
        },     

        // 停止定时器
        clear() {
            clearInterval(this.intervalData); //清除计时器
            this.intervalData = null; //设置为null

            clearInterval(this.intervalUI); //清除计时器
            this.intervalUI = null; //设置为null
            console.log("clear ----------------------");
        },

        checkDataUndefined(data) { 
            //console.log(data);
            if(data["blockheight"] === undefined && data["blockMaker"] === undefined) {  
                //console.log("undefined-------------------------------------------------------");
                data["index"] = -1; 
                data["blockheight"] = "---";
                data["peer_num"] = "---";
                data["blockMaker"] = "---";
                data["blocktime"] = "---";
                data["blockhash"] = "---";
            } 
            return data;
        },

         getBlockData: function(index, ipServer, port){ 
            //console.log(ipServer)
            //console.log("server" , ipServer)
            var strUrl = "http://" + ipServer + ":" + port + "/taf/taf_getInfo"
            console.log(strUrl);
                $.ajax({   
                    url: strUrl,
 
                    //data是成功返回的json串
                    success:function(data1,status){  
                        /*
                        if(index === 10 || index === 11){
                            var data = {};      
                            data["clr"] = app.converRgbToArgb(255,0,0);                
                            data["index"] = -1
                            data["server"] = ipServer
                            data["blockheight"] = "/"
                            data["peer_num"] = 0
                            data["blockMaker"] = "/"
                            data["blocktime"] = "/"
                            data["blockhash"] = "/"
                            app.server_list.push(data);  
      
                            console.log(ipServer, app.server_list.length, app.totalNum);   
                            app.showResult();  
                            return;
                        }*/

                       // console.log(data1) 
                        var data = {};    
                        data["clr"] = app.converRgbToArgb(255, 255, 255);                                
                        data["index"] = index
                        data["server"] = ipServer + ":" + port 
                        data["blockheight"] = data1.head_block_num 
                        /*
                        if(index === 0)
                            data["blockheight"] = 5;
                        if(index === 1)
                            data["blockheight"] = 6;
                        if(index === 2)
                            data["blockheight"] = 7;
                        */

                        data["peer_num"] = 0
                        data["blockMaker"] = data1.head_block_maker
                        data["blocktime"] = data1.head_block_time
                        data["blockhash"] = data1.head_block_id 
                        //console.log(data)    
  
                        data = app.checkDataUndefined(data);

                        app.server_list.push(data);     

                        //console.log(app.server_list.length) 
                        //console.log(ipServer, app.server_list.length, app.totalNum);   
                        app.showResult();                 
                    },
                    error:function(data1,status){

                        if(ipServer.indexOf("204") != -1 )
                            console.log("204 =====================================");

                        //alert(status);
                        var data = {};      
                        data["clr"] = app.converRgbToArgb(255,0,0);                
                        data["index"] = -index;
                        data["server"] = ipServer
                        data["blockheight"] = "/"
                        data["peer_num"] = 0
                        data["blockMaker"] = "/"
                        data["blocktime"] = "/"
                        data["blockhash"] = "/"
                        app.server_list.push(data);  
  
                        console.log(ipServer, app.server_list.length, app.totalNum);   
                        app.showResult();                               
                    }
                });   
        },
        
        isHeightError: function(h){  
            if(h === "/" || h === "---")
               return true;
            return false;
        },

        getHeightPrior: function(a, b){  
            if(a.blockheight === "/" && b.blockheight === "/")
               return a.index - b.index;
            else if(a.blockheight === "/" && b.blockheight === "---")
               return 1;        
            else if(a.blockheight === "---" && b.blockheight === "/")
               return -1;                   
            else if(a.blockheight === "---" && b.blockheight === "---")
               return a.index - b.index;
        },

        showResult: function(){  
            if(app.server_list.length === app.totalNum){
                app.server_list2 = app.server_list.sort(function(a, b)
                    {
                        //console.log(a.blockheight, b.blockheight);

                        if(a.blockheight > 0 && app.isHeightError(b.blockheight))
                            return 1;
                        else if (app.isHeightError(a.blockheight) && b.blockheight > 0)
                            return -1;
                        else if (app.isHeightError(a.blockheight) && app.isHeightError(b.blockheight))
                            return app.getHeightPrior(a, b);
                             
                        var blockheight = a.blockheight - b.blockheight;
                        if (blockheight === 0)
                            return a.index - b.index;
                        else
                            return blockheight;
                    }
                ); 
                app.server_list2 = app.server_list2.sort();
                /*
                var dataArr = [];
                for(var i=0;i < app.server_list2.length;i++){ 
                    var data = {};      
                    data["h"] = app.server_list2[i].blockheight;             
                    data["node"] =  app.server_list2[i].server;  

                    dataArr.push(data);  
                }
                console.log(dataArr);*/
 
                // 计时器正在进行中，退出函数
                if (app.intervalUI != null) {
                    return;
                }
   
                app.intervalUI = setInterval(() => {
                    app.checkData(); 
                }, 1000*1);
            }
        },

        // rgb转int
        converRgbToArgb: function(r,g,b){   
             return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }, 

        isArrayContain: function(arr, val){    
            let result = false;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    return i;
                }
            }
            return -1;
        }, 
           
        getArrayMax: function(arr){    
            let val = -1;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > val) {
                    val = arr[i];
                }
            }
            return val;
        }, 

        checkData: function(){ 
            var t_name = document.getElementById("tableid");
            console.log(t_name); 

            var trs=t_name.getElementsByTagName("tr");
            if (app.server_list2.length !== trs.length){
                console.log("datalist error trs-----------------------------------");
                console.log(app.server_list2.length);
                console.log(trs.length);
                return;
            }
            clearInterval(this.intervalUI); //清除计时器
            app.intervalUI = null;
            app.setTextClr();
        },

        setTextClr: function(){         

            var heightArr = [];
            var heightWeight = [];

            for(var i=0;i < app.server_list2.length;i++){ 
                var h = app.server_list2[i].blockheight;
                var index = app.isArrayContain(heightArr, h);
                if(index < 0){
                    heightArr.push(h);   
                    heightWeight.push(0);
                }
                else
                    heightWeight[index] = heightWeight[index] + 1;
            }
            console.log(heightWeight);
            console.log(heightArr);
            var max = app.getArrayMax(heightWeight);


            var nClr = heightArr.length;
            //console.log(nClr);
            for(var i=0;i < app.server_list2.length;i++){ 
                var h = app.server_list2[i].blockheight;
                var index = app.isArrayContain(heightArr, h);
                
                console.log(max, heightWeight[index]);
                if(max !== heightWeight[index]){       
                    var clr = (nClr - index)*1.0/nClr; 

                    var maxIndex = app.isArrayContain(heightWeight, max); 
                    console.log(heightArr[maxIndex], h);
                    if (heightArr[maxIndex] - h < 10)
                        app.server_list2[i]["clr"] = app.converRgbToArgb(0,parseInt(255*clr),255);  
                    else
                        app.server_list2[i]["clr"] = app.converRgbToArgb(parseInt(255*clr),0,0);  

                   // console.log(clr);
                   // app.server_list2[i]["clr"] = app.converRgbToArgb(parseInt(255*clr),0,0);  
                } 
                else
                    app.server_list2[i]["clr"] = app.converRgbToArgb(255, 255, 255);  
            }

            var t_name = document.getElementById("tableid"); 
            var trs=t_name.getElementsByTagName("tr");
            for(var i=0;i<trs.length;i++){   
                if (app.server_list2[i]["clr"] !== app.converRgbToArgb(255, 255, 255))           
                    trs[i].style.background = app.server_list2[i]["clr"]; 
            }

            //location.reload();
            return;


             $("table > tbody > tr").each(function () {
                 console.log($(this).find('td').eq(0).text() + " " + $(this).find('td').eq(1).text() );
             });
                         
             
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", app.server_list.length); 
                  
                //var t_len = t_name.getElementsByTagName("tr");
                console.log(t_name.tBodies.length); 
                console.log(t_name.children.length); 

                console.log(t_name.childNodes.length);
                //
    
                for(var i=0;i<= t_name.children.length;i++){      
                    if(t_name[i].tagName === "TBODY"){ 
                        var trs = t[i].getElementsByName("tr");
                        console.log(trs.length); 
                        for(var j=0;j<trs.length; j++){
                            //console.log(trs[j].outerHTML);
                        } 
                    }
                }    
              
        },
        getAllServer: function(){ 
             console.log("getAllServer");

             this.server_list = []; 
             this.server_list2 = [];  
             this.totalNum = -1;
             // inner web
             var ipServer = "192.168.101.";
             var nStart = 101;
             var nLen = 0;
             for (i=0; i < nLen; i++) { 
                var nCurStart = nStart + i;
                var strIpCur = ipServer + nCurStart.toString();
                this.getBlockData(i, strIpCur, 8888);  
             }              

             
             for (j = 0; j < this.webServer.length; j++) {  
                this.getBlockData(nLen+1+j, this.webServer[j], this.port[j]);  
             }    
             this.totalNum = this.webServer.length + nLen;

             console.log(this.webServer.length);
             console.log(this.totalNum);
        },
         
        isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            if(regPos.test(val)) {
                return true;
            } 
            else {
                return false;
            }
        },

        search_block(){  

            $("#id-button-right").attr("disabled", "disabled");
            app.strTxIDQuery = $("#id-input-text").val()

            console.log();

            var strUrl = "http://" + this.webServer[0] + ":8888/taf/taf_getInfo";
            $.ajax({   
                url: strUrl, 
                success:function(data1,status){     
                    app.nCurrBlock = data1.head_block_num - 20
                    app.nBeginBlock = app.nCurrBlock
                    console.log("query block", app.nCurrBlock);
                    //this.bFind = false
                    app.loopQuery();
                },
                error:function(data1,status){ 
                }
            }); 
        },

        loopQuery(){    
            // 计时器正在进行中，退出函数
            if (this.intervalBlock != null) {
                return;
            }
     
            this.intervalBlock = setInterval(() => {
                this.singleQuery(); 
            }, 500);

           /*     
            var i = 0;
            for (i = 0; i < 40; i++) { 
                if(this.bFind)
                    break;

                this.nCurrBlock = this.nCurrBlock + 1
                this.singleQuery();
                sleep(100);
            }
          
            do {
                text += "<br>数字为 " + i;
                i++; 
            } while (true);*/ 
        },
        format(str) { 
            var args = arguments;

            var pattern = new RegExp("%([1-" + arguments.length + "])", "g");

            return String(str).replace(pattern, function (match, index) { 
                return args[index]; 
            });
        },

        singleQuery(){  
            app.nCurrBlock = app.nCurrBlock + 1

            if(app.nCurrBlock > app.nBeginBlock + 40) {
                clearInterval(this.intervalBlock); //清除计时器
                this.intervalBlock = null; //设置为null
            }

            //var strRet = this.format("`{\"block_num_or_id\":%1}`", this.nCurrBlock.toString());
           // console.log(strRet); 

            

            let nHeight = app.nCurrBlock;
            console.log("single query block", app.nCurrBlock);

            var strUrl = "http://" + this.webServer[0] + ":8888/taf/taf_getBlock"; 
            $.ajax({
                  type: "POST",
                  url: strUrl,
                  data: JSON.stringify({ "block_num_or_id": this.nCurrBlock}),
                  success: function (data1) {
                    var txList = data1["transactions"];  
                    console.log(txList.length);
                    if (txList.length > 0) { 
                        var tx = txList[0];
                        var strID = tx["trx"]["id"];
                        if(strID === app.strTxIDQuery){ 
                            console.log(data1);  
                            alert(JSON.stringify(data1));

                            clearInterval(app.intervalBlock); //清除计时器
                            app.intervalBlock = null; //设置为null
                        }
                    }
                  },
                  dataType: "json"
            });
                
            /*
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
               if (xhr.readyState === 4) {
                  console.log(xhr.status);
                  console.log(xhr.responseText);
               }};

            var data = `{                
            }`;
            xhr.send(data);
            */
        }
    }
});
