Invoke.js
=========

A JavaScript Library.

**Warning: this library is incomplete.**

License
-------

MIT License

Requirements
------------

- [jakearchibald/es6-promise](https://github.com/jakearchibald/es6-promise)

Browser Support
---------------

| Browser                        | Version |
| :----------------------------- | ------: |
| Internet Explorer              |     11+ |
| Chrome, Firefox, Safari, Opera |  latest |

Modules
-------

- **Core**
- **Request** - ajax
- **Event** - event model

### Core (core.js)

```javascript
- function Class(ctor) // create a new class
- function Class.extend(extend,ctor)

- function $.remove(arr,value)
- function $.each(obj,cb)
- function $.mix(obj,mix)
- class $.Delegate(list)
  - method .call(...)
  - method .add(fn)
  - method .remove(fn)
```

**Examples**

```javascript
var Animal=Class(function(name){
    this.name=name;
}).method({
    speak:function(things){
        return "My name is "+this.name+" and I like "+things;
    }
});

var nemo=Animal("Nemo");
nemo.speak("swimming");
// -> "My name is Nemo and I like swimming"

var Dog=Class.extend(Animal,function(name){
    this.super(name);
}).method({
    speak:function(stuff){
        return this.super.invoke(this,"speak",stuff).toUpperCase()+"!";
    }
});

var rex=Dog("Rex");
rex.speak("barking");
// -> "MY NAME IS REX AND I LIKE BARKING!"
```

```javascript
$.remove([1,2,3],2);
// -> [1,3]

// only the first matched item will be removed
$.remove([4,6,9,4,2,1],4);
// -> [6,9,4,2,1]

$.each({
    a:1,
    b:2
},function(key,value){
    console.log(key,value);
});
// "a" 1
// "b" 2

$.mix({},{name:"test"});
// -> {name:"test"}

$.mix({age:16},{age:20});
// -> {age:20}

$.mix({},[{name:"test"},{age:30}]);
// -> {name:"test",age:30}

var delegate=$.Delegate([function(){
    console.log(1);
},function(){
    console.log(2);
}]);
delegate.add(function(){
    console.log(3);
});
delegate.add(function(name){
    console.log(name);
});

delegate.length;
// -> 4

delegate.call("test");
// 1
// 2
// 3
// "test"

var fn=delegate.call;
fn();
// also be ok.
```
