class Alternation{
    
    constructor(motion){


        //累计所有的触碰次数
        this.allToucheState = {
            '0': false,
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false
        };
        this.addNums = 0;

        //指定需要多少目标手势触控
        this.goalNum = 6;

        //数据对象
        this.datas = new Datas();
        //工具对象
        this.tool = new Tool();
        //动画对象
        this.motion = motion;
        //交互层对象
        this.box = document.getElementById('alternationGame');


        //缓存的所有图片
        this.imgs = [];
        //是否可以开始绘制
        this.isDrawOnOff = false;

        //数组
        this.arr = [];
        //已经落下的花朵
        this.dropArr = [];
        //落下开关
        this.dropOnoff = true;
        //
        this.noDropflower = [];

        //start数组
        this.startArr = [];
        //move坐标数组
        this.indexArr = [];
        //end数组
        this.endArr = [];

        //初始化方法
        this.init();
    }

    //初始化方法
    init(){

        //1. 绑定事件
        //this.touchs();

        //2. 检测手指滑动的位置
        //this.checkPostion();
        
        //1. 绑定新事件
       // this.obindNewEvent();

        //2.如果点击sunzi
        //this.playCanvass();    

        //this.motion.initballons();

        //绘制图片动画
        //this.drawPicAnimation();
        
        //烟花
        //this.fireworks();
        
        //1. 加载缓存图片 静读条读取
        this.loadVideoImgs();

        //2.点击帷幕拉条进入动画
        this.clickIntoMotion();


         //执行动画绘制

    }


    //1. 加载缓存图片
    loadVideoImgs(){
            
        var imgNums = 133;
        var ci = 0;
        var This = this;
        var p = 0;

        //进度条
        var progressWrap = document.getElementsByClassName('progressWrap')[0];
        var progressBox = document.getElementById('progressBox');
        var con = progressBox.getElementsByClassName('progressLine')[0];
        var box = progressBox.getElementsByClassName('progressContent')[0];
        var text = progressBox.getElementsByClassName('preogressText')[0];
        var w = con.clientWidth;
        var This = this;


        //加载图片
        for(var i=0;i<imgNums;i++){
            var img = new Image();
            img.src = './images/imgs/'+this.tool.addZoom(i,5)+'.jpg';
            img.onload = function(){
                
                ci++;
                This.imgs.push(this);

                //进度条交互
                p = ci/imgNums;
                text.innerText = Math.floor(p*100)+ '%';
                box.style.width = Math.ceil(w*p) + 'px';

                //如果缓存完所有图片
                if(ci == imgNums){
                    
                    //关闭进度条层
                    progressWrap.style.opacity = 0;
                    progressWrap.addEventListener('transitionend',()=>{
                        progressWrap.style.display = 'none';
                    });

                    //打开绘制开关
                    This.isDrawOnOff = true;
                }

            }
        }
    }


    //2. 点击帷幕线索进入动画
    clickIntoMotion(){
        var a = document.getElementById('windowLine');
        a.addEventListener('click',()=>{
            //1. 运动移除动画
            a.classList.add('animated');
            a.classList.add('bounceOutUp');

            if(this.isDrawOnOff){
                this.drawPicAnimation(this.imgs.length);
            }

        }); 
    }

    //3. 绘制片头帷幕视频
    drawPicAnimation(imgNums){

        
        var arr = this.imgs;
        var videoCanvas = document.getElementById('videoCanvas');
        var canvas = document.getElementById('logoparticles');
        var ctx = canvas.getContext('2d');
        var videoWrap = document.getElementById('videoWrap');
        var w = videoWrap.clientWidth;
        var h = videoWrap.clientHeight;
        canvas.setAttribute('width',w);
        canvas.setAttribute('height',h);
        
        var i = 0;
        var timer = null;
        
        videoCanvas.style.opacity = 0;
        timer = setInterval(()=>{

            if(i >= imgNums-20){
                
                //1. 渐隐消失
                videoWrap.style.opacity = 0;
                
                //2. 进入动画
                this.goIntoMotion(); 
                
                videoWrap.addEventListener('transitionend',()=>{
                    videoWrap.style.display = 'none';
                });

            }

            //当超出最大图片数量 停止渲染
            if(i >= imgNums){
                clearInterval(timer);
                return;
            }

            ctx.drawImage(arr[i++],0,0,w,h);  //

        },20);
    }


