class Alternation{
    
    constructor(motion){

        //数据对象
        this.datas = new Datas();
        //工具对象
        this.tool = new Tool();
        //动画对象
        this.motion = motion;

        //交互层对象
        this.box = document.getElementById('alternationGame');

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

        this.init();
    }

    //初始化方法
    init(){

        //1. 绑定事件
        this.touchs();

        //2. 检测手指滑动的位置
        //this.checkPostion();
    }

    initDefault(){
        this.box.addEventListener('touchstart',function(ev){
            ev.preventDefault();
        })
    }

    checkPostion(obj){
        var box = this.box;
        let data = this.datas.getSlidePostions(); 
    }

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
               evNum++;
               if(evNum == flowers.length){
                    //开始执行退出运动动画
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
        this.disappearBallon();

        //消失黄色彩带
        this.disappearColors();

        //渐变消失飘落的彩带
        this.disappearSmallPapers();
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

            balls[i].addEventListener('transitionend',function(){
                this.style.display = 'none';
            })
        }
    }


    //执行少量手指触发运动
    executeMotion(index,flowers,remain){

        var rX=0,rY=0,rA=0,i=0;
        var This = this;
        var motionAttr = {};
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

                    for(var i=centerIndex;i>=-1;i--){
                        motionAttr = {rX: 10,rY: 460 - 30*(centerIndex-i),rA: 80,time: 3+2*(centerIndex-i),alpha: 0,delay:0+(centerIndex-i)*0.2};
                        motion(motionAttr,i+1,80);
                    }
                    for(var i=centerIndex+1;i<flowers.length;i++){
                        motionAttr = {rX: 10,rY: 460 - 30*(i-centerIndex),rA: 80,time: 3+2*i,alpha: 0,delay: 0+(i-centerIndex)*0.2};
                        motion(motionAttr,i,-80);
                    }
                }

                
                //  对应index左右下的花朵单独处理
                if(index.length == 2){

                    var centerIndex = Math.ceil((index[0]+index[1])/2);

                    if(index[0] < centerIndex){
                       /* for(var i=index[0];i<=centerIndex;i++){
                            motionAttr = {rX: 10,rY: 230,rA: 80,time: 10-2*(Math.random()*i),alpha: 0};
                            motion(motionAttr,i,80);
                        }
                        for(var i=0;i<index[0];i++){
                            motionAttr = {rX: 10,rY: 230,rA: -80,time: 10-2*(Math.random()*i),alpha: 0};
                             motion(motionAttr,i,-80);
                        }*/
                    }else{
                        /*for(var i=index[0];i<=centerIndex;i++){
                            motionAttr = {rX: 10,rY: 230,rA: 80,time: 10+2*(Math.random()*i),alpha: 0};
                        }
                        for(var i=0;i<index[0];i++){
                            motionAttr = {rX: 10,rY: 230,rA: 80,time: 15+2*(Math.random()*i),alpha: 0};
                        }*/
                    }

                }

            //剩下的花缓慢旋转向下运动
            /*for(i=0;i<remain.length;i++){
                motionAttr = {rX: 10,rY: 50,rA: 30,time: 20,alpha: 1};
                motion(motionAttr,remain[i]);
            }*/
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