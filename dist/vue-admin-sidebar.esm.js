/**
 * Expose `pathtoRegexp`.
 */
var pathToRegexp = pathtoRegexp;

/**
 * Match matching groups in a regular expression.
 */
var MATCHING_GROUP_REGEXP = /\((?!\?)/g;

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Object} options
 * @return {RegExp}
 * @api private
 */

function pathtoRegexp(path, keys, options) {
  options = options || {};
  keys = keys || [];
  var strict = options.strict;
  var end = options.end !== false;
  var flags = options.sensitive ? '' : 'i';
  var extraOffset = 0;
  var keysOffset = keys.length;
  var i = 0;
  var name = 0;
  var m;

  if (path instanceof RegExp) {
    while (m = MATCHING_GROUP_REGEXP.exec(path.source)) {
      keys.push({
        name: name++,
        optional: false,
        offset: m.index
      });
    }

    return path;
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    return new RegExp('(?:' + path.join('|') + ')', flags);
  }

  path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
    .replace(/\/\(/g, '/(?:')
    .replace(/([\/\.])/g, '\\$1')
    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional, offset) {
      slash = slash || '';
      format = format || '';
      capture = capture || '([^\\/' + format + ']+?)';
      optional = optional || '';

      keys.push({
        name: key,
        optional: !!optional,
        offset: offset + extraOffset
      });

      var result = ''
        + (optional ? '' : slash)
        + '(?:'
        + format + (optional ? slash : '') + capture
        + (star ? '((?:[\\/' + format + '].+?)?)' : '')
        + ')'
        + optional;

      extraOffset += result.length - match.length;

      return result;
    })
    .replace(/\*/g, function (star, index) {
      var len = keys.length;

      while (len-- > keysOffset && keys[len].offset > index) {
        keys[len].offset += 3; // Replacement length minus asterisk length.
      }

      return '(.*)';
    });

  // This is a workaround for handling unnamed matching groups.
  while (m = MATCHING_GROUP_REGEXP.exec(path)) {
    var escapeCount = 0;
    var index = m.index;

    while (path.charAt(--index) === '\\') {
      escapeCount++;
    }

    // It's possible to escape the bracket.
    if (escapeCount % 2 === 1) {
      continue;
    }

    if (keysOffset + i === keys.length || keys[keysOffset + i].offset > m.index) {
      keys.splice(keysOffset + i, 0, {
        name: name++, // Unnamed matching groups must be consistently linear.
        optional: false,
        offset: m.index
      });
    }

    i++;
  }

  // If the path is non-ending, match until the end or a slash.
  path += (end ? '$' : (path[path.length - 1] === '/' ? '' : '(?=\\/|$)'));

  return new RegExp(path, flags);
}