    //4. 进入动画
    goIntoMotion(){
        //1. 左右帷幕 和 上帷幕 运动入场
        this.nextWindowAnimation();
    }


    //5. 左右帷幕 和 上帷幕 运动入场
    nextWindowAnimation(){

        var left = document.getElementsByClassName('mubu_left')[0];
        var right = document.getElementsByClassName('mubu_right')[0];
        var up = document.getElementsByClassName('mubu_up')[0];

        //左窗帘进入
        left.classList.add('animated');
        left.classList.add('fadeInLeft');

        right.classList.add('animated');
        right.classList.add('fadeInRight'); 

        up.classList.add('animated');
        up.classList.add('fadeInDown'); 


        //1. 出现金属球动画
        this.motion.ribbonContainer();

        console.log(this.motion)

        //2. 出现彩带
        this.motion.bigColorsFalling();
        //3. 出现小纸片
        //this.motion.smallColorsFalling();
        //
        //4.绑定事件
        //this.obindNewEvent();

    }


    obindNewEvent(){
        var elems = this.box.getElementsByClassName('alterBox');
        var This = this;
        this.arr = [];
        
        //遍历绑定touch交互事件
        for(var i=0;i<elems.length;i++){
            this.oaddListenerAdd(i,elems[i],function(r){
                if(r == This.goalNum){
                    This.isMotion();
                }
            });
        }
    }




    //绑定事件检测离开
    oaddListenerAdd(index,elem,fn){
        
        var This = this;
        var result = 0;

        elem.addEventListener('touchstart',function(ev){
            This.allToucheState[index] = true;

             //检测是否满足最大手势数
            result = This.ocheckMaxNum();

            fn&&fn(result);
        });

    }






    //绑定事件检测离开
    oaddListener(index,elem){
        
        var This = this;

        elem.addEventListener('touchstart',function(ev){
            This.allToucheState[index] = true;
            //检测是否满足最大手势数
            This.ocheckMaxNum();
        });

        elem.addEventListener('touchend',function(ev){
            This.allToucheState[index] = false;
            //检测是否满足最大手势数
            This.ocheckMaxNum();            
        });
    }




    //检测是否满足最大手势数
    ocheckMaxNum(){

        var bs = this.allToucheState;
        var result = 0;

        for(var key in bs){
            if(bs[key]){
                result++;
            }
        }

        return result;
    }




