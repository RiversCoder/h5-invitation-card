var ballTimer = null;

class Motion{
    

    constructor(boolean){

        //获取工具对象
        this.tool = new Tool();
        //获取数据对象
        this.datas = new Datas();
        this.timer = null;
        this.ballTimer = null;
        this.colorsTimer = null;
        this.colorSmallTimer = null;
        this.closeInterval = false;
        this.closeBallInterval = false;
        
        if(boolean){
            //初始化所有动画
            this.init();
        }
    }



    //初始化 所有到剪彩前的动画
    init(){ 

        //1. 光线移动 300ms
        let timer1 = setTimeout(()=>{
            this.lightMove();
            clearTimeout(timer1);
        },300);

        //2. logo翻转出现 800ms
        let timer2 = setTimeout(()=>{
            this.logoFlip();
            clearTimeout(timer2);
        },500);

        //3. 花球落下
        let timer3 = setTimeout(()=>{
            this.flowerDrop();
            clearTimeout(timer3);
        },900);


        //4. 球落下 大彩带飘落
        let timer4 = setTimeout(()=>{
            this.ribbonContainer();
            this.bigColorsFalling();
            this.smallColorsFalling();
            clearTimeout(timer4);
        },3500);
        
        
        //this.bigColorsFalling();

        //6. 少量小彩带飘落
        //this.smallColorsFalling();

        //7. 初始化气球
        //this.initballons();

        //8. 触发往上漂浮的气球
        //this.flyballs();
        
        //9. 触发向上折页
        //this.cardbox();

        //10. 播放粒子效果
        //this.playcanvas();
    }



    //光线移动
    lightMove()
    {
        let wrap = document.getElementById('cardboxlists');
        let lights = wrap.getElementsByClassName('cardboxitem-light');
        let tool = this.tool;
        
        for(let i=0;i<lights.length;i++)
        {
           if(i%2 == 0){
                lights[i].style[tool.prefixBrowserVersion('animation')] = "lightLineToBottom ease .8s "+ i*0.1+'s';
            }
            else{
                lights[i].style[tool.prefixBrowserVersion('animation')] = "lightLineToTop ease 0.8s "+ i*0.1+'s';
            }
        }
    }




    //logo翻转
    logoFlip()
    {
        let logo = document.getElementById('boxLogo');
        var lights = logo.getElementsByClassName('box-logo-light');
        logo.style[this.tool.prefixBrowserVersion('animation')] = "logoFlip ease .8s forwards";

        //粒子闪亮
        let timer = setTimeout(()=>{
            
            for(var i=0;i<lights.length;i++)
            {
                lights[i].style[this.tool.prefixBrowserVersion('opacity')] = 1;
                lights[1].style[this.tool.prefixBrowserVersion('animation')] = "breath ease-in-out 8.8s infinite";
            }

        },300);
    }



    //花球依次下落
    flowerDrop(){

        var wrap = document.getElementById('flowerMotionBox');
        var flowers = wrap.getElementsByClassName('fcItem');
        var fcStaticBox = document.getElementById('fcStaticBox');
        var tool = this.tool;
         
        for(var i=0;i<flowers.length;i++)
        {
            tool.animate(flowers[i],'fadeInDownBig',1,20 + 200*i);
        }

        var timer = setTimeout(()=>{
            fcStaticBox.style[this.tool.prefixBrowserVersion('opacity')] = 1;
            clearTimeout(timer);
        },2300);

        fcStaticBox.addEventListener('transitionend',()=>{
            wrap.style.opacity = 0;
        })

        wrap.addEventListener('transitionend',()=>{
            wrap.style.display = 'none';
        })
    }



