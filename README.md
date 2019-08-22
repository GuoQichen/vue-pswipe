# vue-pswipe ![npm](https://img.shields.io/npm/v/vue-pswipe) [![Build Status](https://travis-ci.com/GuoQichen/vue-pswipe.svg?branch=master)](https://travis-ci.com/GuoQichen/vue-pswipe) [![codecov](https://codecov.io/gh/GuoQichen/vue-pswipe/branch/master/graph/badge.svg)](https://codecov.io/gh/GuoQichen/vue-pswipe)
a Vue plugin for PhotoSwipe without set image size

## online example
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
see [complete options](http://photoswipe.com/documentation/options.html)

you can set `v-pswp` directive in element to mark as clickable
```vue
<Photoswipe>
    <img 
        :src="imageSrc"
        v-pswp="imageSrc"
    />
</Photoswipe>
```

## props

| Property | Type | Description | Default |
| --- | --- | --- | --- |
| options | object | original PhotoSwipe options, see [complete options](http://photoswipe.com/documentation/options.html) | - | 
| auto | boolean | automatically collect all img tags without the need for the `v-pswp` directive | false |
| bubble | boolean | allow click event bubbling | false |
| lazy | boolean | lazy loading image, you can set to false to preload all image | true |
| rotate | boolean | add a rotate action button to the top bar, allow user to rotate the current image | false |

## directive

### `v-pswp: object|string`
use for mark current element as gallery item, accept **image src** or **options object**

Directive Options:
```typescript
interface PswpDirectiveOptions {
    /**
     * path to image
     */
    src: string
    /**
     * image size, 'width x height', eg: '100x100'
     */
    size?: string
    /**
     * small image placeholder,
     * main (large) image loads on top of it,
     * if you skip this parameter - grey rectangle will be displayed,
     * try to define this property only when small image was loaded before
     */
    msrc?: string
    /**
     * used by Default PhotoSwipe UI
     * if you skip it, there won't be any caption
     */
    title?: string
    /**
     * to make URLs to a single image look like this: http://example.com/#&gid=1&pid=custom-first-id
     * instead of: http://example.com/#&gid=1&pid=1
     * enable options history: true, galleryPIDs: true and add pid (unique picture identifier) 
     */
    pid?: string | number
}
```

## event

### `beforeOpen`
emit after click thumbnail, if listen to this event, **`next` function must be called to resolve this hook**

Parameters: 
- `event`:
    - `index`: current image index
    - `target`: the target that triggers effective click event
- `next`: 

    must be called to resolve the hook. `next(false)` will abort open PhotoSwipe

### `opened`
emit after photoswipe init, you can get current active photoswipe instance by parameter

Parameters:
- `pswp`:

    current photoswipe instance

### original PhotoSwipe event
**support all original PhotoSwipe events**, see [original event](https://github.com/dimsemenov/PhotoSwipe/blob/master/website/documentation/api.md#events), eg: 
```vue
<Photoswipe @beforeChange="handleBeforeChange">
    <img 
        :src="imageSrc"
        v-pswp="imageSrc"
    />
</Photoswipe>
```

## example
```
npm run dev
```

## License
[MIT](http://opensource.org/licenses/MIT)