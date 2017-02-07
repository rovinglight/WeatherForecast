;
(function(){
    "use strict";

    var date = new Date();
    var month = date.getMonth()+1;
    var urlstr = "//wthrcdn.etouch.cn/weather_mini?city=";
    var locationPannel = document.getElementById("location");
    var cityPannel = document.getElementById("cityPannel");
    var closeTag = cityPannel.getElementsByTagName("i")[0];
    var citySelector = document.getElementById("citySelector");


    //初始化
    loadXMLDoc(urlstr + "%E5%8C%97%E4%BA%AC",function () {});
    citySelector.value = "北京";
    //事件

    //切换城市按钮点击
    citySelector.nextElementSibling.addEventListener("click",changeCity);
    //关闭城市选择面板
    closeTag.addEventListener("click",closeCity);
    //打开城市选择面板
    locationPannel.addEventListener("click",openCity);

    //tools

    //更换城市
    function changeCity(){
        var city = citySelector.value;
        var status = loadXMLDoc(urlstr + city,function(){
            closeCity();
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
        },1000);
        locationPannel.removeEventListener("click",openCity);
    }
    //获取天气数据并展现
    function loadXMLDoc(urlstr,callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = weatherFetcher;
        xmlhttp.open("GET", urlstr, true);
        xmlhttp.send();

        function weatherFetcher(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                var status = obj.desc;
                var city = citySelector.value;
                var datestr;
                var i;
                var card;
                var span;
                var detail;
                var wicon;
                var use;
                var temp;
                card = document.getElementsByClassName("sig");
                console.log(status);

                //判断城市是否正确
                if(status != "OK"){
                    alert("请输入正确的城市");
                    return "fuckedUp";
                }
                //获取天气数据
                var forecast = obj.data.forecast;
                console.log(forecast);

                //将天气数据插入网页
                locationPannel.firstElementChild.innerHTML = city;
                for(i = 0; i < forecast.length; i++){
                    //文字描述部分
                    span = card[i].getElementsByTagName("span");
                    datestr = month+"月"+forecast[i].date;
                    detail = forecast[i]["type"] + "，" + forecast[i].fengli+forecast[i].fengxiang;
                    span[0].innerHTML = datestr;
                    span[1].innerHTML = detail ;
                    //天气图标设置
                    wicon = card[i].getElementsByTagName("svg")[0];
                    use = wicon.children[0];
                    var str = "#" + iconSwitcher(forecast[i]["type"]);
                    use.setAttribute("href",str);
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
                }

                //插入网页结束
            }
        }
        callback();
    }
    //天气字符串转至对应编码
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
        };

    }
    //通过传入数字来生成对应的数字icon节点
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
        while(num > 1){
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


})();