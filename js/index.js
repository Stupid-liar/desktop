//js 背景部分（canvas）
(function () {
    var w = window.innerWidth,
        h = window.innerHeight,
        oCan = document.getElementById("canvas"),
        ctx = oCan.getContext("2d");
    oCan.width = w;
    oCan.height = h;

    window.onresize = function () {
        w = window.innerWidth;
        h = window.innerHeight;
        oCan.width = w;
        oCan.height = h;
        for(var i=0;i<num;i++){//存储星星的位置半径
            var x = Math.random()*w,
                y = Math.random()*h,
                rx = Math.random();//星星半径
            array[i] = {
                x: x,y:y,r:rx
            };
        }

    };
    var num = 200,//星星的数量
        array = [],//存储星星的位置
        k = 0.5,//流星的斜率
        flag = true,//判断流星方向
        speed = 20,//流星速度
        xs = 800,
        ys = 100,//流星初始位置
        r = 3;//流星初始半径

    setInterval(change,3000);//3秒一个流星并随机样式
    function change() {
        xs = Math.random()*w;//流星初始位置
        ys = Math.random()*h-h/2;
        r = Math.random()*3;
        speed = Math.random()*20;
        k = (Math.random()*2-1)*0.8;
        k>0?flag = true:flag = false;//true表示斜率大于零
    }//改变流行位置,半径，速度等
    for(var i=0;i<num;i++){//存储星星的位置半径
        var x = Math.random()*w,
            y = Math.random()*h,
            rx = Math.random();//星星半径
        array[i] = {
            x: x,y:y,r:rx
        };
    }
    !function draw() {//画星星一闪一闪
        ctx.clearRect(0,0,w,h);
        for(var i=0;i<num;i++){
            yuan(array[i].x,array[i].y,array[i].r);
            array[i].r += Math.random()*0.5-0.25;
            array[i].r = Math.max(array[i].r,0);
            array[i].r = Math.min(array[i].r,1);
        }
        hua(r);
        requestAnimationFrame(draw)//画流星
    }();

    function yuan(x,y,r) {
        ctx.save();
        var rad = ctx.createRadialGradient(x,y,0,x,y,5);
        rad.addColorStop(0,'rgba(255,255,255,1)');
        rad.addColorStop(0.5,'rgba(255,255,255,0.5)');
        rad.addColorStop(1,'rgba(255,255,255,0.1)');
        ctx.fillStyle = rad;
        ctx.moveTo(x,y);
        ctx.beginPath();
        ctx.arc(x,y,r*2,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }//画星星

    function hua(r) {
        ctx.save();
        var rad = ctx.createRadialGradient(x,y,0,x,y,5);
        rad.addColorStop(0,'rgba(255,255,255,1)');
        rad.addColorStop(0.5,'rgba(255,255,255,0.8)');
        rad.addColorStop(1,'rgba(255,255,255,0.5)');
        ctx.fillStyle = rad;
        var xw = xs;
        var yw = ys;
        ctx.moveTo(xw,yw);
        for(var i=0;i<speed*10;i++){
            ctx.beginPath();
            ctx.arc(xw,yw,r,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
            if(flag){
                xw += 1;
                yw = -k+yw;
            }else {
                xw -= 1;
                yw = k+yw;
            }
            r -= r*0.3/(speed);//流星的半径随机增加
            r = Math.max(r,0);
        }
        ctx.restore();
        if(flag){
            xs -= speed;
            ys = k*speed+ys;
        }else {
            xs += speed;
            ys = -k*speed+ys;
        }
    }//画流星
})();

//jq内容
$(function () {
    var $li = $("#main").find("ul li"),
        liW = $li.outerWidth(),
        liH = $li.outerHeight(),
        windowH = $(window).height(),
        windowW = $(window).width(),
        num = 7,
        h_ = Math.max((windowH - liH*num)/(num+1),0),
        num_y = Math.floor(windowW/(h_+liW)),
        listW = 150,//存放右键菜单的宽高
        listH = 150,
        $listBody = $("#listBody"),
        $detail = $("#detail"),
        $close = $("#close");

    $close.click(function () {
        $detail.hide();
    });
    //初始化执行
    init();

    //解除浏览器默认鼠标右键功能

    $(document).contextmenu(function () {
        //window.event.returnValue = false;//这一句不加在火狐中不生效
        return false;
    });
    /*
    谨慎用会有问题
    $("body,html").bind("contextmenu", function(){
        return false;
    });
    */

    //窗口改变
    $(window).resize(function () {
        windowH = $(window).height();
        windowW = $(window).width();
        num_y = Math.floor(windowW/(h_+liW));
        h_ = Math.max((windowH - liH*num)/(num+1),0);
        $li.each(function (i) {
            $(this).css({
                left: this.x*(liW + h_) + h_/2 + "px",
                top: this.y*(liH + h_) + h_/2 + "px"
            })
        });
    });

    //初始化
    function init() {
        $li.each(function (i) {
            this.x = Math.floor(i/num);
            this.y = i%num;
            $(this).css({
                left: this.x * (liW + h_) + h_/2 + "px",
                top: this.y * (liH + h_) + h_/2 + "px"
            });
        });
    }

    //构造原型数组删除指定元素（参考）
    /*Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };*/


    //li的拖拽
    $li.each(function (i) {
        $(this).mousedown(function (e) {
            e.stopPropagation();
            if(3 === e.which){
                //li右键还没想好
            }else {
                var This = [];
                if($(this).hasClass("select")){
                    $li.each(function (j) {
                        if($(this).hasClass("select")){
                            This.push(this);
                        }
                    })
                }else {
                    $li.each(function () {
                        $(this).removeClass("select");
                    });
                    This[0] = this;
                }
                this.ifMove = false;
                var xS = e.clientX,
                    yS = e.clientY;//初始位置
                var left = [],top = [];//存放选中li的初始left和top
                var sX = [],sY = [];//存放选中li的初始宽和高
                for(var k = 0;k<This.length; k++){
                    left[k] = $(This[k]).offset().left;
                    top[k] = $(This[k]).offset().top;//初始宽高

                    sX[k] = This[k].x;
                    sY[k] = This[k].y;//点击初始坐标
                }

                $(document).mousemove(function (e) {
                    //判断是否拖动来控制点击事件
                    $(This[i]).mousemove(function () {
                        This[i].ifMove = true;
                    });

                    var x_ = e.clientX - xS,
                        y_ = e.clientY - yS;//变化量

                    for(var k = 0;k<This.length; k++){
                        $(This[k]).css({
                            left: left[k] + x_ +"px",
                            top: top[k] + y_ + "px"
                        });

                        //控制四个方向不出界
                        //This[k].x = Math.max(Math.round((left[k] + x_-h_/2)/(liW + h_)),0);
                        //This[k].x = Math.min(This[k].x,num_y-1);
                        //This[k].y = Math.max(Math.round((top[k] + y_-h_/2)/(liH + h_)),0);
                        //This[k].y = Math.min(This[k].y,num-1);
                        This[k].x = Math.round((left[k] + x_-h_/2)/(liW + h_));
                        This[k].y = Math.round((top[k] + y_-h_/2)/(liH + h_));
                    }


                });
                $(document).mouseup(function () {
                    var sibling = [];
                    if(This.ifMove) {
                        //还没想好如何共存问题，这里暂时用双击代替
                    }
                    //判断是否于兄弟元素冲突
                    $li.each(function () {
                        if(!$(this).hasClass("select")){
                            sibling.push(this);
                        }
                    });
                    //只选择一个的问题
                    if(This.length === 1){
                        //sibling.remove(This[0]);使用构造原型函数
                        var index = sibling.indexOf(This[0]);
                        if (index > -1) {
                            sibling.splice(index, 1);
                        }
                    }
                    //全选的问题(特殊情况)
                    if(sibling.length === 0){
                        for(var j = 0;j<This.length;j++){
                            if(This[j].y<0 || This[j].x<0 || This[j].y >num-1||This[j].x>num_y-1){
                                for(k = 0;k<This.length;k++){
                                    This[k].x = sX[k];
                                    This[k].y = sY[k];
                                }
                            }
                        }
                    }else {
                        for(var i = 0;i<sibling.length;i++){
                            for(j = 0;j<This.length;j++){
                                if(This[j].x === sibling[i].x && This[j].y === sibling[i].y || This[j].y<0 || This[j].x<0 || This[j].y >num-1||This[j].x>num_y-1){
                                    for(k = 0;k<This.length;k++){
                                        This[k].x = sX[k];
                                        This[k].y = sY[k];
                                    }
                                }
                            }
                        }
                    }

                    for(var k = 0;k<This.length; k++) {
                        $(This[k]).css({
                            left: This[k].x * (liW + h_) + h_ / 2 + "px",
                            top: This[k].y * (liH + h_) + h_ / 2 + "px"
                        });
                    }
                    $(document).off("mousemove");
                    $(document).off("mouseup");
                })
            }
        })
    })

    $listBody.click(function (e) {
        $(this).hide();
        e.stopPropagation();
        var target = e.target;
        var index = $(target).index();
        switch (index){
            case 0://刷新
                window.location.reload();
                break;
            case 1://查看
                break;
            case 2://个性化
                $detail.show();
                break;
            case 3://设置
                break;
            case 4://收藏
                break;
            case 5://新建
                break;
            default:
                return;
        }

    });
    //双击
    $li.each(function () {
        $(this).dblclick(function () {
            if(/http/.test($(this).attr('data_src'))){
                window.open(""+$(this).attr('data_src')+"","_blank");
            }
            window.open(""+$(this).attr('data_src')+"/index.html","_blank");
        })
    });

    //判断是否出界
    function initListCss( $list,e) {
        var xS = e.clientX,
            yS = e.clientY;
        $list.css({
            width: ""+listW+"px",
            height: ""+listH+"px"
        });
        if((xS + listW) < windowW && (yS + listH) < windowH){
            $list.css({
                top: ""+yS+"px",
                left: ""+xS+"px"
            })
        }else if( (xS + listW) > windowW && (yS + listH) < windowH){
            $list.css({
                top: ""+yS+"px",
                left: ""+(xS - listW)+"px"
            })
        }else if((xS + listW) > windowW && (yS + listH) > windowH){
            $list.css({
                top: ""+ (yS-listH) +"px",
                left: ""+ (xS - listW) +"px"
            })
        }else if((xS + listW) < windowW && (yS + listH) > windowH){
            $list.css({
                top: ""+ (yS-listH) +"px",
                left: ""+ xS  +"px"
            })
        }
    }

    //click和mousedown也不样使用需要注意事件冒泡问题
    $(document).click(function (e) {
        if(e.witch === 3 || 2 === e.button)return
        $listBody.hide();
    });

    //选中拖拽和鼠标右键
    $(document).mousedown(function (e) {
        var xS = e.clientX,
            yS = e.clientY,
            $div;
        if(3 === e.which || 2 === e.button){//判断鼠标右键
            $(document).mouseup(function (e) {
                initListCss($listBody,e);
                $listBody.show();
                $(document).off("mouseup");
            })
        }else {
            $li.each(function () {
                $(this).removeClass("select");
            });
            $div = $("<div id='select'></div>");
            $('body').append($div);
            //document.body.appendChild(div);
            $(document).mousemove(function (e) {
                var x_ = e.clientX - xS,
                    y_ = e.clientY - yS;

                $div.css({
                    position: 'absolute',
                    border: '1px dashed #fff',
                    width: Math.abs(x_),
                    height: Math.abs(y_),
                    background: "rgba(255,255,255,0.1)"
                });
                //判断选择框的移动方向
                if(x_ < 0 && y_<= 0){
                    $div.css({
                        left: xS + x_,
                        top: yS + y_
                    });
                }else if(x_<0&&y_>=0){
                    $div.css({
                        left: xS + x_,
                        top: yS
                    });
                }else if(x_>=0&&y_<0){
                    $div.css({
                        left: xS,
                        top: yS + y_
                    });
                }else {
                    $div.css({
                        left: xS,
                        top: yS
                    });
                }
                //$li.prop("class","select");
                //$li.addClass("select");
                $li.each(function () {
                    if(pz( $(this) , $div)){
                        $(this).addClass("select");
                    }else {
                        $(this).removeClass("select");
                    }
                })
            });
        }
        $(document).mouseup(function () {
            $(document).off("mousemove");
            $(document).off("mouseup");
            $div && $div.remove();
        })
    });

    //碰撞检测
    function pz( $obj1, $obj2 ) {
        var oL1 = $obj1.offset().left,
            oT1 = $obj1.offset().top,
            oR1 = $obj1.offset().left + $obj1.outerWidth(),
            oB1 = $obj1.offset().top + $obj1.outerHeight();

        var oL2 = $obj2.offset().left,
            oT2 = $obj2.offset().top,
            oR2 = $obj2.offset().left + $obj2.outerWidth(),
            oB2 = $obj2.offset().top + $obj2.outerHeight();
        if(oL1>oR2 || oT1>oB2 || oR1<oL2 || oB1<oT2) {
            return false;
        }else {
            return true;
        }
    }

    //更换背景颜色

    $detail.find(".body span").click(function (e) {
        e.stopPropagation();
        var index = $(this).index();
        changeColor(index);
    });
    function changeColor(index) {
        var colorJson = ["red","yellow","black"];
        $("body,html").css({
            background: ""+colorJson[index-1]+""
        })
    }
});