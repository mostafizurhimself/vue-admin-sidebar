# vue-sidebar-menu

A Vue.js Sidebar Menu Component

## Demo

[vue-sidebar-menu-demo](https://yaminncco.github.io/vue-sidebar-menu/)

### This documentation is for Vue 2, for Vue 3 you can try the prerelease see [here](https://github.com/yaminncco/vue-sidebar-menu/tree/next)

## Installation

```
npm i vue-sidebar-menu --save
```

Install the plugin globally.

```js
//main.js
import Vue from 'vue'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)
```

Or import the component locally.

```js
//App.vue
import { SidebarMenu } from 'vue-sidebar-menu'
export default {
  components: {
    SidebarMenu
  }
}
```

## Basic Usage

```html
<template>
  <sidebar-menu :menu="menu" />
</template>

<script>
    export default {
        data() {
            return {
                menu: [
                    {
                        header: true,
                        title: 'Main Navigation',
                        hiddenOnCollapse: true
                    },
                    {
                        href: '/',
                        title: 'Dashboard',
                        icon: 'fa fa-user'
                    },
                    {
                        href: '/charts',
                        title: 'Charts',
                        icon: 'fa fa-chart-area',
                        child: [
                            {
                                href: '/charts/sublink',
                                title: 'Sub Link'
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
```

### Item Properties

```js
menu [
    // item
    {
        href: '/',
        /* with vue-router you can use :to prop
        href: { path: '/' }
        you can mark link as external
        // external: true
        */
       
        title: 'Dashboard',

        // icon class
        icon: 'fa fa-user'
        /* or custom icon
        icon: {
            element: 'span',
            class: 'fa fa-user',
            // attributes: {}
            // text: ''
        }
        */

        /*
        badge: {
            text: 'new',
            class: 'vas--badge_default'
            // attributes: {}
            // element: 'span'
        }
        */
        
        // child: []
        // disabled: true
        // class: ''
        // attributes: {}
        // exactPath: true // match path only (ignore query and hash)
        // alias: '/path' // or array of paths (for advanced matching patterns see: https://github.com/pillarjs/path-to-regexp/tree/v1.7.0#parameters)
        // hidden: false
        // hiddenOnCollapse: true
    },

    // header item
    {
        header: true,
        title: 'Main Navigation'
        // hidden: false
        // hiddenOnCollapse: true
        // class: ''
        // attributes: {}
    },

    // component item
    {
        component: componentName
        // props: componentProps
        // hidden: false
        // hiddenOnCollapse: true
    }
]
```

### Vue-router Support

if you are using vue-router, `<router-link>` will be used instead of hyperlink `<a>`

### Props

```js
props: {
    // Sidebar menu (required)
    menu: {
      type: Array,
      required: true
    },

    // Sidebar Collapse state
    collapsed: {
      type: Boolean,
      default: false
    },

    // Sidebar width (expanded)
    width: {
      type: String,
      default: '350px'
    },

    // Sidebar width (collapsed)
    widthCollapsed: {
      type: String,
      default: '50px'
    },

    // Keep only one child opened at a time (first level only)
    showOneChild: {
      type: Boolean,
      default: false
    },

    // Keep all child open
    showChild: {
      type: Boolean,
      default: false
    },

    // Sidebar right to left
    rtl: {
      type: Boolean,
      default: false
    },

    // Make sidebar relative to the parent (by default the sidebar is relative to the viewport)
    relative: {
      type: Boolean,
      default: false
    },

    // Hide toggle collapse btn
    hideToggle: {
      type: Boolean,
      default: false
    },

    // Sidebar theme (available themes: 'white-theme')
    theme: {
      type: String,
      default: ''
    },

    // Disable hover on collapse mode
    disableHover: {
      type: Boolean,
      default: false
    }
}
```

### Events

```html
<sidebar-menu @toggle-collapse="onToggleCollapse" @item-click="onItemClick" />
...
methods: {
    onToggleCollapse(collapsed) {},
    onItemClick(event, item, node) {}
}
...
```

__@toggle-collapse(collapsed)__ Trigger on toggle btn click

__@item-click(event, item, node)__ Trigger on item link click

### Styles

All styles customization can be done in normal CSS by using this classes

```css
.v-sidebar-menu {}
.v-sidebar-menu.vas_expanded {}
.v-sidebar-menu.vas_collapsed {}
.v-sidebar-menu.vas_rtl {}
.v-sidebar-menu .vas--item {}
.v-sidebar-menu .vas--item.vas--item_open {}
.v-sidebar-menu .vas--link {}
.v-sidebar-menu .vas--link.vas--link_active {}
.v-sidebar-menu .vas--link.vas--link_exact-active {}
.v-sidebar-menu .vas--link.vas--link_mobile-item {}
.v-sidebar-menu .vas--link.vas--link_level-[n] {}
.v-sidebar-menu .vas--link.vas--link_disabled {}
.v-sidebar-menu .vas--title {}
.v-sidebar-menu .vas--icon {}
.v-sidebar-menu .vas--arrow {}
.v-sidebar-menu .vas--arrow.vas--arrow_open {}
.v-sidebar-menu .vas--badge {}
.v-sidebar-menu .vas--header {}
.v-sidebar-menu .vas--list {}
.v-sidebar-menu .vas--dropdown>.vas--list {}
.v-sidebar-menu .vas--mobile-item {}
.v-sidebar-menu .vas--mobile-bg {}
.v-sidebar-menu .vas--toggle-btn {}
```

or you can override Sass variables (complete list of all variables can be found in `src/scss/_variables.scss`) and create your own theme

```scss
@import "custom-var.scss";
@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";
```

### Customize Toggle & Dropdown Icons

The component use `Font Awesome 5 Free` as default, but you can either customize them using slots or by overriding css style

## Slots

```html
<sidebar-menu>
    <div slot="header">header</div>
    <div slot="footer">footer</div>
    <span slot="toggle-icon">toggle-icon</span>
    <span slot="dropdown-icon">dropdown-icon</span>
</sidebar-menu>
```

## Development

```
npm install
npm run dev
```