    //球体运动
    ribbonContainer(){
        var wrap = document.getElementById('ribbonContainer');
        var balls = wrap.getElementsByClassName('rcItem');
        var tool = this.tool;
        var This = this;
        var randomX = 0;
        var randomY = 0;
        var randomZ = 0; 
        var ballTimer = null;

        for(let i=0;i<balls.length;i++)
        {
            //tool.animate(balls[i],'bounceInDown',1,20 + 120*i,'opacity');
            balls[i].style[this.tool.prefixBrowserVersion('animation')] = "bounceInDowns "+(0.8 + i*0.2)+"s forwards";
            //balls[i].style[this.tool.prefixBrowserVersion('visibility')] = 'visible';

            //初始化默认的运动状态
            balls[i].addEventListener('animationstart',()=>{
                balls[i].style[This.tool.prefixBrowserVersion('opacity')] = 1;
            });
            balls[i].addEventListener('animationend',function(){
                this.style.cssText = '';
                this.style[This.tool.prefixBrowserVersion('opacity')] = 1;
                this.style[This.tool.prefixBrowserVersion('transform')] = 'translate3d(0,0,0)';
            })
        }



        //缓动
        function smove(){
            
            for(let i=0;i<balls.length;i++){


                randomX = Math.floor(60 * (Math.random()>0.5 ? -1 : 1)*Math.random());
                randomY = Math.floor(150 * (Math.random()>0.5 ? -1 : 1)*Math.random());
                randomZ = Math.floor(60 *Math.random());

                balls[i].style[This.tool.prefixBrowserVersion('opacity')] = 1;
                balls[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d("+randomX+"px,"+randomY+"px,"+randomZ+"px)";
            }

            
        }

        var btimer = setTimeout(function(){
            smove();
            clearTimeout(btimer);
        },2000);

        this.ballTimer = setInterval(smove,5000);
    }



    
    

    //大彩带进入舞台
    bigColorsFalling(){

        var This = this;
        var tool = this.tool;
        var wrap = document.getElementById('colorContainer');
        var colors = wrap.getElementsByClassName('colorful-box');
        var randomX = 0;
        var randomY = 0;
        var randomZ = 0;  

        for(let i=0;i<colors.length;i++){
            
            if(i == 0){
                colors[i].style[this.tool.prefixBrowserVersion('animation')] = "fadeInUp "+(0.8 + 0.2)+"s forwards";
            }else{
                colors[i].style[this.tool.prefixBrowserVersion('animation')] = "fadeInDown "+(0.8)+"s forwards";
            }

            //初始化默认的运动状态
            colors[i].addEventListener('animationstart',()=>{
                colors[i].style[this.tool.prefixBrowserVersion('opacity')] = 1;
            })
            colors[i].addEventListener('animationend',()=>{
                colors[i].style.cssText = '';
                colors[i].style[this.tool.prefixBrowserVersion('opacity')] = 1;
                colors[i].style[this.tool.prefixBrowserVersion('transform')] = 'translate3d(0,0,0)';
            })
        }

        //缓动
        function smove(){
            
            for(let i=0;i<colors.length;i++){


                randomX = Math.floor(30 * (Math.random()>0.5 ? -1 : 1)*Math.random());
                randomY = Math.floor(20 * (Math.random()>0.5 ? -1 : 1)*Math.random());
                randomZ = Math.floor(230 * (Math.random()>0.5 ? -1 : 1)*Math.random());

                
                colors[i].style[This.tool.prefixBrowserVersion('opacity')] = 1;
                colors[i].style[This.tool.prefixBrowserVersion('transform')] = "translate3d("+randomX+"px,"+randomY+"px,"+randomZ+"px)";
            }

        }
        //smove();

        this.colorsTimer = setInterval(smove,4000);       

    }


    //小彩带旋转无固定定位飘落
    smallColorsFalling(){

        var tool = this.tool;
        var wrap = document.getElementById('colorContainer');
        var childs = wrap.getElementsByClassName('colorful-item');
        var w = wrap.offsetWidth;
        var h = wrap.offsetHeight;

        var arr = this.datas.getColorDatas();
        

        //初始化小纸片宽高、位置和背景图片
        for(let i=0;i<childs.length;i++)
        {
            childs[i].style[tool.prefixBrowserVersion('transform')] = "translate3d("+Math.floor(w*Math.random())+"px,"+ (0) +"px,0) rotate3d(0,0,1,0deg)";
            childs[i].style.width = Math.floor(arr[i].width/0.83) + 'px';
            childs[i].style.height = Math.floor(arr[i].height/0.83 + 10*i) + 'px';
            childs[i].style.backgroundImage = "url("+arr[i].src+")"; 
        }


        //随机飘落纸片
        function randoms()
        {   
            var number = Math.ceil(Math.random()*arr.length/4);
            var index = 0;

            for(let i=0;i<number;i++)
            {
                index = Math.floor(Math.random()*arr.length);

                childs[index].style[tool.prefixBrowserVersion('transition')] = "6s ease";
                childs[index].style[tool.prefixBrowserVersion('transform')] = "translate3d("+Math.floor(w*Math.random())+"px,"+Math.floor(h/0.82)+"px,0) rotate3d(0,0,1,"+Math.floor(360*Math.random())+"deg)";
                childs[index].style[tool.prefixBrowserVersion('opacity')] = 1;
                
                childs[index].addEventListener('transitionend',function(){
                    this.style[tool.prefixBrowserVersion('transition')] = '0s';
                    this.style[tool.prefixBrowserVersion('opacity')] = 1;
                    this.style[tool.prefixBrowserVersion('transform')] = "translate3d("+Math.floor(w*Math.random())+"px,"+ (0) +"px,0) rotate3d(0,0,1,0deg)";
                })
            }
        }
        
        this.colorSmallTimer = setInterval(randoms,3000);    
    }


    //初始化气球
    initballons(){
        var box = document.getElementById('balloonbox');
        var balls = this.datas.getBalloons();
        
        var str = '';
        var w = 0,h = 0,bg = '',l = 0,b = 0,time = 0;

        for(var i=0;i<balls.length;i++){
            w = Math.floor(balls[i].w/this.datas.multiple);
            h = Math.floor(balls[i].h/this.datas.multiple);
            l = Math.floor(Math.random()*( box.clientWidth - w));
            b = Math.floor(Math.random()*30);
            
            time  = 5 + Math.random()*i*0.3;

            str+= `<span class="ballItem ballItem${i}"  style="background-image:url('${balls[i].src}');width:${w}px;height:${h}px;left:${l}px;bottom:${b}px;transform:translate3d(0,0,0) rotate3d(0,0,1,0deg);transition:${time}s ease;"></span>`;
        }

        for(var i=0;i<balls.length;i++){
            w = Math.floor(balls[i].w/this.datas.multiple);
            h = Math.floor(balls[i].h/this.datas.multiple);
            l = Math.floor(Math.random()*( box.clientWidth - w));
            b = -600 - Math.floor(Math.random()*30);
            
            time  = 5 + Math.random()*i*0.3;

            str+= `<span class="ballItem ballItem${i}"  style="background-image:url('${balls[i].src}');width:${w}px;height:${h}px;left:${l}px;bottom:${b}px;transform:translate3d(0,0,0) rotate3d(0,0,1,0deg);transition:${time}s ease;"></span>`;
        }

        box.innerHTML = str;
    }


    //气球往上飞
    flyballs(){
        var box = document.getElementById('balloonbox');
        var balls = this.tool.getItems('balloonbox','ballItem');
        var x = 0,y = 0,z = 0,a = 0;

        for(var i=0;i<balls.length;i++){
            x = Math.floor(box.offsetWidth*Math.random()*(Math.random()>0.5 ? 1 : -1));
            if(i < balls.length/2){
                y = -1*Math.floor(box.offsetHeight+300);
            }else{
                y = -1*Math.floor(box.offsetHeight+300) - 600;
                if(y > - (box.offsetHeight - balls[i] )){
                    y = - (box.offsetHeight - balls[i] ) - 100;
                }
            }
            
            z = Math.floor(20*Math.random()*(Math.random()>0.5 ? 1 : -1));
            a =  Math.floor(120*Math.random()*(Math.random()>0.5 ? 1 : -1));
            balls[i].style[this.tool.prefixBrowserVersion('transform')] =`translate3d(${x}px,${y}px,${z}px) rotate3d(0,0,1,${a}deg)`;
        }
    }

    //翻转banner card
    cardbox(){
        var cardbox = document.getElementById('cardbox');
        
        cardbox.style[this.tool.prefixBrowserVersion('transition')] = "2.8s ease";
        cardbox.style[this.tool.prefixBrowserVersion('transform')] = "rotate3d(1,0,0,90deg)"
    }       
    
    //播放canvas    
    playcanvas(){
        
        var box = document.getElementById('logocanvasbox');
        var canvas = document.getElementById('logoparticle');
        var video = document.getElementById('logoVideo');

        var dur = video.duration;
        var time = 0;
        var timer = null;
        var This = this;
        var w = Math.ceil(1858/This.datas.multiple);
        var h = Math.ceil(826/This.datas.multiple);
        var ts = 20;

        canvas.setAttribute('width',w);
        canvas.setAttribute('height',h);

        var ctx = canvas.getContext('2d');
        video.play();
        
        video.addEventListener('play',function(){
            dur = this.duration;
            timer = setInterval(()=>{
                time += ts;
                if( time > 5400 ){
                    clearInterval(timer);
                    return;
                }
                ctx.drawImage(this,0,0,w,h);
            },ts)
        })

       
    }
}