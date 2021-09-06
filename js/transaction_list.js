var app = new Vue({
    el: '#app',
    data: {
        page: 1,
        blockNumber: '',
        transactionHash: '',
        transaction_list: [],
        transaction_num: 0,
        page_num: 0,
        high_block_num: 0,
    },
    created () {
        this.get_transaction_list();
    },
    methods:{
        getTxData: function(nPage){
                $.ajax({  
                    url:"../php/btcinfo.php?fun=13&page=" + nPage,
 
                    //data是成功返回的json串
                    success:function(data1,status){   
                        //alert(data1);
                        var obj = JSON.parse(data1); 

                        app.transaction_num = obj["transaction_num"];
                        app.transaction_list = obj["transaction_list"];
                        app.page_num = Math.ceil(app.transaction_num/10);
       
                    },
                    error:function(data,status){
                        alert('失败');
                    }
                });   
        }, 
        get_transaction_list: function(){ 
             this.getTxData(this.page);  
        },
        change_page(page){
            this.page = page
            if(this.page > 1){
                $("#id-button-left").removeAttr("disabled");
            }else if(this.page == 1){
                $("#id-button-left").attr("disabled", "disabled");
            }
            console.log("页数" , this.page)
        },
        subtract_page(){
            this.page -= 1
            if(this.page > 1){
                $("#id-button-left").removeAttr("disabled");
            }else if(this.page == 1){
                $("#id-button-left").attr("disabled", "disabled");
            }
            if(this.page < this.page_num){
                $("#id-button-right").removeAttr("disabled");
            }
            
             app.$options.methods.getTxData(this.page);   
        },
        add_page(){
            this.page += 1
            // if(this.page > 1){
            //     $("#id-button-left").removeAttr("disabled");
            // }else if(this.page == 1){
            //     $("#id-button-left").attr("disabled", "disabled");
            // }
            if(this.page > 1){
                $("#id-button-left").removeAttr("disabled");
            }
            if(this.page == this.page_num){
                $("#id-button-right").attr("disabled", "disabled");
            }
            
             app.$options.methods.getTxData(this.page);  
        },
        isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            if(regPos.test(val)) {
                return true;
            } else {
                return false;
                }
            },
        search_tx(){ 
            $("#id-button-right").attr("disabled", "disabled");
            num_or_hash = $("#id-input-text").val()
             
            this.transactionHash = num_or_hash
            if (this.transactionHash.length != 64) {
                alert("输入正确的交易哈希")
            }
             else
             {  
                var hash = this.transactionHash;
                window.location.href="transaction_detail.html?transactionHash="+hash;  
                /*
                $.ajax({   
                    url:"../php/btcinfo.php?fun=9&txhash=" + hash,
 
                    //data是成功返回的json串
                    success:function(data1,status){   
                        alert(data1);  
                        var obj = JSON.parse(data1);  
                        alert(obj); 
                    },
                    error:function(data,status){
                        alert('失败');
                    }
                });
                */     
            }  
        }
    }
});
