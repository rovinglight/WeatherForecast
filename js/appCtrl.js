;
(function(){
    "use strict";

    var date = new Date();
    var month = date.getMonth()+1;
    var urlstr = "http://wthrcdn.etouch.cn/weather_mini?city=%E5%8C%97%E4%BA%AC";
    var locationPannel = document.getElementById("location");
    var cityPannel = document.getElementById("cityPannel");
    var closeTag = cityPannel.getElementsByTagName("i")[0];
    closeTag.addEventListener("click",closeCity);
    locationPannel.addEventListener("click",changeCity);


    loadXMLDoc(urlstr);



    //tools
    //收起城市变换面板
    function closeCity(e){
        locationPannel.className = "menu_closed menu";
        cityPannel.style.display = "none";
        e.stopPropagation()
    }
    //弹出城市变换面板
    function changeCity(){
        locationPannel.className = "menu_opened";
        setTimeout(function(){
            cityPannel.style.display = "block";
        },1000);

    }
    //获取天气数据并展现
    function loadXMLDoc(urlstr) {
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
                var forecast = obj.data.forecast;
                var datestr;
                var i;
                var card;
                var span;
                var detail;
                var wicon;
                var use;
                var temp;
                card = document.getElementsByClassName("sig");
                console.log(forecast);





                //将天气数据插入网页
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