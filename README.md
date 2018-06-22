# vue-pswipe
a Vue plugin for photoswipe

## install
```
npm install v-pswipe
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
    <template slot-scope="{ image }"> 
        <img :src="image.src" />
    </template>
</Photoswipe>
```
image property

| property | type | explain |
| --- | --- | --- |
| src | string | image path, item of imageList |
| size | string | eg: 640x480, width x height |

or you can use other element than img, then you can set src as background-image
```html
<!-- component.vue -->
<Photoswipe :imageList="imageList">
    <template slot-scope="{ image }"> 
        <div class="image-item" :style="{ backgroundImage: `url(${image.src})` }" />
    </template>
</Photoswipe>
```

**Caveat:** if you set src as background-image, then image-item class is necessary for correspond element

## example
```
npm run dev
```
