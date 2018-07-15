# vue-pswipe
a Vue plugin for photoswipe without set image size

## example online
[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/38q57m2o26)

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

you can use default slot, it will render img with src
```html
<!-- someComponent.vue -->
<Photoswipe>
    <PhotoswipeItem :src="imageSrc" />
</Photoswipe>
```

or you can use background-image instead of img, and **image-item class is necessary for background-image**, because its use for identified as thumbnail image element 
```html
<!-- someComponent.vue -->
<Photoswipe>
    <PhotoswipeItem :src="imageSrc">
        <div 
            class="image-item"
            :style="getBgImgStyle(src)"
        >
    </PhotoswipeItem>
</Photoswipe>
```

## props
Photoswipe 

| property | type | explain |
| --- | --- | --- |
| options | Object | original photoswipe options |

[complete options](http://photoswipe.com/documentation/options.html)

PhotoswipeItem

| property | type | explain |
| --- | --- | --- |
| src | String | image src |

## example
```
npm run dev
```