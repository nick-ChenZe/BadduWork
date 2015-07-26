/**
 * Created by Administrator on 2015/7/25.
 */
window.onload = function () {
    try{
        chart.init();
    }catch(e){
        console.log(e);
    }
    toggle();
    blurOrFocus();
};
function toggle(){
    var a = document.getElementById("toggle");
    a.onclick = function () {
        var node = document.getElementsByTagName("div");
        len = node.length;
        for (var i =0;i<len;i++){
            if(node[i].attributes['chart']){
                var c = node[i].attributes['chart'].value;
                if(c == "lineChart"){
                    chart.toggleLineToBar(node[i]);
                    node[i].attributes['chart'].value = "barComparison";
                }else if( c == "barComparison"){
                    chart.toggleBarToLine(node[i]);
                    node[i].attributes['chart'].value = "lineChart";
                }
            }
        }
    };
}
function blurOrFocus(){
    var e = document.getElementsByTagName("input"),
        len = e.length;
    for (var i = 0;i<len;i++){
        e[i].onfocus = function(){
            if(this.value == '输入标准'){
                this.value = '';
            }
        };
        e[i].onblur = function () {
            if(this.value == ''){
                this.value = '输入标准';
            }
        }
    }
}