(function($){
    var concat_param=function(url,data){
        if(data){
            return url+(/\?/.test(url)?"&":"?")+data;
        }else{
            return url;
        }
    };
    
    $.Request=Class(function(url,config){
        this.url=url;
        
        config=$.mix({},[$.Request._default,config]);
        config.data=$.Request.param(config.data);
        config.async=!!config.async;
        config.headers=$.mix({},[$.Request._default.headers,config.headers]);
        if(config.username && config.password){
            config.auth=true;
        }
        this.config=config;
    }).method({
        type:function(type){
            this.config.type=type;
            return this;
        },
        data:function(data){
            this.config.data=$.Request.param(data);
            return this;
        },
        async:function(async){
            this.config.async=!!async;
            return this;
        },
        header:function(name,value){
            if(typeof name=="string"){
                this.config.headers[name]=value;
            }else{
                $.mix(this.config.headers,name);
            }
            return this;
        },
        auth:function(username,password){
            if(username && password){
                this.config.auth=true;
                this.config.username=username;
                this.config.password=password;
            }else{
                this.config.auth=false;
                this.config.username=null;
                this.config.password=null;
            }
            return this;
        },
        contentType:function(value){
            this.header("Content-Type",value);
            return this;
        },
        // append param
        append:function(param){
            param=$.Request.param(param);
            if(this.config.data && param){
                this.config.data+="&"+param;
            }else if(param){
                this.config.data=param;
            }
            return this;
        }
    });
    
    $.Request._default={
        type:"GET",
        data:null,
        async:true,
        headers:{
            "X-Requested-With":"XMLHttpRequest",
            "Content-Type":"application/x-www-form-urlencoded"
        },
        auth:false,
        username:null,
        password:null
    };
    $.Request.config=function(name,value){
        this._default[name]=value;
    };
    $.Request.config.header=function(name,value){
        this._default.headers[name]=value;
    };
    
    $.Request.param=function(data){
        if(!data){
            return "";
        }
        if(typeof data=="string" || data instanceof FormData){
            return data;
        }
        var arr=[];
        $.each(data,function(key,value){
            arr.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
        });
        return arr.join("&");
    };
    
    $.load=function(req){
        if(Array.isArray(req)){
            var list=req.map(function(item){
                return $.load(item);
            });
            var promise=Promise.all(list);
            promise.abort=$.Delegate(list.map(function(item){
                return item.abort;
            })).call;
            return promise;
        }
        if(typeof req=="string"){
            req=$.Request(req);
        }
        var defer=Promise.defer();
        
        var xhr=new XMLHttpRequest();
        xhr.onload=function(){
            defer.resolve(xhr);
        };
        xhr.onerror=function(){
            defer.reject(xhr);
        };
        
        defer.promise.abort=function(){
            xhr.abort();
        };
        
        var config=req.config;
        var no_content=(config.type=="GET" || config.type=="HEAD");
        
        var url=req.url;
        if(no_content){
            url=concat_param(url,config.data);
        }
        
        if(config.auth){
            xhr.open(config.type,url,config.async,config.username,config.password);
        }else{
            xhr.open(config.type,url,config.async);
        }
        
        $.each(config.headers,function(key,value){
            xhr.setRequestHeader(key,value);
        });
        
        if(no_content){
            xhr.send();
        }else{
            xhr.send(config.data);
        }
        
        return defer.promise;
    };
    $.Request.method({
        send:function(){
            return $.load(this);
        }
    });
})($);
