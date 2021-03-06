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
        config.timeout=Number(config.timeout);
        this.config=config;
        
        this.header_names={};
        
        var headers=this.config.headers;
        this.config.headers={};
        this.header(headers);
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
                var l_name=name.toLowerCase();
                if(this.header_names[l_name]){
                    this.config.headers[this.header_names[l_name]]=value;
                }else{
                    this.config.headers[this.header_names[l_name]=name]=value;
                }
            }else{
                var self=this;
                $.each(name,function(name,value){
                    this.header(name,value);
                });
            }
            return this;
        },
        auth:function(username,password){
            if(username && password){
                this.config.username=username;
                this.config.password=password;
            }else{
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
        },
        timeout:function(timeout){
            this.config.timeout=Number(timeout);
            return this;
        },
        responseType:function(type){
            this.config.responseType=type;
            return this;
        }
    });
    $.Request._default={
        type:"GET",
        data:null,
        async:true,
        headers:{},
        username:null,
        password:null,
        timeout:0,
        responseType:""
    };
    
    $.Request.param=function(data){
        if(!data){
            return "";
        }
        if(
            typeof data=="string" ||
            data instanceof ArrayBuffer ||
            data instanceof Blob ||
            data instanceof Document ||
            data instanceof FormData ||
            ArrayBuffer.isView(data)
        ){
            return data;
        }
        var arr=[];
        $.each(data,function(key,value){
            arr.push(encodeURIComponent(key)+"="+encodeURIComponent(value));
        });
        return arr.join("&");
    };
    
    var Response=Class(function(xhr){
        this.xhr=xhr;
    }).method({
        auto:function(){
            return this.xhr.response;
        },
        text:function(){
            return this.xhr.responseText;
        },
        xml:function(){
            return this.xhr.responseXML;
        },
        json:function(){
            if(this.xhr.responseType=="json"){
                return this.xhr.response;
            }else{
                return JSON.parse(this.xhr.responseText);
            }
        },
        header:function(name){
            if(name){
                return this.xhr.getResponseHeader(name);
            }else{
                return this.xhr.getAllResponseHeaders();
            }
        },
        get status(){
            return this.xhr.status;
        },
        get statusText(){
            return this.xhr.statusText;
        }
    });
    
    var RequestError=Class(function(xhr){
        this.xhr=xhr;
    }).method({
        get status(){
            return this.xhr.status;
        },
        get statusText(){
            return this.xhr.statusText;
        }
    });
    
    $.load=function(req,config){
        if(Array.isArray(req)){
            var list=req.map(function(item){
                return $.load(item,config);
            });
            var promise=Promise.all(list);
            promise.abort=$.Delegate(list.map(function(item){
                return item.abort;
            })).call;
            return promise;
        }
        
        if(typeof req=="string"){
            req=$.Request(req,config);
        }
        
        var defer=Promise.defer();
        
        var xhr=new XMLHttpRequest();
        xhr.onload=function(){
            defer.resolve(Response(xhr));
        };
        xhr.onerror=function(){
            defer.reject(RequestError(xhr));
        };
        
        defer.promise.abort=function(){
            xhr.abort();
        };
        
        config=req.config;
        var no_content=(config.type=="GET" || config.type=="HEAD");
        var url=req.url;
        
        if(no_content){
            if(typeof config.data!="string"){
                throw new TypeError("data must be string.");
            }
            url=concat_param(url,config.data);
        }
        
        if(config.timeout){
            xhr.timeout=config.timeout;
        }
        
        if(config.responseType){
            xhr.responseType=config.responseType;
        }
        
        if(config.username && config.password){
            xhr.open(config.type,url,config.async,config.username,config.password);
        }else{
            xhr.open(config.type,url,config.async);
        }
        
        xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
        if(
            !no_content && typeof config.data=="string" &&
            !config.headers[req.header_names["Content-Type".toLowerCase()]]
        ){
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
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
