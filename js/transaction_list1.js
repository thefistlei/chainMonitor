var app = new Vue({
    el: '#app',
    data: {
        page: 0,
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
            
             this.getTxData(this.page);  
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
            
            this.getTxData(this.page);  
        },
        isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            if(regPos.test(val)) {
                return true;
            } else {
                return false;
                }
            },
        search_block(){
            $("#id-button-right").attr("disabled", "disabled");
            num_or_hash = $("#id-input-text").val()
            a = this.isNumber(num_or_hash)
            if(a){
                this.blockNumber = num_or_hash
                console.log(this.blockNumber, this.high_block_num)
                if(this.blockNumber < 0 || this.blockNumber > this.high_block_num){
                    alert("输入正确的块高或哈希")
                }else {
                    console.log(num_or_hash, "number")
                    axios({
                        method: 'get',
                        url: "/query_info/transaction_list?blockNumber=" + this.blockNumber,
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'encoding': 'UTF-8',
                        },
                    })
                        .then((response) => {
                            this.transaction_num = response.data["transaction_num"]
                            this.transaction_list = response.data["transaction_list"]
                            this.page_num = Math.ceil(this.transaction_num/10)
                            console.log(typeof this.block_num, this.block_num, this.page_num)

                        })
                        .catch(function (error) {
                            console.log(error)
                        });
                }
            }else {
                this.transactionHash = num_or_hash
                if (this.transactionHash.length != 66) {
                    alert("输入正确的块高或哈希")
                } else {
                    axios({
                        method: 'get',
                        url: "/query_info/transaction_list?transactionHash=" + this.transactionHash,
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'encoding': 'UTF-8',
                        },
                    })
                        .then((response) => {
                            this.transaction_num = response.data["transaction_num"]
                            this.transaction_list = response.data["transaction_list"]
                            this.page_num = Math.ceil(this.transaction_num/10)
                            console.log(typeof this.block_num, this.block_num, this.page_num)

                        })
                        .catch(function (error) {
                            console.log(error)
                        });
                    console.log(num_or_hash, "hash")
                }
            }
        }
    }
});
