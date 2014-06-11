(function($){
    $.Event=Class(function(type,data){
        this.type=type;
        this.data=data;
    }).method({
        mix:function(obj){
            return $.mix(this,obj);
        }
    });
    
    $.EventModel=Class(function(){
        this.listeners={};
    }).method({
        on:function(type,func){
            if(typeof type=="string"){
                this.listeners[type] || (this.listeners[type]=$.Delegate());
                this.listeners[type].add(func);
            }else if(Array.isArray(type)){
                type.forEach(function(type){
                    this.on(type,func);
                },this);
            }else{
                $.each(type,function(type,func){
                    this.on(type,func);
                },this);
            }
            return this;
        },
        off:function(type,func){
            if(typeof type=="string"){
                if(func){
                    this.listeners[type] && this.listeners[type].remove(func);
                }else{
                    delete this.listeners[type];
                }
            }else if(Array.isArray(type)){
                type.forEach(function(type){
                    this.off(type,func);
                },this);
            }else{
                $.each(type,function(type,func){
                    this.off(type,func);
                },this);
            }
            return this;
        },
        once:function(type,func){
            if(typeof type=="string" || Array.isArray(type)){
                this.on(type,function wrap(event){
                    func.call(this,event);
                    this.off(type,wrap);
                });
            }else{
                $.each(type,function(type,func){
                    this.once(type,func);
                },this);
            }
            return this;
        },
        trigger:function(type,data){
            if(typeof type=="string"){
                this.listeners[type].call.call(this,$.Event(type,data));
            }else{
                this.listeners[type.type].call.call(this,type);
            }
            return this;
        }
    });
})($);