//
//
//
//
//
//
//
//
//
//
//
var script$4 = {
  name: 'SidebarMenuLink',
  props: {
    item: {
      type: Object,
      required: true
    },
    attributes: {
      type: Object,
      default: null
    }
  },
  computed: {
    isRouterLink() {
      return !!this.$router && this.item.href && !this.item.external;
    },

    tag() {
      return this.isRouterLink ? 'router-link' : 'a';
    },

    href() {
      if (!this.item.href) return '#';
      return this.item.href;
    },

    target() {
      if (this.item.external) return '_blank';
      return '_self';
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__$4 = script$4;
/* template */

var __vue_render__$4 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.tag, _vm._b({
    tag: "component",
    attrs: {
      "tabindex": _vm.item.disabled && -1,
      "target": _vm.target
    }
  }, 'component', [_vm.isRouterLink ? {
    to: _vm.href
  } : {
    href: _vm.href
  }, _vm.attributes], false), [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$4 = [];
/* style */

const __vue_inject_styles__$4 = undefined;
/* scoped */

const __vue_scope_id__$4 = undefined;
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
var script$3 = {
  name: 'SidebarMenuIcon',
  props: {
    icon: {
      type: [String, Object],
      default: ''
    }
  }
};

/* script */
const __vue_script__$3 = script$3;
/* template */

var __vue_render__$3 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.icon.element ? _vm.icon.element : 'i', _vm._b({
    tag: "component",
    staticClass: "vsm--icon",
    class: typeof _vm.icon === 'string' || _vm.icon instanceof String ? _vm.icon : _vm.icon.class
  }, 'component', _vm.icon.attributes, false), [_vm._v("\n  " + _vm._s(_vm.icon.text) + "\n")]);
};

var __vue_staticRenderFns__$3 = [];
/* style */

const __vue_inject_styles__$3 = undefined;
/* scoped */

const __vue_scope_id__$3 = undefined;
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
var script$2 = {
  name: 'SidebarMenuBadge',
  props: {
    badge: {
      type: Object,
      default: () => {}
    }
  }
};

/* script */
const __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c(_vm.badge.element ? _vm.badge.element : 'span', _vm._b({
    tag: "component",
    staticClass: "vsm--badge",
    class: _vm.badge.class
  }, 'component', _vm.badge.attributes, false), [_vm._v("\n  " + _vm._s(_vm.badge.text) + "\n")]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

//
var script$1 = {
  name: 'SidebarMenuItem',
  components: {
    SidebarMenuLink: __vue_component__$4,
    SidebarMenuIcon: __vue_component__$3,
    SidebarMenuBadge: __vue_component__$2
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    isCollapsed: {
      type: Boolean
    },
    isMobileItem: {
      type: Boolean,
      default: false
    },
    mobileItem: {
      type: Object,
      default: null
    },
    activeShow: {
      type: Object,
      default: null
    },
    showChild: {
      type: Boolean,
      default: false
    },
    showOneChild: {
      type: Boolean,
      default: false
    },
    rtl: {
      type: Boolean,
      default: false
    },
    disableHover: {
      type: Boolean,
      default: false
    },
    mobileItemStyle: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      active: false,
      exactActive: false,
      itemShow: false,
      itemHover: false
    };
  },

  computed: {
    isFirstLevel() {
      return this.level === 1;
    },

    show: {
      get() {
        if (!this.itemHasChild) return false;
        if (this.showChild || this.isMobileItem) return true;
        return this.itemShow;
      },

      set(show) {
        if (this.showOneChild) {
          show ? this.emitActiveShow(this.item) : this.emitActiveShow(null);
        }

        this.itemShow = show;
      }

    },

    itemLinkClass() {
      return ['vsm--link', !this.isMobileItem ? `vsm--link_level-${this.level}` : '', {
        'vsm--link_mobile-item': this.isMobileItem
      }, {
        'vsm--link_hover': this.hover
      }, {
        'vsm--link_active': this.active
      }, {
        'vsm--link_exact-active': this.exactActive
      }, {
        'vsm--link_disabled': this.item.disabled
      }, this.item.class];
    },

    isItemHidden() {
      if (this.isCollapsed) {
        if (this.item.hidden && this.item.hiddenOnCollapse === undefined) {
          return true;
        } else {
          return this.item.hiddenOnCollapse === true;
        }
      } else {
        return this.item.hidden === true;
      }
    },

    hover() {
      if (this.isCollapsed && this.isFirstLevel) {
        return this.item === this.mobileItem;
      }

      return this.itemHover;
    },

    itemHasChild() {
      return !!(this.item.child && this.item.child.length > 0);
    }

  },
  watch: {
    $route() {
      setTimeout(() => {
        if (this.item.header || this.item.component) return;
        this.initState();
      }, 1);
    },

    item(newItem, item) {
      this.emitItemUpdate(newItem, item);
    },

    activeShow() {
      this.itemShow = this.item === this.activeShow;
    }

  },

  created() {
    if (this.item.header || this.item.component) return;
    this.initState();
  },

  mounted() {
    if (!this.$router) {
      window.addEventListener('hashchange', this.initState);
    }
  },

  destroyed() {
    if (!this.$router) {
      window.removeEventListener('hashchange', this.initState);
    }
  },

  methods: {
    isLinkActive(item) {
      return this.matchRoute(item) || this.isChildActive(item.child) || this.isAliasActive(item);
    },

    isLinkExactActive(item) {
      return this.matchExactRoute(item.href);
    },

    isChildActive(child) {
      if (!child) return false;
      return child.some(item => {
        return this.isLinkActive(item);
      });
    },

    isAliasActive(item) {
      if (item.alias) {
        const current = this.$router ? this.$route.fullPath : window.location.pathname + window.location.search + window.location.hash;

        if (Array.isArray(item.alias)) {
          return item.alias.some(alias => {
            return pathToRegexp(alias).test(current);
          });
        } else {
          return pathToRegexp(item.alias).test(current);
        }
      }

      return false;
    },

    matchRoute({
      href,
      exactPath
    }) {
      if (!href) return false;

      if (this.$router) {
        const {
          route
        } = this.$router.resolve(href);
        return exactPath ? route.path === this.$route.path : this.matchExactRoute(href);
      } else {
        return exactPath ? href === window.location.pathname : this.matchExactRoute(href);
      }
    },

    matchExactRoute(href) {
      if (!href) return false;

      if (this.$router) {
        const {
          route
        } = this.$router.resolve(href);
        return route.fullPath === this.$route.fullPath;
      } else {
        return href === window.location.pathname + window.location.search + window.location.hash;
      }
    },

    clickEvent(event) {
      if (this.item.disabled) return;

      if (!this.item.href) {
        event.preventDefault();
      }

      this.emitItemClick(event, this.item, this);
      this.emitMobileItem(event, event.currentTarget.offsetParent);
      if (!this.itemHasChild || this.showChild || this.isMobileItem) return;

      if (!this.item.href || this.exactActive) {
        this.show = !this.show;
      }
    },

    emitMobileItem(event, itemEl) {
      if (this.hover) return;
      if (!this.isCollapsed || !this.isFirstLevel || this.isMobileItem) return;
      this.$emit('unset-mobile-item', true);
      setTimeout(() => {
        if (this.mobileItem !== this.item) {
          this.$emit('set-mobile-item', {
            item: this.item,
            itemEl
          });
        }

        if (event.type === 'click' && !this.itemHasChild) {
          this.$emit('unset-mobile-item', false);
        }
      }, 0);
    },

    initState() {
      this.initActiveState();
      this.initShowState();
    },

    initActiveState() {
      this.active = this.isLinkActive(this.item);
      this.exactActive = this.isLinkExactActive(this.item);
    },

    initShowState() {
      if (!this.itemHasChild || this.showChild) return;

      if (this.showOneChild && this.active && !this.show || this.active && !this.show) {
        this.show = true;
      } else if (this.showOneChild && !this.active && this.show) {
        this.show = false;
      }
    },

    mouseOverEvent(event) {
      if (this.item.disabled) return;
      event.stopPropagation();
      this.itemHover = true;

      if (!this.disableHover) {
        this.emitMobileItem(event, event.currentTarget);
      }
    },

    mouseOutEvent(event) {
      event.stopPropagation();
      this.itemHover = false;
    },

    expandEnter(el) {
      el.style.height = el.scrollHeight + 'px';
    },

    expandAfterEnter(el) {
      el.style.height = 'auto';
    },

    expandBeforeLeave(el) {
      if (this.isCollapsed && this.isFirstLevel) {
        el.style.display = 'none';
        return;
      }

      el.style.height = el.scrollHeight + 'px';
    }

  },
  inject: ['emitActiveShow', 'emitItemClick', 'emitItemUpdate']
};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.item.component && !_vm.isItemHidden ? _c(_vm.item.component, _vm._b({
    tag: "component"
  }, 'component', _vm.item.props, false)) : _vm.item.header && !_vm.isItemHidden ? _c('div', _vm._b({
    staticClass: "vsm--header",
    class: _vm.item.class
  }, 'div', _vm.item.attributes, false), [_vm._v("\n  " + _vm._s(_vm.item.title) + "\n")]) : !_vm.isItemHidden ? _c('div', {
    staticClass: "vsm--item",
    class: [{
      'vsm--item_open': _vm.show
    }],
    on: {
      "mouseover": _vm.mouseOverEvent,
      "mouseout": _vm.mouseOutEvent
    }
  }, [_c('sidebar-menu-link', {
    class: _vm.itemLinkClass,
    attrs: {
      "item": _vm.item,
      "attributes": _vm.item.attributes
    },
    nativeOn: {
      "click": function ($event) {
        return _vm.clickEvent($event);
      }
    }
  }, [_vm.item.icon && !_vm.isMobileItem ? _c('sidebar-menu-icon', {
    attrs: {
      "icon": _vm.item.icon
    }
  }) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade-animation",
      "appear": _vm.isMobileItem
    }
  }, [_vm.isCollapsed && !_vm.isFirstLevel || !_vm.isCollapsed || _vm.isMobileItem ? [_c('span', {
    staticClass: "vsm--title"
  }, [_vm._v(_vm._s(_vm.item.title))])] : _vm._e()], 2), _vm._v(" "), _vm.isCollapsed && !_vm.isFirstLevel || !_vm.isCollapsed || _vm.isMobileItem ? [_vm.item.badge ? _c('sidebar-menu-badge', {
    attrs: {
      "badge": _vm.item.badge
    }
  }) : _vm._e(), _vm._v(" "), _vm.itemHasChild ? _c('div', {
    staticClass: "vsm--arrow",
    class: [{
      'vsm--arrow_open': _vm.show
    }, {
      'vsm--arrow_slot': _vm.$slots['dropdown-icon']
    }]
  }, [_vm._t("dropdown-icon")], 2) : _vm._e()] : _vm._e()], 2), _vm._v(" "), _vm.itemHasChild ? [_vm.isCollapsed && !_vm.isFirstLevel || !_vm.isCollapsed || _vm.isMobileItem ? [_c('transition', {
    attrs: {
      "appear": _vm.isMobileItem,
      "name": "expand"
    },
    on: {
      "enter": _vm.expandEnter,
      "afterEnter": _vm.expandAfterEnter,
      "beforeLeave": _vm.expandBeforeLeave
    }
  }, [_vm.show ? _c('div', {
    staticClass: "vsm--dropdown",
    class: _vm.isMobileItem && 'vsm--dropdown_mobile-item',
    style: _vm.isMobileItem && _vm.mobileItemStyle.dropdown
  }, [_c('div', {
    staticClass: "vsm--list"
  }, _vm._l(_vm.item.child, function (subItem, index) {
    return _c('sidebar-menu-item', {
      key: index,
      attrs: {
        "item": subItem,
        "level": _vm.level + 1,
        "show-child": _vm.showChild,
        "rtl": _vm.rtl,
        "is-collapsed": _vm.isCollapsed
      }
    }, [_vm._t("dropdown-icon", null, {
      "slot": "dropdown-icon"
    })], 2);
  }), 1)]) : _vm._e()])] : _vm._e()] : _vm._e()], 2) : _vm._e();
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

