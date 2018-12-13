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

Vue.use(Photoswipe, options)
```
[complete options](http://photoswipe.com/documentation/options.html)

you should set `data-pswp-src` to prefetch image size
```vue
<Photoswipe>
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

if you dont want collect all img under auto mode, you can set filter props
```vue
<Photoswipe auto :filter="(img) => img.parentNode.tagName !== 'A'">
    <img :src="imageSrc" />
</Photoswipe>
```

The above example filters the all img in a tags

## props
Photoswipe 

| property | type | explain |
| --- | --- | --- |
| options | object | original photoswipe options |
| auto | boolean | auto initial without data-pswp-src |
| bubble | boolean | allow click event bubbling, default is false |
| filter | function | a filter function that accept img as argument, only work in auto mode |

[complete options](http://photoswipe.com/documentation/options.html)

## example
```
npm run dev
```