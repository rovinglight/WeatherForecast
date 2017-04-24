;
(function(){
    "use strict";
    /*--------cardArr-------------*/
    var cardArr = [new Card("singleDay"),new Card("singleDay"),new Card("singleDay"),new Card("singleDay"),new Card("singleDay")];
    cardArr.render = function(){
        var singleDay_count = 0;
        var content = document.getElementsByClassName("content")[0];
        content.innerHTML = "";
        //遍历cardArr进行渲染 对ingleDay_count进行++处理
        for(var i = 0; i<cardArr.length; i++){
            var cardNode = null;

            if(cardArr[i].type == "singleDay"){
                cardNode = cardArr[i].render(singleDay_count);
                singleDay_count++;
            }
            content.appendChild(cardNode);
        }
    };
    /*--------cardArr-------------*/

    /*----------city pannel------------------*/
    //城市切换面板对象
    var cityPannel = (function(){
        var cityPannel = document.getElementById("cityPannel");
        var citySelector = document.getElementById("citySelector");
        var locationPannel = document.getElementById("location");
        var closeTag = cityPannel.getElementsByTagName("i")[0];
        //更换城市
        function changeCity(){
            var city = citySelector.value;
            var status = dataFetcher.updateData(city,function(){
                closeCity();
                locationPannel.firstElementChild.innerHTML = city;
            });
        }
        //收起城市变换面板
        function closeCity(){
            locationPannel.className = "menu_closed menu";
            cityPannel.style.display = "none";
            locationPannel.children[0].style.display = "inline";
            setTimeout(function(){
                locationPannel.addEventListener("click",openCity);
            },1500)
        }
        //弹出城市变换面板
        function openCity(){
            locationPannel.className = "menu_opened";
            locationPannel.children[0].style.display = "none";
            setTimeout(function(){
                cityPannel.style.display = "block";
            },700);
            locationPannel.removeEventListener("click",openCity);
        }
        return{
            init:function () {
                //切换城市按钮点击
                citySelector.nextElementSibling.addEventListener("click",changeCity);
                //关闭城市选择面板
                closeTag.addEventListener("click",closeCity);
                //打开城市选择面板
                locationPannel.addEventListener("click",openCity);
                //城市选择输入框初始值
                citySelector.value = "北京";
            }
        }
    })();
    /*----------city pannel------------------*/

    /*------------data fetcher------------*/
    //数据获取对象
    function DataFetcher() {
        var urlstr = "//wthrcdn.etouch.cn/weather_mini?city=";
        var self = this;

        this.weatherData = {}; //store the latest weather data after every request

        this.updateData = function(city,callback){
            function weatherRender(){
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    self.weatherData = JSON.parse(xmlhttp.responseText);
                    console.log(self.weatherData);
                    //判断所输城市是否合法
                    if(self.weatherData.desc != "OK"){
                        alert("请输入正确的城市");
                        return;
                    }

                    //遍历全局卡片数组进行渲染
                    cardArr.render();
                    callback();

                }
            }
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var xmlhttp;
            xmlhttp.onreadystatechange = weatherRender;
            xmlhttp.open("GET", urlstr+city, true);
            xmlhttp.send();
        }
    }
    /*------------data fetcher------------*/

    /*------------card class--------------*/
    //卡片模版
    function Card(type){
        this.type = type;
        var htmlNode = {};
        function iconSwitcher(str){
            switch(str) {
                case "晴":
                    return "icon-sun";
                case "阴":
                    return "icon-icon-test";
                case "多云":
                    return "icon-icon-test1";
                case "小雪":
                    return "icon-icon-test9";
                case "阵雨":
                    return "icon-icon-test5";
                case "小雨":
                    return "icon-icon-test3";
                case "雨夹雪":
                    return "icon-icon-test11";
                case "阵雪":
                    return "icon-icon-test10";
                case "中雪":
                    return "icon-icon-test10";
                case "中雨":
                    return "icon-icon-test2";
                case "大雨":
                    return "icon-icon-test4";
            };
        }
        function numSwitcher(num){
            var numArr = new Array();
            var j = 0;
            var frag = document.createDocumentFragment();
            var numNode;
            if(num<0){
                numNode = document.createElement("i");
                numNode.className = "iconfont font-45 icon-minus1";
                frag.appendChild(numNode);
                num = -num;
            }
            if(num == 0){
                numArr[0] = 0;
            }
            while(num >= 1){
                numArr[j] =parseInt(num % 10) ;
                num=num/10;
                j++;
            }
            numArr.reverse();
            for(j = 0; j < numArr.length; j++){
                numNode = document.createElement("i");
                numNode.className = "iconfont font-45 icon-" + numArr[j].toString();
                frag.appendChild(numNode);
            }
            return frag;
        }
        this.render = function(count){
            var span = null;
            var datestr = null;
            var detail = null;
            var forecast = dataFetcher.weatherData.data.forecast;
            var i = count;
            var wsvg = null;
            var useTag = null;
            var temp = null;
            var date = new Date();
            var month = date.getMonth()+1;
            switch (this.type){
                case "singleDay":{
                    htmlNode = document.createElement("div");
                    htmlNode.setAttribute("class", "today card");
                    htmlNode.innerHTML = document.getElementById("temp_singleDay").innerHTML;

                    span = htmlNode.getElementsByTagName("span");
                    datestr = month+"月"+forecast[i].date;
                    detail = forecast[i]["type"] + "，" + forecast[i].fengli+forecast[i].fengxiang;
                    span[0].innerHTML = datestr;
                    span[1].innerHTML = detail ;
                    //天气图标设置
                    wsvg = htmlNode.getElementsByTagName("svg")[0];
                    useTag = wsvg.children[0];
                    var str = "#" + iconSwitcher(forecast[i]["type"]);
                    useTag.setAttribute("xlink:href",str);
                    //高低温
                    str = forecast[i]["high"];
                    temp = str.split(" ")[1];
                    str = parseInt(temp.substring(0,temp.length-1));
                    span[2].innerHTML = "";
                    span[2].appendChild(numSwitcher(str));
                    str = forecast[i]["low"];
                    temp = str.split(" ")[1];
                    str = parseInt(temp.substring(0,temp.length-1));
                    span[3].innerHTML = "";
                    span[3].appendChild(numSwitcher(str));
                    return htmlNode;
                }
            }
        }
    }
    /*------------card class--------------*/

    //暴露对象：dataFetcher(数据获取)、cardArr(卡片对象数组)、cityPannel(事件绑定)
    /*-----------init-----------------*/
    var dataFetcher = new DataFetcher();
    dataFetcher.updateData("%E5%8C%97%E4%BA%AC", function(){});
    cityPannel.init();
    /*-----------init-----------------*/

})();