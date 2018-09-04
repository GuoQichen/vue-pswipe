# vue-pswipe
a Vue plugin for photoswipe without set image size

## example online
[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/619x48656r)

## install
```
npm install vue-pswipe
```

## usage

```js
// main.js
import Photoswipe from 'vue-pswipe'
import Vue from 'vue'

Vue.use(Photoswipe, options)
```
[complete options](http://photoswipe.com/documentation/options.html)

```vue
<Photopswipe>
    <img 
        :src="imageSrc"
        :data-pswp-src="imageSrc"
    />
</Photoswipe>
```

or you can use background-image instead of img tag
```vue
<Photoswipe>
    <div 
        :data-pswp-src="imageSrc"
        :style="getBgImgStyle(imageSrc)"
    >
</Photoswipe>
```

or you can set auto props, then vue-pswipe will collect all img tag
```vue
<Photoswipe auto>
    <img :src="imageSrc" />
</Photoswipe>
```

## props
Photoswipe 

| property | type | explain |
| --- | --- | --- |
| options | object | original photoswipe options |
| auto | boolean | auto initial without data-pswp-src |

[complete options](http://photoswipe.com/documentation/options.html)

## example
```
npm run dev
```