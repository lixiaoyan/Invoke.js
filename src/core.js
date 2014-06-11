if(typeof global=="undefined"){
    window.global=window;
}

/* jshint proto:true */
(function(){
    "use strict";
    
    if(!Object.getPrototypeOf){
        Object.getPrototypeOf=function(obj){
            return obj.__proto__;
        };
    }
    if(!Object.setPrototypeOf){
        Object.setPrototypeOf=function(obj,proto){
            obj.__proto__=proto;
            return obj;
        };
    }
})();
/* jshint proto:false */

(function(exports){
    "use strict";
    
    var __blank__=function(){
        this.super.apply(this,arguments);
    };
    
    var __mix__=function(obj,mix){
        Object.getOwnPropertyNames(mix).forEach(function(name){
            Object.defineProperty(obj,name,Object.getOwnPropertyDescriptor(mix,name));
        });
    };
    
    var __Class__=function(ctor,extend){
        ctor=ctor || __blank__;
        extend=extend || Object;
        var cls=function(){
            if(this instanceof cls){
                return cls.prototype.__ctor__.apply(this,arguments);
            }else{
                var obj=Object.create(cls.prototype);
                var ret=cls.apply(obj,arguments);
                if(ret && typeof ret=="object"){
                    return ret;
                }
                return obj;
            }
        };
        Object.setPrototypeOf(cls,extend);
        Object.setPrototypeOf(cls.prototype,extend.prototype);
        cls.prototype.__ctor__=ctor;
        cls.prototype.__extend__=extend;
        cls.prototype.super=extend;
        return cls;
    };
    
    var __Base__=__Class__();
    __Base__.method=function(obj){
        __mix__(this.prototype,obj);
        return this;
    };
    // var ret=this.super.invoke(this,"method",args...);
    // var ret=SuperClass.invoke(this,"method",args...);
    __Base__.invoke=function(ctx,name){
        return this.prototype[name].apply(ctx,Array.prototype.slice.call(arguments,2));
    };
    
    var __ArrayBase__=__Class__(null,Array);
    __ArrayBase__.method=__Base__.method;
    __ArrayBase__.invoke=__Base__.invoke;
    
    var Class=function(ctor){
        return __Class__(ctor,__Base__);
    };
    Class.extend=function(extend,ctor){
        if(!extend){
            extend=__Base__;
        }else if(extend==Object){
            extend=__Base__;
        }else if(extend==Array){
            extend=__ArrayBase__;
        }
        return __Class__(ctor,extend);
    };
    
    exports.Class=Class;
})(global);

(function(Promise){
    if(!Promise.defer){
        Promise.defer=function(){
            var ret={};
            ret.promise=new Promise(function(resolve,reject){
                ret.resolve=resolve;
                ret.reject=reject;
            });
            return ret;
        };
    }
})(Promise);

(function(exports){
    var $={};
    
    $.remove=function(arr,value){
        for(var i=0;i<arr.length;i++){
            if(arr[i]===value){
                arr.splice(i,1);
                break;
            }
        }
        return arr;
    };
    
    $.each=function(obj,cb){
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                cb(key,obj[key]);
            }
        }
    };
    $.mix=function(obj,mix){
        if(Array.isArray(mix)){
            mix.forEach(function(item){
                $.mix(obj,item);
            });
        }else{
            $.each(mix,function(key,value){
                obj[key]=value;
            });
        }
        return obj;
    };
    
    $.Delegate=Class(function(list){
        if(list){
            this.list=list.slice(0);
        }else{
            this.list=[];
        }
        
        this.call=this.call.bind(this);
    }).method({
        call:function(){
            var args=arguments;
            this.list.forEach(function(fn){
                fn.apply(null,args);
            });
        },
        add:function(fn){
            this.list.push(fn);
        },
        remove:function(fn){
            $.remove(this.list,fn);
        },
        get length(){
            return this.list.length;
        }
    });
    
    exports.$=$;
})(global);
