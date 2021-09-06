var app = new Vue({
    el: '#app',
    data: {
        blockNumber: 0, 
        difficulty: 0,
        totalSize:0,
        time:0,
        nodeList: [],
        block_list: [],
        transaction_list: []
    },
    created () {
        this.getData();
    },
    methods:{ 
        getDate(time){ 
            var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();  
            var res = h + m + s;  
            return res;
        },
        getFullDate(time){ 
            var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();  
            var res = M + D;  
            return res;
        },

        formatDifficulty(diff){   
            if(diff < 1.0)
                return diff.toFixed(6);
            else {
                if(diff < 10.0 )
                    return diff.toFixed(5);
                if(diff < 100.0 )
                    return diff.toFixed(4);
                if(diff < 1000.0 )
                    return diff.toFixed(3);
                if(diff < 10000.0 )
                    return diff.toFixed(2);
                if(diff < 100000.0 )
                    return diff.toFixed(1);
                return diff.toFixed(0);
             }
             
        },
        formatTime(nTime){   
            console.log(app.$options.methods.getFullDate(nTime));
             var curTime = new Date(); 

             //console.log(curTime);
               console.log(nTime);

            var date = new Date(nTime * 1000);
             var nTimeSpan = parseInt(curTime - date);//两个时间相差的毫秒数
             if(nTimeSpan < 1000)
                return "刚刚";
             else if(nTimeSpan < 1000*60){
                var nVal = Math.floor(nTimeSpan/1000);
                return nVal.toString() + "秒前";
             }
             else if(nTimeSpan < 1000*60*60){
                var nVal = Math.floor(nTimeSpan/(1000*60));
                return nVal.toString() + "分钟前";
             }       
            else if(nTimeSpan < 1000*60*60*24){
                var nVal = Math.floor(nTimeSpan/(1000*60*60));
                return nVal.toString() + "小时前";
             }        
            else if(nTimeSpan < 1000*60*60*24*30){
                var nVal = Math.floor(nTimeSpan/(1000*60*60*24));
                return nVal.toString() + "天前";
             }                 
             console.log(nTimeSpan);
                 return nTimeSpan;
        },
        getData: function(){ 
             
             $.ajax({
                url:"../php/btcinfo.php?fun=11",

                //data是成功返回的json串
                success:function(data1,status){   
                    var obj = JSON.parse(data1);  
                    app.blockNumber = obj["blocks"];   
                    app.difficulty = app.$options.methods.formatDifficulty(obj["difficulty"]);                     

                    app.totalSize = obj["size_on_disk"]; 
                    var time = obj["mediantime"]; 
                    app.time = app.$options.methods.getDate(time); 
                    app.nodeList = obj["nodeList"]; 
                    app.block_list = obj["block_list"]; 

                    for (var i = 0; i < app.block_list.length; i++){
                        app.block_list[i].time = app.$options.methods.formatTime(app.block_list[i].time);
                    } 

                    app.transaction_list = obj["transaction_list"]; 
                    //document.write(app.block_list.length); 
                    //document.write(app.block_list.length);
                    var data_list1 = obj["recentTx_time"];
                    var count_list1 = obj["recentTx_count"];
                     

                    var data_list = new Array(data_list1.length);
                    var count_list = new Array(count_list1.length);

                    for (var i = 0; i < data_list1.length; i++){
                        data_list[i] = data_list1[i]["x"];
                        count_list[i] = count_list1[i]["y"];
                    }

                    option = {
                        title : {
                            text: '最近24小时交易量',
                            x: 'center',
                            align: 'right'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} {c}'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: data_list
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            name: '交易量：',
                            data: count_list,
                            type: 'line'
                        }]
                    };
                    var myChart = echarts.init(document.getElementById('homeId'));
                    myChart.setOption(option); 
                },
                error:function(data,status){
                    alert('失败');
                }
            }); 
        }
    }
});
