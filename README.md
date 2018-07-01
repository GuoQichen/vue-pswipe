# vue-pswipe
a Vue plugin for photoswipe

## install
```
npm install vue-pswipe
```

## usage

```js
// main.js
import Photoswipe from 'vue-pswipe'
import Vue from 'vue'

Vue.use(Photoswipe)
```

you can pass imageList directly, each item is image path
```html
<!-- component.vue -->
<Photoswipe :imageList="imageList" />
```

or you can use scoped-slot
```html
<!-- component.vue -->
<Photoswipe :imageList="imageList">
    <template slot-scope="{ src }"> 
        <img :src="src" />
    </template>
</Photoswipe>
```
slot-scope property

| property | type | explain |
| --- | --- | --- |
| item | string or object | origin item in imageList |
| index | number | index of imageList item |
| src | string | image path, item of imageList |
| size | string | eg: 640x480, width x height |

or you can use other element than img, then you can set src as background-image
```html
<!-- component.vue -->
<Photoswipe :imageList="imageList">
    <template slot-scope="{ src }"> 
        <div class="image-item" :style="{ backgroundImage: `url(${src})` }" />
    </template>
</Photoswipe>
```

**Caveat:** if you set src as background-image, then image-item class is necessary for correspond element

## discontinue image
vue-pswipe will detect item.src, if item is object and item contain src field, then slots will be render as ImageItem component, otherwise slots will render directly. you could goto demo for detail

## component api
props

| property | type | explain |
| --- | --- | --- |
| imageList | array | image item could be a path or object contain other field |
| options | object | original photoswipe options |
| inline | boolean | add `display: inline-block;` to image-wrapper, deafult: false |

slots

use scoped slot to define how image present, other slot will be append to image list

## example
```
npm run dev
```
