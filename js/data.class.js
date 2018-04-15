class Datas{
    constructor(){
        this.multiple = 0.83;
    }

    getColorDatas(){
        let papers=[{src:"./images/slip/paper1.png",w:40,h:33,left:0,top:0},{src:"./images/slip/paper2.png",w:23,h:28,left:0,top:0},{src:"./images/slip/paper3.png",w:30,h:28,left:0,top:0},{src:"./images/slip/paper4.png",w:25,h:45,left:0,top:0},{src:"./images/slip/paper5.png",w:52,h:52,left:0,top:0},{src:"./images/slip/paper6.png",w:103,h:140,left:0,top:0},{src:"./images/slip/paper7.png",w:17,h:26,left:0,top:0},{src:"./images/slip/paper8.png",w:23,h:35,left:0,top:0},{src:"./images/slip/paper9.png",w:26,h:24,left:0,top:0},{src:"./images/slip/paper10.png",w:36,h:45,left:0,top:0},{src:"./images/slip/paper11.png",w:32,h:47,left:0,top:0},{src:"./images/slip/paper12.png",w:47,h:29,left:0,top:0},{src:"./images/slip/paper13.png",w:25,h:39,left:0,top:0}];

        return papers;
    }

    getSlidePostions(){
        let postions = [{
            x1: 380, x2: 610},{
            x1: 680, x2: 910},{
            x1: 980, x2: 1210},{
            x1: 1280, x2: 1510},{
            x1: 1580, x2: 1810},{
            x1: 1880, x2: 2110}];

        let centerY = { y1: 500, y2: 600 };

        //合并对象
        for(let i=0;i<postions.length;i++)
        {
            Object.assign(postions[i], centerY);
        }   

        return postions;    
    }
}