# vue-admin-sidebar

A Vue.js admin sidbar component

## Installation

```
npm i vue-admin-sidebar
```

Install the plugin globally.

```js
//main.js
import Vue from 'vue'
import VueAdminSidebar from 'vue-admin-sidebar'
Vue.use(VueAdminSidebar)
```

Or import the component locally.

```js
//App.vue
import { VueAdminSidebar } from 'vue-admin-sidebar'
export default {
  components: {
    VueAdminSidebar
  }
}
```

## Basic Usage

```html
<template>
  <vue-admin-sidebar :menu="menu" />
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
                        href: '/users',
                        title: 'User',
                        icon: 'fa fa-user',
                        child: [
                            {
                                href: '/users/sublink',
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
            class: 'vsm--badge_default'
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

    // Sidebar Collapse state and width
    collapsed: {
        type: Object,
        default: () => ({ value: false, width: "50px" }),
    },

    // Sidebar width (expanded)
    width: {
      type: String,
      default: '350px'
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
.v-sidebar-menu .vsm--badge {}
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
@import "vue-admin-sidebar/src/scss/vue-admin-sidebar.scss";
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

# Credits

* [vue-sidebar-menu](https://github.com/yaminncco/vue-sidebar-menu.git)