    //motion动画
    isMotion(){

        //获取花朵信息
        var This = this;
        var arr = This.arr;
        var box =  document.getElementById('fcStaticBox');
        var flowers = box.getElementsByClassName('secItem');
        var index = [];
        var noDropflower = [];

        var s = 0;
        var e = flowers.length;
        var c = Math.floor((e-s)/2);


        // 断裂旋转
        for(var i=0;i<flowers.length;i++){
            flowers[i].style[This.tool.prefixBrowserVersion('transform')]=  'translate3d(0px,0px,0px) rotate3d(0,0,1,0deg)';
            flowers[i].style[This.tool.prefixBrowserVersion('opacity')]=  1;
        } 


        for(var i=0;i<c;i++){
            flowers[i].style[This.tool.prefixBrowserVersion('transition')] =  (6+i) + 's';
        } 


        for(var i=c;i<flowers.length;i++){
            flowers[i].style[This.tool.prefixBrowserVersion('transition')] =  (10-(i-c)) +'s';
        } 


        
        flowers[0].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(-400px,-800px,0px) rotate3d(0,0,1,20deg)';
        flowers[0].style[This.tool.prefixBrowserVersion('opacity')] =  0;
       
        flowers[1].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(-450px,-800px,0px) rotate3d(0,0,1,30deg)';
        flowers[1].style[This.tool.prefixBrowserVersion('opacity')] =  0;

        flowers[2].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(-500px,-800px,0px) rotate3d(0,0,1,30deg)';
        flowers[2].style[This.tool.prefixBrowserVersion('opacity')] =  0;

        flowers[3].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(400px,-800px,0px) rotate3d(0,0,1,30deg)';
        flowers[3].style[This.tool.prefixBrowserVersion('opacity')] =  0;

        flowers[4].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(450px,-800px,0px) rotate3d(0,0,1,-30deg)';
        flowers[4].style[This.tool.prefixBrowserVersion('opacity')] =  0;

        flowers[5].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(500px,-800px,0px) rotate3d(0,0,1,-30deg)';
        flowers[5].style[This.tool.prefixBrowserVersion('opacity')] =  0;

        flowers[6].style[This.tool.prefixBrowserVersion('transform')] =  'translate3d(550px,-800px,0px) rotate3d(0,0,1,-30deg)';
        flowers[6].style[This.tool.prefixBrowserVersion('opacity')] =  0;

    
        setTimeout(()=>{
            //烟花效果
            //this.fireworks();
        },100);

        setTimeout(()=>{
            this.showTitle();
        },4000)

        setTimeout(()=>{
           this.disappearColors();
           this.disappearBallon();
           this.backAnimation();
        },2000);
    }


    //出现文字
    showTitle(){
        var timg = document.getElementsByClassName('timg')[0];
        var bimg = document.getElementsByClassName('bimg')[0];

        timg.style[this.tool.prefixBrowserVersion('transform')] = 'rotate3d(1,0,0,0deg) translateX(-50%)'
        bimg.style[this.tool.prefixBrowserVersion('transform')] = 'rotate3d(1,0,0,0deg) translateX(-50%)'
    }

    //播放
    playCanvass(){
        
        var lineBtn = document.getElementById('lalian');
        var videoCanvas = document.getElementsByClassName('videoCanvas')[0];
        var videoWrap = document.getElementById('videoWrap');
        var logoVideo = document.getElementById('logoVideos');
        var canvas = document.getElementById('logoparticles');
        var w = videoWrap.offsetWidth;
        var h = videoWrap.offsetHeight;
        canvas.setAttribute('width',w);
        canvas.setAttribute('height',h);
        var ctx = canvas.getContext('2d');
        var timer = null;
        var dur = null;
        var ts = 20;
        var time = 0;
        var This = this;


        //监听播放
        logoVideo.addEventListener('play',function(){
            console.log(this.duration)
            timer = setInterval(()=>{
                time += ts;
                
                if( time > this.duration*1000-200 ){
                    videoWrap.style.opacity = 0;
                    //执行下一个动画
                    This.nextWindowAnimation();
                    clearInterval(timer);
                    return;
                }
                ctx.drawImage(this,0,-140,w,h+300);
            },ts)
        })

        lineBtn.onclick = function(){

            //运动动画
            this.classList.add('animated');
            this.classList.add('bounceOutUp');

            //视频背景消失
            videoCanvas.style.opacity = 0;
            logoVideo.play();
        }
    }


    //执行下一个窗帘动画
    nextWindowAnimation(){

        var left = document.getElementsByClassName('mubu_left')[0];
        var right = document.getElementsByClassName('mubu_right')[0];
        var up = document.getElementsByClassName('mubu_up')[0];

        //左窗帘进入
        left.classList.add('animated');
        left.classList.add('fadeInLeft');

        right.classList.add('animated');
        right.classList.add('fadeInRight'); 

        up.classList.add('animated');
        up.classList.add('fadeInDown'); 


        //1. 出现金属球动画
        //this.motion.ribbonContainer();         
        //2. 出现彩带
        //this.motion.bigColorsFalling();
        //3. 出现小纸片
        //this.motion.smallColorsFalling();
        //
        //4.绑定事件
        //this.obindNewEvent();

    }




    




