(function () {
    oUl = document.getElementById("con");

    //样式初始化
    !function () {
        var length = 5*5*5;

        for(var i = 0;i<length;i++){
            var aLi = document.createElement("li"),
                x = Math.random()*4000-2000,
                y = Math.random()*4000-2000,
                z = Math.random()*4000-2000;

            aLi.x = i%5;
            aLi.y = Math.floor(i/5%5);
            aLi.z = Math.floor(i/5/5);

            oUl.appendChild(aLi);
            aLi.style.transform = "translate3D("+x+"px,"+y+"px,"+z+"px)";
            var d = dongData[i] || "";
            var con = d.title ||"",
                type = d.type || "",
                time = d.time || "";
            aLi.innerHTML = ""+type+"</br>"+con+"</br>"+time+"";
            aLi.index = i;
        }
        setTimeout(Table,200);
    }();

    //布局方式
    function Gird() {
        var length = 5*5*5,
            x_ = 300,
            y_ = 200,
            z_ = 400;
        var aLi = oUl.getElementsByTagName("li");
        for(var i = 0;i<length;i++){
            aLi[i].x = i%5;
            aLi[i].y = Math.floor(i/5%5);
            aLi[i].z = Math.floor(i/5/5);
            var x = (aLi[i].x - 2)*x_,
                y = (aLi[i].y - 2)*y_,
                z = (aLi[i].z - 2)*z_;
            aLi[i].style.transform = "translate3D("+x+"px,"+y+"px,"+z+"px)";
        }
    }
    function Helix() {
        var length = 5*5*5;
        var aLi = oUl.getElementsByTagName("li");
        var deg = 360/length*4,
            z = 800,
            tY = 7,
            mid = length/2 - 0.5;
        for(var i = 0;i<length;i++){
            aLi[i].style.transform = "rotateY("+i*deg+"deg) translate3D(0px,"+(i-mid)*tY+"px,"+z+"px) ";
            // aLi[i].style.transform = "rotateY("+i*deg+"deg) translateY("+(i-mid)*tY+"px) translateZ("+z+"px)";//这里值得注意的地方时顺序
        }
    }
    function Ball() {
        var length = 5*5*5;
        var aLi = oUl.getElementsByTagName("li");
        var arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1],
            arrLength = arr.length,
            xDeg = 180 / (arrLength-1);

        for (var i = 0; i < length; i++) {

            //求出当前 i 处于arr的第几层 第几个
            var numC = 0 , numG = 0;
            var arrSum = 0;
            for (var j = 0; j < arrLength; j++) {
                arrSum += arr[j];
                if ( arrSum > i ){
                    numC = j;
                    numG = arr[j] - (arrSum - i);
                    break;
                }
            }
            var yDeg = 360 / arr[numC];
            aLi[i].style.transform = "rotateY("+(numG+1.3)*yDeg+"deg) rotateX("+(90-numC*xDeg)+"deg) translateZ(800px)";
        }
    }
    function Table() {
        var length = 5*5*5;
        var aLi = oUl.getElementsByTagName("li");
        var n = Math.ceil(length / 18) + 2;
        var midY = n / 2 - 0.5;
        var midX = 18 / 2 - 0.5;
        var disX = 170;
        var disY = 210;

        var arr = [
            {x : 0, y : 0},
            {x : 17, y : 0},
            {x : 0, y : 1},
            {x : 1, y : 1},
            {x : 12, y : 1},
            {x : 13, y : 1},
            {x : 14, y : 1},
            {x : 15, y : 1},
            {x : 16, y : 1},
            {x : 17, y : 1},
            {x : 0, y : 2},
            {x : 1, y : 2},
            {x : 12, y : 2},
            {x : 13, y : 2},
            {x : 14, y : 2},
            {x : 15, y : 2},
            {x : 16, y : 2},
            {x : 17, y : 2}
        ];

        for (var i = 0; i < length; i++) {
            var x,y;
            if ( i < 18 ){
                x = arr[i].x;
                y = arr[i].y;
            }else{
                x = i%18;
                y = Math.floor(i/18)+2;
            }
            aLi[i].style.transform = "translate3D("+(x-midX)*disX+"px,"+(y-midY)*disY+"px,0px)";
        }
    }

    //拖拽和缩放
    (function () {
        var roX = 0,
            roY = 0,
            trZ = -1900,
            timer1 = null,
            ifMove = false;
        document.onselectstart = function () {
            return false;
        };
        document.ondrag = function () {
            return false;
        };
        document.onmousedown = function (e) {
            ifMove = false;
            var xS = e.clientX,
                yS = e.clientY,
                x_ = 0,
                y_ = 0,
                lastX = xS,
                lastY = yS;
            cancelAnimationFrame(timer1);
            document.onmousemove = function (e) {
                oUl.onmousemove = function () {
                    ifMove = true;
                };
                x_ = e.clientX - lastX;
                y_ = e.clientY - lastY;

                roY += x_*0.15;
                roX -= y_*0.15;

                oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";

                lastX = e.clientX;
                lastY = e.clientY;
            };

            document.onmouseup = function () {
                if(ifMove){
                    //还没想好，已经判断了是否移动
                }
                document.onmousemove = null;
                //惯性
                function m() {
                    x_*= 0.9;
                    y_*= 0.9;

                    roY += x_*0.15;
                    roX -= y_*0.15;
                    oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
                    if ( Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1 )return;
                    timer1 = requestAnimationFrame(m);
                }
                timer1 = requestAnimationFrame(m);
            };
        };
        !function ( fn ) {
            if ( document.onmousewheel === undefined ){
                document.addEventListener("DOMMouseScroll" , function (e) {
                    var d = -e.detail/3;
                    fn.call(this , d);
                },false);
            }else{
                document.onmousewheel = function (e) {
                    var d = e.wheelDelta / 120;
                    fn.call(this , d);
                }
            }
        }(function (d) {
            trZ += d*100;
            oUl.style.transform = "translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
        });
    })();
    //btn选项
    !function () {
        var oBtn = document.getElementById("btn"),
            aLi = oBtn.getElementsByTagName("li"),
            last = aLi[0],
            arr = [Table,Helix,Ball,Gird];
        var oDec = document.getElementById("dec");
        for(var i = 0;i<4;i++){
            aLi[i].addEventListener("click",function (e) {
                e.cancelBubble = true;
                last.className = "";
                this.className = "on";
                last = this;
            },false);
            aLi[i].onclick = arr[i];
        }
        var ifClick = true;//判断是否点击li
        var time = new Date();
        oUl.onclick = function (e) {
            e.cancelBubble = true;
            var nowTime = new Date();
            if(nowTime - time > 1000){//设置最小点击间隔时间
                var target = e.target;
                var d = dongData[target.index]||"";
                var oEx = document.getElementById("example");
                if(ifClick){
                    oDec.style.display = "block";
                    setTimeout(function () {
                        oDec.style.transform = " translateZ(0) rotateY(360deg)";
                        oDec.style.opacity = "1";
                        var title = d.title||"";
                        var author = d.author||"",
                            dec = d.dec||"";
                        oDec.getElementsByClassName("title")[0].getElementsByTagName("span")[0].innerHTML = ""+title+"";
                        oDec.getElementsByClassName("author")[0].getElementsByTagName("span")[0].innerHTML = ""+author+"";
                        oDec.getElementsByClassName("dec")[0].getElementsByTagName("span")[0].innerHTML = ""+dec+"";
                        oDec.getElementsByClassName("img")[0].getElementsByTagName("img")[0].src = "src/"+d.con+"/index.jpg";
                        oEx.src = "src/"+d.con+"/index.html";
                    },200);
                    ifClick = false;
                }
            }
            time = nowTime;
        };
        document.onclick = function () {
            if(!ifClick){
                oDec.style.transform = " translateZ(-2000px) rotateY(0deg)";
                oDec.style.opacity = "0";
                setTimeout(function () {
                    oDec.style.display = "none";
                },300);
                ifClick = true;
            }
        };
        var oAll = document.getElementById("all");
        oDec.onclick = function (e) {
            this.style.transform = " translateZ(-2000px) rotateY(0deg)";
            this.style.opacity = "0";
            var This = this;
            setTimeout(function () {
                This.style.display = "none";
            },300);
            ifClick = true;
            e.cancelBubble = true;
            oAll.style.marginLeft = "-100%";
        };
        var back = document.getElementById("back");
        back.onclick = function (e) {
            e.cancelBubble = true;
            oAll.style.marginLeft = "0";
        }
    }()
})();