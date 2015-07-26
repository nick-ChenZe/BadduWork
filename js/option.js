/**
 * Created by Administrator on 2015/7/23.
 */
var barOpt = {
        //backgroundColor: color   || "white",
        canvas_width:400,
        canvas_height:300,
        chart_width:340,
        chart_height:200
        //vertical_segment_count :num || {},
        //horizon_segment_count :num || {}
    },
    barPara = {
        verticalNum : 8,
        horizonNum: 6,
        vertical : [200,175,150,125,100,75,50,25,0],
        horizon :['AQI','PM2.5','PM10','NO2','CO','SO2'],
        data :[[60,70,80],[60,40,80],[20,70,60],[60,30,80],[60,40,80],[20,50,80]]
    },
    mapOpt = {
        canvas_width:800,
        canvas_height:600,
        chart_width:700,
        chart_height:540
    };
