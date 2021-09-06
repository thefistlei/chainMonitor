var app = new Vue({
    el: '#app',
    data: {
        totalNum: 1,
        server_list: [],
        server_list2: [],
    },
    created () {
        console.log('1')
        this.getAllServer();
        
         this.server_list.sort((a,b)=>{
            return a.index - b.index
         });
         
    },
    methods:{
         getBlockData: function(index, ipServer){ 
            //console.log(ipServer)
            console.log("server" , ipServer)
            var strUrl = "http://" + ipServer + ":8888/taf/taf_getInfo"
                $.ajax({   
                    url: strUrl,
 
                    //data是成功返回的json串
                    success:function(data1,status){    
                       // console.log(data1) 
                        var data = {};                         
                        data["index"] = index
                        data["server"] = ipServer
                        data["blockheight"] = data1.head_block_num
                        data["peer_num"] = 0
                        data["blockMaker"] = data1.head_block_maker
                        data["blocktime"] = data1.head_block_time
                        data["blockhash"] = data1.head_block_id 
                        //console.log(data)    
                        app.server_list.push(data);     

                        //console.log(app.server_list.length)    
                        //app.setTextFlag(); 
                        app.showResult();                 
                    },
                    error:function(data1,status){
                        //alert(status);
                        var data = {};                   
                        data["index"] = index
                        data["server"] = ipServer
                        data["blockheight"] = "/"
                        data["peer_num"] = 0
                        data["blockMaker"] = "/"
                        data["blocktime"] = "/"
                        data["blockhash"] = "/"
                        app.server_list.push(data);  
                        app.showResult();                        
                    }
                });   
        },
    
        showResult: function(){  
            if(app.server_list.length === app.totalNum){
                app.server_list2 = app.server_list.sort();
            }
        },

        setTextFlag: function(){ 
             var t_name = document.getElementById("tableid");
             console.log(t_name); 

             var trs=t_name.getElementsByTagName("tr");
             for(var i=0;i<trs.length;i++){
                var j=i+1;
                if(j%2==0){
                    trs[i].style.background= "#aa0000";
                }else{
                    trs[i].style.background="yellow";
                }
            }
            return;


             $("table > tbody > tr").each(function () {
                 console.log($(this).find('td').eq(0).text() + " " + $(this).find('td').eq(1).text() );
             });
                         // inner web
             
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
  
     // 

                /*

                 for(var i=0; i< t_name.tBodies.length;  i++)  {
                    console.log(t_name.tBodies[i].tagName); 
                    var c = t_name.tBodies[i].children;
                    console.log(c.length);
                 }

                    for(var i=0;i<=t_len.length;i++){
                        //偶数行时执行
                        if(i%2 == 0){
                            t_len[i].style.backgroundColor="#ffcccc";
                         //添加鼠标经过事件
                            t_len[i].onmouseover = function(){
                                this.style.backgroundColor="#ccffff"
                            }
                            //添加鼠标离开事件
                            t_len[i].onmouseout = function(){
                                this.style.backgroundColor="#ffcccc"               
                            }
                        }
                        else{
                            t_len[i].style.backgroundColor="#ffffcc";
             
                            t_len[i].onmouseover = function(){
                                this.style.backgroundColor="#ccffff"
                            }
                            t_len[i].onmouseout = function(){
                                this.style.backgroundColor="#ffffcc"
                        }
                    }
                }
                */ 
              
        },
        getAllServer: function(){ 
             // inner web
             var ipServer = "192.168.101.";
             var nStart = 101;
             var nLen = 14;
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
             app.setTextFlag();  
        }
    }
});
