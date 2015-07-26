/**
 * Created by Administrator on 2015/7/23.
 */
var chart = {
    /*初始化*/
    init : function () {
        var node = document.getElementsByTagName("div"),
            len = node.length;
        for(var i = 0;i<len;i++){
            if(node[i].attributes['chart']){
                var obj = node[i];
                var c = obj.attributes['chart'].value;
                chart[c](obj);
            }
        }
    },

    map : function (obj) {
        var context = chart.makeCanvas(obj,mapOpt.canvas_width,mapOpt.canvas_height);
        var g = document.createElement("img");
        g.setAttribute("src","img/map.png");
        //console.log();
        context.drawImage(g,0,0);
    },
    /*柱状对比图*/
    barComparison : function (obj) {
        var context = chart.makeCanvas(obj,barOpt.canvas_width,barOpt.canvas_height);
        context.strokeStyle = "white";
        var initX = (barOpt.canvas_width-barOpt.chart_width) / 2;
        var initY = (barOpt.canvas_height-barOpt.chart_height) / 2;
        context.moveTo(initX,initY);
        context.lineTo(initX,barOpt.chart_height+initY);
        context.lineTo(initX+barOpt.chart_width,barOpt.chart_height+initY);
        context.stroke();
        //console.log(barPara);
        chart.drawAxisX(context,initX,initY);
        chart.drawAxisY(context,initX,initY);
        chart.writeAxisY(context,initX,initY);
        chart.writeAxisX(context,initX,initY);
        chart.drawBar(context,initX,initY,barOpt, barPara);
    },
    /*折线图*/
    lineChart : function (obj) {
        var context = chart.makeCanvas(obj,barOpt.canvas_width,barOpt.canvas_height);
        context.beginPath();
        context.strokeStyle = "white";
        context.lineWidth = 2;
        var initX = (barOpt.canvas_width-barOpt.chart_width) / 2;
        var initY = (barOpt.canvas_height-barOpt.chart_height) / 2;
        context.moveTo(initX,initY);
        context.lineTo(initX,barOpt.chart_height+initY);
        context.lineTo(initX+barOpt.chart_width,barOpt.chart_height+initY);
        context.stroke();

        chart.drawAxisX(context,initX,initY);
        chart.drawAxisY(context,initX,initY);
        chart.writeAxisY(context,initX,initY);
        chart.writeAxisX(context,initX,initY);
        chart.drawLine(context,initX,initY);

    },
    /*多边形图表*/
    starChart : function (obj) {
        var context = chart.makeCanvas(obj,barOpt.canvas_width,barOpt.canvas_height);
        var line = (barOpt.canvas_width <  barOpt.canvas_height) ? barOpt.canvas_width : barOpt.canvas_height;
        var len = barPara.horizon.length;
        var linePer = (line*0.8)/ 2 / len;
        for(var i =len;i>0;i--){
            var Line = linePer*(i);
            chart.drawStarLine(context,barOpt,Line);
            (i%2 == 0)?context.fillStyle = "rgba(255,255,255,0.4)": context.fillStyle = 'rgba(143,143,143,0.4)';
            context.fill();
        }
        chart.writeCorner(context,line);
        chart.drawStar(context,line);
    },

    circleChart : function(obj){
        var context = chart.makeCanvas(obj,barOpt.canvas_width,barOpt.canvas_height);
        chart.drawSelect("selectCity",Data);
        chart.drawSelect("selectQuality",GuangZhou);
        var e = document.getElementById("submit_circle");
        e.onclick = function () {
            var a = [];
            a.push(document.getElementById("city").value);
            a.push(document.getElementById("quality").value);
            a.push(document.getElementById("number").value);
            chart.drawcircle(context,a,obj);

        }
    },

    pieChart : function(obj){
        var context = chart.makeCanvas(obj,barOpt.canvas_width,barOpt.canvas_height);
        var e = document.getElementById("submit_pie");
        e.onclick = function () {
            var a = [];
            a.push(document.getElementById("city1").value);
            a.push(document.getElementById("quality1").value);
            a.push(document.getElementById("number1").value);
            a.push(document.getElementById("number2").value);
            chart.drawPie(context,a,obj);
        }

    },

    makeCanvas :function(parent,width,height){
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width",width);
        canvas.setAttribute("height",height);
        canvas.style.backgroundColor = "rgba(255,255,255,0)";
        parent.appendChild(canvas);
        var context = canvas.getContext("2d");

        context.font = "12px Arial";
        return context;
    },
    drawAxisX :function(context,x,y){
        context.strokeStyle = "white";
        for (var i = 0;i<barPara.horizonNum+1;i++){
            var interval = barOpt.chart_width / barPara.horizonNum;
            context.moveTo(x+i*interval,y+barOpt.chart_height);
            context.lineTo(x+i*interval,y+barOpt.chart_height+6);
        }
        context.stroke();
    },
    drawAxisY : function(context,x,y){
        for (var i = 0;i<(barPara.verticalNum/2);i++){
            var interval = 2*(barOpt.chart_height / barPara.verticalNum)  ;
            context.fillStyle = "rgba(208,208,195,0.2)";
            context.fillRect(x,y + interval*i,barOpt.chart_width,interval/2);
            context.fillStyle = "rgba(0,0,0,0.2)";
            context.fillRect(x,y + interval*(i+0.5),barOpt.chart_width,interval/2);
        }
    },
    writeAxisY : function(context,x,y){
        context.fillStyle = "white";
        var len = barPara.vertical.length,
            interval = barOpt.chart_height / barPara.verticalNum;
        context.textAlign="right";
        for (var i = 0; i < len; i++) {
            context.fillText(barPara.vertical[i],x-5,y+interval*i+5)
        }

    },
    writeAxisX : function (context,x,y) {
        context.fillStyle = 'white';
        var len = barPara.horizon.length,
            interval = barOpt.chart_width / barPara.horizonNum;
        for(var i = 0; i < len ; i++){
            context.fillText(barPara.horizon[i],x+0.8*interval+i*interval, barOpt.chart_height*(1+1/barPara.verticalNum)+44);
        }
    },
    drawBar : function (context, x, y, barOpt, barPara) {
        var lenX = barPara.horizon.length,
            lenObject = barPara.data[0].length,
            x0 = x,
            y0 = y+barOpt.chart_height,            //坐标原点
            interval = barOpt.chart_width / barPara.horizonNum,
            w = interval/(lenObject+1),
            distanceY = 0.5*interval/(lenObject+1); //柱状图离Y轴的距离（间隙）;

        for(var i = 0,dis=0;i < lenX;i++){
            var day = 0;                             //mark：日期可更改
            for(var k = 0;k < lenObject;k++){
                var s = eval('(' + recorder['city'][k] + ')'),
                    para = barPara.horizon[i];
                    h = s[para][0];
                //console.log(h);
                var height = barOpt.chart_height*h / barPara.vertical[0];
                console.log(barPara.vertical[0]);
                context.fillStyle = chart.barColor[k];
                context.fillRect(distanceY+x0+dis+w*k,y0-height,w,height);
            }
            dis += interval;
        }

    },
    drawLine : function (context,x,y) {
        var  len = barPara.data[0].length,
            lens = barPara.data.length,
            S = 0.5*barOpt.chart_width / barPara.horizonNum;
        context.beginPath();
        context.lineWidth = 4;
        for(var i = 0,k = 0;i < len; i++){
            //console.log(k);
            context.strokeStyle = chart.barColor[i];
            var X =x+x,Y=y+barOpt.chart_height-(barOpt.chart_height*barPara.data[k][i] / barPara.vertical[0] );
            context.moveTo(X,Y);
            for(; k<lens;k++){
                Y=y+barOpt.chart_height-(barOpt.chart_height*barPara.data[k][i] / barPara.vertical[0] );
                //console.log(barPara.data[k][i]);
                context.lineTo(X+S*k*2,Y);
                //console.log(X+x*k*2);
                context.stroke();
                context.beginPath();
                context.arc(X+S*k*2,Y,2,0,2*Math.PI);
                context.fillStyle = context.strokeStyle;
                context.fill();
            }
            k = 0;
            context.beginPath();
        }
    },
    drawStarLine : function (context,barOpt,line){
        var centerY = barOpt.canvas_height / 2,
            centerX = barOpt.canvas_width / 2,
            angleNum = barPara.horizon.length,
            angleInner = (360/angleNum)*Math.PI/180; // 内角
        context.beginPath();
        context.strokeStyle = "rgba(143,143,143,0.7)";
        context.translate(centerX,centerY);
        for(var i = 0;i<angleNum;i++){
            context.rotate(angleInner);
            context.moveTo(0,0);
            context.lineTo(0,-line);
            context.lineTo(line*Math.sin(angleInner),-line*Math.cos(angleInner));
            context.stroke();
        }
        context.translate(-centerX,-centerY);


    },

    writeCorner : function (context,line) {

        var len = barPara.horizon.length,
            angle = (360/len)*Math.PI/180,
            line = 18+(line*0.8)/ 2;

        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.translate(barOpt.canvas_width / 2,barOpt.canvas_height / 2)


        function getPoint(){
            var point = [],
                x = 0,y= 0;
            for(var i = 0 ;i<len;i++){
                point.push([]);
                point[i].push(parseInt(x+line*Math.sin(angle*i)))
                point[i].push(parseInt(y+line*Math.cos(angle*i)));
            }
            return point;
        }
        for(var k = 0 ;k<len;k++){
            var p = getPoint();
            context.fillText(barPara.horizon[k],p[k][0],p[k][1]+5);

        }
    },
    drawcircle : function (context,array,obj) {
        var centerY = barOpt.canvas_height / 2,
            centerX = barOpt.canvas_width / 2,
            line = (barOpt.canvas_width <  barOpt.canvas_height) ? barOpt.canvas_width : barOpt.canvas_height;

        if(recorder['city'].indexOf(array[0])<0){
            alert(array[0]+"的数据没有准备好！,请选择别的城市");
        }
        else{
            var data = GuangZhou[array[1]],
                sum = data.length,
                num = parseFloat(array[2]),
                count = 0;
            for(var i=0;i<sum;i++){
                console.log(num);
                if(data[i] > num){
                    count++;
                }
            }
            var percentage = count / sum;
            //console.log(count);
            context.clearRect(0,0,2*centerX,2*centerY);
            context.beginPath();
            context.lineWidth = 28;
            context.strokeStyle = "rgba(180,180,180,1)";
            context.arc(centerX,centerY,0.25*line,0,2*Math.PI,false);
            context.stroke();
            context.beginPath();
            context.strokeStyle = "#FF6666";
            context.arc(centerX,centerY,0.25*line,0,percentage*2*Math.PI,false);
            context.stroke();
            percentage = chart.toPercentage(percentage);
            context.fillStyle = "white";
            context.font = "30px Georgia";
            context.fillText(percentage,centerX-47,centerY+10);
            context.closePath();

                /*有问题！ innerHTML 不修改值*/
            //var p = obj.getElementsByTagName("p"),
            //    e = p.length;
            //if(!!e){
            //    p.innerHTML = array[1]+"大于"+array[2]+"比例为"+percentage;
            //}else{
            //    var p =  document.createElement("p");
            //    p.innerHTML= array[1]+"大于"+array[2]+"比例为"+percentage;
            //    obj.appendChild(p);
            //}
            var len = obj.getElementsByTagName("p").length;
            if(len){
                obj.removeChild(obj.getElementsByTagName("p")[0]);
            }
            var p =  document.createElement("p");
            p.innerHTML= array[1]+"大于"+array[2]+"比例为"+percentage;
            obj.appendChild(p);

        }

    },

    drawPie : function (context,array,obj) {
        var centerY = barOpt.canvas_height / 3,
            centerX = barOpt.canvas_width / 3,
            line = (barOpt.canvas_width <  barOpt.canvas_height) ? barOpt.canvas_width : barOpt.canvas_height;

        if(recorder['city'].indexOf(array[0])<0){
            alert(array[0]+"的数据没有准备好！,请选择别的城市");
        }
        else{
            var data = GuangZhou[array[1]],
                sum = data.length,
                num1 = parseFloat(array[2]),
                num2 = parseFloat(array[3]),
                count1 = 0,
                count2 = 0;
            for(var i=0;i<sum;i++){
                if(data[i] < num1){
                    count1++;
                }else if(data[i]>num2){
                    count2++;
                }
            }

            var percentage1 = count1 / sum;
            var percentage2 = count2 / sum;
            var percentage3 = 1-percentage1-percentage2;
            console.log(percentage1+','+percentage2);
            context.clearRect(0,0,2*centerX,2*centerY);
            context.beginPath();
            context.lineWidth = 28;
            context.fillStyle = "rgba(180,180,180,1)";
            context.arc(centerX,centerY,0.25*line,0,2*Math.PI,false);
            context.fill();
            context.beginPath();
            context.fillStyle = "#FF6666";
            context.moveTo(centerX,centerY);
            context.arc(centerX,centerY,0.25*line,0,percentage1*2*Math.PI,false);
            //console.log(percentage1);
            context.fill();
            context.fillRect(0,183,15,15);

            context.beginPath();
            context.fillStyle = "#F1FF4E";
            context.moveTo(centerX,centerY);
            context.arc(centerX,centerY,0.25*line,percentage1*Math.PI,(percentage1+percentage2)*2*Math.PI,false);
            //console.log(percentage1);
            context.fill();
            context.fillRect(0,220,15,15);

            context.beginPath();
            context.fillStyle = "#69B7FF";
            context.moveTo(centerX,centerY);
            context.arc(centerX,centerY,0.25*line,(percentage1+percentage1)*2*Math.PI,(percentage1+percentage2+percentage3)*2*Math.PI,false);
            //console.log(percentage1);
            context.fill();
            context.fillRect(0,256,15,15);


            percentage1 = chart.toPercentage(percentage1);
            percentage2 = chart.toPercentage(percentage2);
            percentage3 =chart.toPercentage(percentage3);
            var len = obj.getElementsByTagName("p").length;
            while(len){
                obj.removeChild(obj.getElementsByTagName("p")[0]);
            }
            var p1=  document.createElement("p");
            p1.innerHTML= array[1]+"大于"+array[3]+"比例为"+percentage2;
            obj.appendChild(p1);
            var p2=  document.createElement("p");
            p2.innerHTML= array[1]+"在"+array[3]+"与"+array[2]+"之间的比例为"+(percentage3);
            obj.appendChild(p2);
            var p3 =  document.createElement("p");
            p3.innerHTML= array[1]+"小于"+array[2]+"比例为"+percentage1;
            obj.appendChild(p3);

        }

    },

    drawSelect : function (classname,data) {
        var select = document.getElementsByClassName(classname),
            len = select.length;
        for(var k=0;k<len;k++){
            for (var i in data){
                var e = document.createElement("option");
                e.innerHTML = i;
                select[k].appendChild(e);
            }
        }
    },
    /*循环没整理好，数据格式命运要关联好，方便检索*/
    drawStar : function(context,line){
        var len = barPara.horizon.length,
            line = line*0.8/2,
            a = [],
            b = [];
        var centerY = barOpt.canvas_height / 2,
            centerX = barOpt.canvas_width / 2,
            angle = 360/barPara.horizon.length;
        for(var i = 0;i<len;i++){
            var value = barPara.horizon[i];
            //console.log(GuangZhou[value]);
            var max = chart.getMax(GuangZhou[value]);
            var per = GuangZhou[value][1]/max;
            a.push(per*line);
        }
        b.push(a);
        a = [];
        for(i = 0;i<len;i++){
            value = barPara.horizon[i];
            max = chart.getMax(Shanghai[value]);
            per = Shanghai[value][1]/max;
            a.push(per*line);
        }
        b.push(a);
        a = [];
        for(i = 0;i<len;i++){
            value = barPara.horizon[i];
            //console.log(GuangZhou[value]);
            max = chart.getMax(Beijing[value]);
            per = Beijing[value][1]/max;
            a.push(per*line);
        }
        b.push(a);

        console.log(b);
        context.lineWidth =3;
        for(i = 0;i<recorder["city"].length;i++){
            context.beginPath();
            context.textAlign = "left";
            context.strokeStyle = chart.barColor[i];
            context.fillStyle = context.strokeStyle;
            context.fillRect(-180,-140+i*25,15,15);
            context.fillStyle = "white";
            context.fillText(recorder.city[i],-160,-130+i*25);
            //context.moveTo(0,b[i][0]);
            context.moveTo(0,-b[i][0]);
            for(var k =0;k<len;k++){
                context.lineTo(0,-b[i][k]);
                context.arc(0,-b[i][k],3,0,2*Math.PI,false);
                context.rotate((-60)*Math.PI/180);
            }
            context.closePath();
            context.stroke();
        }
    },

    toggleLineToBar : function (obj) {
        obj.removeChild(obj.childNodes[2]);
        var context = obj.childNodes[2].getContext("2d");
        context.clearRect(0,0,barOpt.canvas_width,barOpt.canvas_height);
        chart.barComparison(obj);
        obj.childNodes[1].innerHTML = "柱状对比图切换折线图";
    },

    toggleBarToLine : function (obj){
        obj.removeChild(obj.childNodes[2]);
        var context = obj.childNodes[2].getContext("2d");
        context.clearRect(0,0,barOpt.canvas_width,barOpt.canvas_height);
        chart.lineChart(obj);
        obj.childNodes[1].innerHTML = "折线图切换柱状对比图";
    },
    toPercentage : function(num) {

        var b = num.toFixed(4);
        b=b.slice(2,4)+"."+b.slice(4,6)+"%";
        return b;
    },
    jsonLength : function (json){
        var count = 0;
        for(var i in json){
          count++
        }
        return count;
    },
    getMax : function (arr) {
        var len = arr.length,
            max = arr[0];

        for(var i = 0;i<len;i++){
          if(arr[i] > max){
              max = arr[i];
          }
      }

        return max;
    },
    barColor : ['blue','purple','red','yellow','green']

};
//Object.prototype.makeChart = chart;