    //烟花效果
    fireworks(){
        $('.yanhuaBox').fireworks({ 
          sound: false, // sound effect
          opacity: 1, 
          width: '100%', 
          height: '100%' 
        });
    }

    /* 旧的事件交互 */

    initDefault(){
        this.box.addEventListener('touchstart',function(ev){
            ev.preventDefault();
        })
    }


    checkPostion(obj){
        var box = this.box;
        let data = this.datas.getSlidePostions(); 
    }


    //
    touchs(){

        var elems = this.box.getElementsByClassName('alterBox');
        var This = this;
        this.arr = [];

        //遍历绑定touch交互事件
        for(var i=0;i<elems.length;i++){
            this.elemTouch(elems[i],i,function(obj){

                //检测是否已经划过该index下这段
                for(var i=0;i<This.arr.length;i++){
                    if(This.arr[i].index == obj.index){
                        return;
                    }
                }

                This.arr.push(obj);

                This.handleIndex();
            });
        }

    }



    // 
    handleIndex(){

        //获取花朵信息
        var This = this;
        var arr = This.arr;
        var box =  document.getElementById('fcStaticBox');
        var flowers = box.getElementsByClassName('secItem');
        var index = [];
        var noDropflower = [];

        //批量处理index对应的花朵下落情况
        for(var i=0;i<arr.length;i++){
            index.push(arr[i].index);
        }

        //初始化花朵的运动状态
        if(This.dropOnoff){
            for(i=0;i<flowers.length;i++){

                flowers[i].style[This.tool.prefixBrowserVersion('transform')]=  'translate3d(0px,0px,0px) rotate3d(0,0,1,0deg)';
                flowers[i].style[This.tool.prefixBrowserVersion('opacity')]=  1;
            }
            This.dropOnoff = false;
        }
        
        //获取还剩下花朵的索引
        noDropflower = this.getNoDrapIndex(flowers,index,flowers); 
        this.executeMotion(index,flowers,noDropflower);
        
        //检测是否可以进入退出动画
        this.checkIsOutMotion(noDropflower);

    }
    


    //检测并且进入退出动画
    checkIsOutMotion(arr){
        
        var box =  document.getElementById('fcStaticBox');
        var flowers = box.getElementsByClassName('secItem');
        var evNum = 0;
        var This = this;
        var onoff = true;
        

        //检测是否运动结束
        for(var i=0;i<flowers.length;i++){
            flowers[i].addEventListener('transitionend',function(ev){
                //开始执行退出运动动画
               evNum++;
               if(evNum >= 3){
                    if(onoff){
                    This.executeOutMotion();
                    onoff = false;
                }
               }
            })
        }

    }   



    executeOutMotion(){
        
        var i = 0;
        
        console.log('开始执行退出动画!'+ i++);

        //消失金属气球
        //this.disappearBallon();

        //消失黄色彩带
        //this.disappearColors();

        //渐变消失飘落的彩带
        //this.disappearSmallPapers();

    }


    //渐变消失飘落的纸片
    disappearSmallPapers(){
        var items = this.tool.getItems('colorContainer','colorful-item');
        
        //清理定时器
        clearInterval(this.motion.colorSmallTimer);

        for(var i=0;i<items.length;i++){
            items[0].style['opacity'] = 1;
        }

    }   


    //黄色彩带消失
    disappearColors(){
        var box = document.getElementById('colorContainer');
        var colors = box.getElementsByClassName('colorful-box');

        //清除位置运动定时器
        window.clearInterval(this.motion.colorsTimer);

        colors[0].style[this.tool.prefixBrowserVersion('transform')] = "translate3d(-150px, 280px, 15px)";
        colors[1].style[this.tool.prefixBrowserVersion('transform')] = "translate3d(150px, -280px, 15px)";

        for(var i=0;i<colors.length;i++){
            colors[i].addEventListener('transitionend',function(){
                this.style.display = 'none';
            })
        }
    }   