//
var script = {
  name: "VueAdminSidebar",
  components: {
    SidebarMenuItem: __vue_component__$1
  },
  props: {
    menu: {
      type: Array,
      required: true
    },
    // option: {
    //     type: Object,
    //     required: true,
    //     // validator: (opt) => optionKeys.every((key) => key in opt),
    // },
    collapsed: {
      type: Object,
      default: () => ({
        value: false,
        width: "50px"
      })
    },
    width: {
      type: String,
      default: "350px"
    },
    // widthCollapsed: {
    //     type: String,
    //     default: "50px",
    // },
    showChild: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: ""
    },
    showOneChild: {
      type: Boolean,
      default: true
    },
    rtl: {
      type: Boolean,
      default: false
    },
    // relative: {
    //     type: Boolean,
    //     default: false,
    // },
    hideToggle: {
      type: Boolean,
      default: false
    },
    disableHover: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // collapsed.value: this.collapsed,
      mobileItem: null,
      mobileItemPos: 0,
      mobileItemHeight: 0,
      mobileItemTimeout: null,
      activeShow: null,
      parentHeight: 0,
      parentWidth: 0,
      parentOffsetTop: 0,
      parentOffsetLeft: 0
    };
  },

  computed: {
    sidebarWidth() {
      return this.collapsed.value ? this.collapsed.width : this.width;
    },

    sidebarClass() {
      return [!this.collapsed.value ? "vsm_expanded" : "vsm_collapsed", this.theme ? `vsm_${this.theme}` : "", this.rtl ? "vsm_rtl" : "" // this.relative ? "vsm_relative" : "",
      ];
    },

    mobileItemStyle() {
      return {
        item: [{
          position: "absolute"
        }, {
          top: `${this.mobileItemPos}px`
        }, this.rtl ? {
          right: "0px"
        } : {
          left: "0px"
        }, this.rtl ? {
          "padding-right": this.sidebarWidth
        } : {
          "padding-left": this.sidebarWidth
        }, this.rtl && {
          direction: "rtl"
        }, {
          "z-index": 0
        }, {
          width: `${this.parentWidth - this.parentOffsetLeft}px`
        }, {
          "max-width": this.width
        }],
        dropdown: [{
          position: "absolute"
        }, {
          top: `${this.mobileItemHeight}px`
        }, {
          width: "100%"
        }, {
          "max-height": `${this.parentHeight - (this.mobileItemPos + this.mobileItemHeight) - this.parentOffsetTop}px`
        }, {
          "overflow-y": "auto"
        }],
        background: [{
          position: "absolute"
        }, {
          top: "0px"
        }, {
          left: "0px"
        }, {
          right: "0px"
        }, {
          width: "100%"
        }, {
          height: `${this.mobileItemHeight}px`
        }, {
          "z-index": -1
        }]
      };
    }

  },
  watch: {// collapsed(val) {
    //     if (this.collapsed.value === this.collapsed) return;
    //     this.collapsed.value = val;
    //     this.mobileItem = null;
    // },
  },
  methods: {
    onMouseLeave() {
      this.unsetMobileItem(false, 300);
    },

    onMouseEnter() {
      if (this.collapsed.value) {
        if (this.mobileItemTimeout) clearTimeout(this.mobileItemTimeout);
      }
    },

    onToggleClick() {
      this.collapsed.value = !this.collapsed.value;
      this.mobileItem = null;
      this.$emit("toggle-collapse", this.collapsed.value);
    },

    onActiveShow(item) {
      this.activeShow = item;
    },

    onItemClick(event, item, node) {
      this.$emit("item-click", event, item, node);
    },

    setMobileItem({
      item,
      itemEl
    }) {
      if (this.mobileItem === item) return;
      const sidebarTop = this.$el.getBoundingClientRect().top;
      const itemLinkEl = itemEl.children[0];
      const {
        top,
        height
      } = itemLinkEl.getBoundingClientRect();
      let positionTop = top - sidebarTop;
      this.initParentOffsets();
      this.mobileItem = item;
      this.mobileItemPos = positionTop;
      this.mobileItemHeight = height;
    },

    unsetMobileItem(immediate, delay = 800) {
      if (!this.mobileItem) return;
      if (this.mobileItemTimeout) clearTimeout(this.mobileItemTimeout);

      if (immediate) {
        this.mobileItem = null;
        return;
      }

      this.mobileItemTimeout = setTimeout(() => {
        this.mobileItem = null;
      }, delay);
    },

    initParentOffsets() {
      let {
        top: sidebarTop,
        left: sidebarLeft,
        right: sidebarRight
      } = this.$el.getBoundingClientRect();
      let parent = this.relative ? this.$el.parentElement : document.documentElement;
      this.parentHeight = parent.clientHeight;
      this.parentWidth = parent.clientWidth;

      if (this.relative) {
        let {
          top: parentTop,
          left: parentLeft
        } = parent.getBoundingClientRect();
        this.parentOffsetTop = sidebarTop - (parentTop + parent.clientTop);
        this.parentOffsetLeft = this.rtl ? this.parentWidth - sidebarRight + (parentLeft + parent.clientLeft) : sidebarLeft - (parentLeft + parent.clientLeft);
      } else {
        this.parentOffsetTop = sidebarTop;
        this.parentOffsetLeft = this.rtl ? this.parentWidth - sidebarRight : sidebarLeft;
      }
    },

    onItemUpdate(newItem, item) {
      if (item === this.mobileItem) {
        this.mobileItem = newItem;
      }

      if (item === this.activeShow) {
        this.activeShow = newItem;
      }
    }

  },

  provide() {
    return {
      emitActiveShow: this.onActiveShow,
      emitItemClick: this.onItemClick,
      emitItemUpdate: this.onItemUpdate
    };
  }

};

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('div', {
    staticClass: "v-sidebar-menu",
    class: _vm.sidebarClass,
    style: "--width:" + _vm.width + "; --widthCollapsed:" + _vm.collapsed.width,
    on: {
      "mouseleave": _vm.onMouseLeave,
      "mouseenter": _vm.onMouseEnter
    }
  }, [_vm._t("header"), _vm._v(" "), _c('div', {
    staticClass: "vsm--scroll-wrapper",
    style: _vm.collapsed.value && [_vm.rtl ? {
      'margin-left': '-17px'
    } : {
      'margin-right': '-17px'
    }]
  }, [_c('div', {
    staticClass: "vsm--list",
    style: _vm.collapsed.value && {
      'width': _vm.collapsed.width
    }
  }, _vm._l(_vm.menu, function (item, index) {
    return _c('sidebar-menu-item', {
      key: index,
      attrs: {
        "item": item,
        "is-collapsed": _vm.collapsed.value,
        "active-show": _vm.activeShow,
        "show-one-child": _vm.showOneChild,
        "show-child": _vm.showChild,
        "rtl": _vm.rtl,
        "mobile-item": _vm.mobileItem,
        "disable-hover": _vm.disableHover
      },
      on: {
        "set-mobile-item": _vm.setMobileItem,
        "unset-mobile-item": _vm.unsetMobileItem
      }
    }, [_vm._t("dropdown-icon", null, {
      "slot": "dropdown-icon"
    })], 2);
  }), 1), _vm._v(" "), _vm.collapsed.value ? _c('div', {
    staticClass: "vsm--mobile-item",
    style: _vm.mobileItemStyle.item
  }, [_vm.mobileItem ? _c('sidebar-menu-item', {
    attrs: {
      "item": _vm.mobileItem,
      "is-mobile-item": true,
      "mobile-item-style": _vm.mobileItemStyle,
      "is-collapsed": _vm.collapsed.value,
      "show-child": _vm.showChild,
      "rtl": _vm.rtl,
      "disable-hover": _vm.disableHover
    }
  }, [_vm._t("dropdown-icon", null, {
    "slot": "dropdown-icon"
  })], 2) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "slide-animation"
    }
  }, [_vm.mobileItem ? _c('div', {
    staticClass: "vsm--mobile-bg",
    style: _vm.mobileItemStyle.background
  }) : _vm._e()])], 1) : _vm._e()]), _vm._v(" "), _vm._t("footer"), _vm._v(" "), !_vm.hideToggle ? _c('button', {
    staticClass: "vsm--toggle-btn",
    class: {
      'vsm--toggle-btn_slot': _vm.$slots['toggle-icon']
    },
    on: {
      "click": _vm.onToggleClick
    }
  }, [_vm._t("toggle-icon")], 2) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "v-overlay",
    on: {
      "click": _vm.onToggleClick
    }
  })]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-4a2f8e8f_0", {
    source: "@charset \"UTF-8\";.v-sidebar-menu{position:relative;top:0;left:0;bottom:0;display:flex;flex-direction:column;z-index:999;box-sizing:border-box;width:100%;height:100vh;text-align:left;transition:.3s all ease}.v-sidebar-menu *{box-sizing:border-box}@media (max-width:992px){.v-sidebar-menu{position:fixed}}.v-sidebar-menu .vsm--scroll-wrapper{height:100%;overflow-y:auto;overflow-x:hidden}.v-sidebar-menu .vsm--dropdown>.vsm--list{padding:5px}.v-sidebar-menu .vsm--item{position:relative;display:block;width:100%;white-space:nowrap}.v-sidebar-menu .vsm--link{cursor:pointer;position:relative;display:flex;align-items:center;font-size:16px;font-weight:400;padding:10px;line-height:30px;text-decoration:none;user-select:none;z-index:20;transition:.3s all ease}.v-sidebar-menu .vsm--link_active,.v-sidebar-menu .vsm--link_exact-active{font-weight:600}.v-sidebar-menu .vsm--link_disabled{opacity:.4;pointer-events:none}.v-sidebar-menu .vsm--link_level-1 .vsm--icon{height:30px;line-height:30px;width:30px;flex-shrink:0;text-align:center;border-radius:3px}.v-sidebar-menu .vsm--icon{display:inline-block;margin-right:10px}.v-sidebar-menu .vsm--title{flex-grow:1}.v-sidebar-menu .vsm--arrow{width:30px;text-align:center;font-style:normal;font-weight:900;transition:.3s transform ease}.v-sidebar-menu .vsm--arrow:after{content:\"\";font-family:\"Font Awesome 5 Free\"}.v-sidebar-menu .vsm--arrow_open{transform:rotate(90deg)}.v-sidebar-menu .vsm--arrow_slot:after{display:none}.v-sidebar-menu .vsm--header{font-size:14px;font-weight:600;padding:10px;white-space:nowrap;text-transform:uppercase}.v-sidebar-menu .vsm--badge_default{padding:0 6px;font-size:12px;border-radius:3px;height:20px;line-height:20px;font-weight:600;text-transform:uppercase}.v-sidebar-menu .vsm--toggle-btn{display:block;text-align:center;font-style:normal;font-weight:900;height:50px;cursor:pointer;border:none;width:100%}.v-sidebar-menu .vsm--toggle-btn:after{content:\"\";font-family:\"Font Awesome 5 Free\"}.v-sidebar-menu .vsm--toggle-btn_slot:after{display:none}.v-sidebar-menu.vsm_collapsed{min-width:var(--widthCollapsed);width:var(--widthCollapsed)}@media (max-width:992px){.v-sidebar-menu.vsm_collapsed{max-width:var(--width);transform:translateX(-100%)}}.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover,.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover{background-color:transparent!important}.v-sidebar-menu.vsm_rtl{right:0;left:inherit;text-align:right;direction:rtl}.v-sidebar-menu.vsm_rtl .vsm--icon{margin-left:10px;margin-right:0}.v-sidebar-menu.vsm_relative{position:relative;height:100%}.v-sidebar-menu .expand-enter-active,.v-sidebar-menu .expand-leave-active{transition:height .3s ease;overflow:hidden}.v-sidebar-menu .expand-enter,.v-sidebar-menu .expand-leave-to{height:0!important}.v-sidebar-menu .slide-animation-enter-active{transition:width .3s ease}.v-sidebar-menu .slide-animation-leave-active{transition:width .3s ease}.v-sidebar-menu .slide-animation-enter,.v-sidebar-menu .slide-animation-leave-to{width:0!important}.v-sidebar-menu .fade-animation-enter-active{transition:opacity .3s ease,visibility .3s ease}.v-sidebar-menu .fade-animation-leave-active{transition:opacity .3s ease,visibility .3s ease}.v-sidebar-menu .fade-animation-enter,.v-sidebar-menu .fade-animation-leave-to{opacity:0!important;visibility:hidden!important}.v-sidebar-menu .vsm--mobile-item>.vsm--item{padding:0!important;margin:0!important}.v-sidebar-menu .vsm--mobile-item>.vsm--item>.vsm--link{margin:0!important;background-color:transparent!important;line-height:30px!important}.v-sidebar-menu{background-color:#2a2a2e}.v-sidebar-menu .vsm--link{color:#fff}.v-sidebar-menu .vsm--link_level-1.vsm--link_active,.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active{box-shadow:3px 0 0 0 #4285f4 inset}.v-sidebar-menu .vsm--link_level-1 .vsm--icon{background-color:#1e1e21}.v-sidebar-menu .vsm--link:hover,.v-sidebar-menu .vsm--link_hover{background-color:rgba(30,30,33,.5)}.v-sidebar-menu .vsm--link_mobile-item{color:#fff}.v-sidebar-menu .vsm--link_mobile-item.vsm--link_hover,.v-sidebar-menu .vsm--link_mobile-item:hover{color:#fff}.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon{color:#fff;background-color:#4285f4}.v-sidebar-menu .vsm--dropdown .vsm--list{background-color:#36363b}.v-sidebar-menu .vsm--mobile-bg{background-color:#4285f4}.v-sidebar-menu.vsm_expanded{min-width:var(--width);width:var(--width);transform:translateX(0)}@media (max-width:992px){.v-sidebar-menu.vsm_expanded+.v-overlay{position:fixed;width:100%;height:100vh;background-color:rgba(0,0,0,.5)}}.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1{color:#fff;background-color:#4285f4}.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon{background-color:#4285f4}.v-sidebar-menu.vsm_rtl .vsm--link_level-1.vsm--link_active,.v-sidebar-menu.vsm_rtl .vsm--link_level-1.vsm--link_exact-active{box-shadow:-3px 0 0 0 #4285f4 inset}.v-sidebar-menu .vsm--header{color:rgba(255,255,255,.7)}.v-sidebar-menu .vsm--badge_default{color:#fff;background-color:#1e1e21}.v-sidebar-menu .vsm--toggle-btn{color:#fff;background-color:#1e1e21}.v-sidebar-menu.vsm_white-theme{background-color:#fff}.v-sidebar-menu.vsm_white-theme .vsm--link{color:#262626}.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active,.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_exact-active{box-shadow:3px 0 0 0 #4285f4 inset}.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_active .vsm--icon,.v-sidebar-menu.vsm_white-theme .vsm--link_level-1.vsm--link_exact-active .vsm--icon{color:#fff;background-color:#262626}.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon{background-color:#bbc5d6}.v-sidebar-menu.vsm_white-theme .vsm--link:hover,.v-sidebar-menu.vsm_white-theme .vsm--link_hover{background-color:rgba(242,242,242,.5)}.v-sidebar-menu.vsm_white-theme .vsm--link_mobile-item{color:#fff}.v-sidebar-menu.vsm_white-theme .vsm--link_mobile-item.vsm--link_hover,.v-sidebar-menu.vsm_white-theme .vsm--link_mobile-item:hover{color:#fff}.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,.v-sidebar-menu.vsm_white-theme.vsm_collapsed .vsm--link_level-1:hover .vsm--icon{color:#fff;background-color:#4285f4}.v-sidebar-menu.vsm_white-theme .vsm--dropdown .vsm--list{background-color:#e3e3e3}.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg{background-color:#4285f4}.v-sidebar-menu.vsm_white-theme.vsm_expanded{min-width:var(--width);width:var(--width);transform:translateX(0)}@media (max-width:992px){.v-sidebar-menu.vsm_white-theme.vsm_expanded+.v-overlay{position:fixed;width:100%;height:100vh;background-color:rgba(0,0,0,.5)}}.v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1{color:#fff;background-color:#4285f4}.v-sidebar-menu.vsm_white-theme.vsm_expanded .vsm--item_open .vsm--link_level-1 .vsm--icon{background-color:#4285f4}.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_active,.v-sidebar-menu.vsm_white-theme.vsm_rtl .vsm--link_level-1.vsm--link_exact-active{box-shadow:-3px 0 0 0 #4285f4 inset}.v-sidebar-menu.vsm_white-theme .vsm--header{color:rgba(38,38,38,.7)}.v-sidebar-menu.vsm_white-theme .vsm--badge_default{color:#262626;background-color:#f2f2f2}.v-sidebar-menu.vsm_white-theme .vsm--toggle-btn{color:#262626;background-color:#f2f2f2}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('VueAdminSidebar', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;
