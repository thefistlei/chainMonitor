var app = new Vue({
    el: '#app',
    data: {
        totalNum: 1,
        intervalData:null,    // 定时器
        intervalUI:null,    // 定时器
        server_list: [],
        server_list2: [],
    },
    created () {
        console.log('1')
        this.getAllServer();
         
        // 计时器正在进行中，退出函数
        if (this.intervalData != null) {
            return;
        }
 
        this.intervalData = setInterval(() => {
            this.getAllServer(); 
        }, 1000*90);
    },
    destroyed() {
         //页面关闭时清空
         this.clear();
    },
    methods:{
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

         getBlockData: function(index, ipServer){ 
            //console.log(ipServer)
            //console.log("server" , ipServer)
            var strUrl = "http://" + ipServer + ":8888/taf/taf_getInfo"
                $.ajax({   
                    url: strUrl,
 
                    //data是成功返回的json串
                    success:function(data1,status){  

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
                        }

                       // console.log(data1) 
                        var data = {};    
                        data["clr"] = app.converRgbToArgb(255, 255, 255);                                
                        data["index"] = index
                        data["server"] = ipServer
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
            var max = app.getArrayMax(heightWeight);


            var nClr = heightArr.length;
            //console.log(nClr);
            for(var i=0;i < app.server_list2.length;i++){ 
                var h = app.server_list2[i].blockheight;
                var index = app.isArrayContain(heightArr, h);
                
                if(max !== heightWeight[index]){          
                     var clr = (nClr - index)*1.0/nClr; 
                     // console.log(clr);
                    app.server_list2[i]["clr"] = app.converRgbToArgb(parseInt(255*clr),0,0);  
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
             this.server_list = []; 
             this.server_list2 = [];  
             this.totalNum = -1;
             // inner web
             var ipServer = "192.168.101.";
             var nStart = 101;
             var nLen = 140;
             for (i=0; i < nLen; i++) { 
                var nCurStart = nStart + i;
                var strIpCur = ipServer + nCurStart.toString();
                this.getBlockData(i, strIpCur);  
             }              

             var webServer = new Array(
                /*"18.176.224.246",
                "18.183.203.208", 
                "35.74.253.51", 
                "3.112.63.128", 
                "18.180.54.99", 
                "18.180.156.94", 
                "13.230.34.236", 
                "18.181.233.85", 
                "35.76.107.8",
                "3.115.1.53",*/
                "35.72.35.95",
                "35.74.78.197" 
             );
             for (j = 0; j < webServer.length; j++) {  
                this.getBlockData(nLen+1+j, webServer[j]);  
             }    
             this.totalNum = webServer.length + nLen;

            //    console.log(this.totalNum);
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
        }
    }
});