    //金属球消失
    disappearBallon(){
        var box = document.getElementById('ribbonContainer');
        var balls = box.getElementsByClassName('rcItem');
        var This = this;
        var num = 0;

        //动画对象
        window.clearInterval(this.motion.ballTimer);
        
        //退出动画
        for(var i=0;i<balls.length;i++){
            
            //balls[i].style[This.tool.prefixBrowserVersion('opacity')] = 0;
            
            if(i == 0){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(150px, 340px, 15px)";
            }else if(i == 1){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(750px, -150px, 25px)";
            }else if(i == 2){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(-250px, -140px, 25px)";
            }else if(i == 3){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(350px, -280px, 15px)";
            }else if(i == 4){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(-150px, -80px, 15px)";
            }else if(i == 5){
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d(200px, -200px, 15px)";
            }

            var timer = setTimeout(()=>{
                //This.backAnimation();
                clearTimeout(timer);
            },2000);

        }
    }


    //后续动画
    backAnimation(){
        
        //初始化气球位置
        this.motion.initballons();
        
        //气球上升动画
        this.motion.flyballs();
    }


    //执行少量手指触发运动
    executeMotion(index,flowers,remain){

        var rX=0,rY=0,rA=0,i=0;
        var This = this;
        var motionAttr = {};
        var This = this;
        //console.log(index.length);
        
        //同时超过三个手指滑动 或者 积累三个手指触控
        if(index.length >= 3){
            console.log(index.length)
            //全部快速落下
            for(var i=0;i<flowers.length;i++){
                motionAttr = {rX: 220,rY: 750,rA: 90,time:5,alpha: 0, delay: 0};
                //运动 飘落
                motion(motionAttr,i);
            }
        }

        //少量手指分开执行的运动
        if(index.length <= 2){
            

                //  对应index 左右下的花朵单独处理
                if(index.length == 1){

                    motionAttr = {rX: 10,rY: 230,rA: 80,time: 10,alpha: 0,delay: 0};
                    var centerIndex = index[0];

                    movefn(centerIndex,flowers.length);
                }

                
                //  对应index左右下的花朵单独处理
                if(index.length == 2){

                    var cIndex = Math.floor(flowers.length/2);

                    for(var i=0;i<index.length;i++){
                        if(index[i] < cIndex){
                            movefn1(index[i],cIndex);
                        }else{
                            movefn2(index[i],cIndex);
                        }
                    }

                }
        }


        function movefn(cur,end,basic){
            for(var i=cur;i>=-1;i--){
                motionAttr = {rX: 10,rY: 460 - 10*(cur-i),rA: 80,time: 1+2*(cur-i),alpha: 0,delay:0+(cur-i)*0.1};
                motion(motionAttr,i+1,60);
            }
            for(var i=cur+1;i<end;i++){
                motionAttr = {rX: 10,rY: 460 - 10*(i-cur),rA: 80,time: 1+2*i,alpha: 0,delay: 0+(i-cur)*0.1};
                motion(motionAttr,i,-60);
            }
        }

        function movefn1(cur,center,end){
            for(var i=cur;i>=-1;i--){
                motionAttr = {rX: 10,rY: 460 - 30*(cur-i),rA: 80,time: 3+2*(cur-i),alpha: 0,delay:0+(cur-i)*0.2};
                motion(motionAttr,i+1,60);
            }
            for(var i=cur+1;i<end;i++){
                motionAttr = {rX: 10,rY: 460 - 30*(i-cur),rA: 80,time: 3+2*i,alpha: 0,delay: 0+(i-cur)*0.2};
                motion(motionAttr,i,-60);
            }
        }

        function movefn2(cur,end){
            for(var i=cur;i>=end-1;i--){
                motionAttr = {rX: 10,rY: 460 - 30*(end-i),rA: 80,time: 3+2*Math.abs(end-i),alpha: 0,delay:0+Math.abs((end-i)*0.2)};
                motion(motionAttr,i+1,60);
            }
            for(var i=cur+1;i<flowers.length;i++){
                motionAttr = {rX: 10,rY: 460 - 30*(i-end),rA: 80,time: 3+2*(i-cur),alpha: 0,delay: 0+(i-end)*0.2};
                motion(motionAttr,i,-60);
            }
        }

        function motion(obj,index,rrA){
           
            rX = obj.rX * (Math.random()>0.5 ? 1 : -1) * Math.random();
            rY = obj.rY;
            if(rrA){
                 rA = rrA * Math.random();  
            }else{
                 rA = obj.rA * (Math.random()>0.5 ? 1 : -1) * Math.random();
            }

            if(obj.time){
                 flowers[index].style[This.tool.prefixBrowserVersion('transition')]=   obj.time+'s ease '+obj.delay + 's ';
            }

            flowers[index].style[This.tool.prefixBrowserVersion('opacity')]=  obj.alpha;
            flowers[index].style[This.tool.prefixBrowserVersion('transform')]=  'translate3d('+rX+'px,'+rY+'px,0) rotate3d(0,0,1,'+rA+'deg)';
        }
    }


