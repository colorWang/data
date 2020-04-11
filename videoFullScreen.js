/**
 * 实现思路: 外层容器 overflow:hidden
 * 
 * 中间的视频内容 不够的地方按照 "transform","scaleY("+scaley+")" 
 * 
 * 通过css此属性实现
 * 
 */

 /**
   * 创建websocket
   * @param {Object} demo 接受一个外部容器
   * 
   * @param {String} 接收一个视频播放路径
   */
createVideoContent($("#upload-view-"+index),"${root}/"+data.json.message)
function createVideoContent(obj,srcVideo){
    var $video = $('<video   type="video/mp4" width="'+app.$data.deviceBaseInfo.width+'" height="'+app.$data.deviceBaseInfo.height+'" autoplay="autoplay" class="myvideo" ></video>');

    obj.append($video);
    obj.css("overflow","hidden")

    function play() {
        $video[0].src = srcVideo;
        $video[0].load();
        $video[0].oncanplay = function () {
            var videoWidth =  $video[0].videoWidth;    //2.mp4真实宽度
            var videoHeight =  $video[0].videoHeight;  //2.mp4真实高度
            createVideoScale(videoWidth,videoHeight, app.$data.deviceBaseInfo.width, app.$data.deviceBaseInfo.height,$video)
        }
    };
		play();
};
function createVideoScale (v_w,v_h,v_ofw,v_ofh,$dom){
        //视频真实的比例
    var videoSlope = v_h/v_w,
        //视频容器的比例
        videoContainerSlope = v_ofh/v_ofw,
        //横轴的缩放比比例
        scalex,
        //纵轴的缩放比例
        scaley;
    if(videoContainerSlope >= videoSlope){
        if(v_ofw >= v_w){
            scalex = Number((v_ofw/v_w).toFixed(2));
            scaley = Number((v_ofw/v_h).toFixed(2));
            $dom.css("transform","scaleX("+scalex+") scaleY("+scaley+")");
        }else{
            scaley = Number(((v_w*v_ofh)/(v_h*v_ofw)).toFixed(2));
            $dom.css("transform","scaleY("+scaley+")");
        }
    }else{
        if(v_ofh >= v_h){
            scalex = Number((v_ofw/v_w).toFixed(2));
            scaley = Number((v_ofw/v_h).toFixed(2));
            $dom.css("transform","scaleX("+scalex+") scaleY("+scaley+")");
        }else{
            scalex = Number(((v_h*v_ofw)/(v_w*v_ofh)).toFixed(2));
            $dom.css("transform","scaleY("+scalex+")");
        }
    }
}