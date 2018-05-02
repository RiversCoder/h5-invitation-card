class Tool{
    construct(){
        this.version = '';
    }

    checkVersion(){
        let elemStyke = document.createElement('div').style;

        //获取可用浏览器版本属性
        var version = (()=>{

          let vers = {
            webkit: 'webkitTransformt',
            moz: 'mozTransform',
            o: 'oTransform',
            ms: 'msTransform',
            standard: 'transform'
          }

          for(let key in vers){
            if(elemStyke[vers[key]] !== undefined){
              return key;
            }
          }
          
          return false;

        })()

        return version;
    }

    prefixBrowserVersion(styles){

      this.version = this.checkVersion();

      if(this.version === false){
        return false
      }

      if(this.version === 'standard'){
        return styles
      }
      
      return this.version + styles.charAt(0).toUppercase() + styles.substr(1);
    }

    animate(elem, animation_name, count, delay) {
        var x = elem;
        var timer = null;
        timer = setInterval( function() {
            x.className += " animated " + animation_name;
            x.addEventListener("animationend", function(){
                //x.className = x.className.replace(" animated " + animation_name, "");
            });
            count --;
            if( count <= 0 ) {
                clearInterval( timer );
            }
        }, delay)
    }

    removeArrItem(arr,item){
        for(var i=0;i<arr.length;i++){
            if(i == item){
                arr.splice(i,1);
            }
        }
    }

    getStyle(element, attr){
      if(element.currentStyle){
        return element.currentStyle[attr];
      }else{
        return window.getComputedStyle(element,null)[attr];
      }
    }

    getItems(id,classname){
        var box = document.getElementById(id);
        var items = box.getElementsByClassName(classname);

        return items;
    }

    addZoom(num,len){
        //1.判断位数
        var str = num + '';
        var cl = str.length;

        if(str.length < len){

            //1.补零
            while (str.length < len)
            {
                str = '0' + str;
            }

            return str;
        }else{
            return num;
        }

    }

    

/*
    animate(elem,animation_name, count, delay,styles) {
        var x = elem;
        var timer = null;
        timer = setInterval( function() {
            x.className += " animated " + animation_name;
            x.addEventListener("animationend", function(){
            //x.className = x.className.replace(" animated " + animation_name, "");
                //styles && elem.style.opacity = 1;
            });
            count --;
            if( count <= 0 ) {
                clearInterval( timer );
            }
        }, delay)
    }*/
}