    getNoDrapIndex(arr1,arr2,flowers){
        var newArr = [];
        var indexArr = [];
        
        for(var i=0;i<arr1.length;i++){
            newArr.push(i);
        }

        for(var i=0;i<arr2.length;i++){
            indexArr.push(arr2[i]);
            if(flowers[arr2[i]+1]){
                indexArr.push(arr2[i]+1);
            }
        }

        for(var j=0;j<indexArr.length;j++){
            for(var i=0;i<newArr.length;i++){
                if(newArr[i] == indexArr[j]){
                    newArr.splice(i,1);
                }
            }
        }
        
        return newArr;
    }



    elemTouch(elem,ind,fn){

        var y = 0;
        var index = [];
        var atrr = {};
        var minY = 520;
        var maxY = 590;
        var sY = 0;
        var eY = 0;

        //添加默认开关
        elem.onoff = false;
        elem.positions = []; 

        //开始触控
        elem.addEventListener('touchstart',function(ev){
            this.positions.y = ev.targetTouches[0].clientY;
            ev.preventDefault();
        });

        //开始移动
        elem.addEventListener('touchmove',function(ev){
            
            sY = this.positions.y
            eY = ev.touches[0].clientY;

            if( (sY<minY && eY>maxY) || (sY>maxY && eY<minY) ){
                this.onoff = true;
                index.push(ind);
            }
        });

        //结束移动
        elem.addEventListener('touchend',function(){
            if(this.onoff){

                atrr.sY = this.positions.y;
                atrr.eY = eY;
                atrr.index = ind
                this.onoff = false;

                fn(atrr);
            }/*else{
                fn({'error':'坐标错误','code':0});
            }*/
        });


    }

    //检测存在
    checkExist(arr,obj){
        
        for(var i=0;i<arr.length;i++){
            console.log(arr[i].index,obj.index);
            if(arr[i].index == obj.index){
                return true;
            }else{
                return false;
            }
        }
    }

    events(elem,fn){
        var This = this;
        elem.addEventListener('mousedown',(ev)=>{
            
            var ev = ev || event;
            var mX = 0;
            var mY = 0;
            var endX = 0;
            var endY = 0;
            var cX = ev.clientX;
            var cY = ev.clientY;
            var oX = ev.offsetX;
            var oY = ev.offsetY;
            var moveOff = false;
            var postions = {};


            document.onmousemove= function(ev){   
               if(Math.abs(ev.clientY - cY) > 50){
                    moveOff = true;
               }
            }

            document.onmouseup = function(ev){  
                
                document.onmousemove = null;
        
                endX = ev.offsetX;
                endY = ev.offsetY;
                //console.log(moveOff);
                if(moveOff){
                    postions = { 'x1': oX, 'y1': oY, 'x2': endX, 'y2': endY };
                    console.log(postions)
                }
            }  

            ev.preventDefault();   
        })
    } 
}