<template>
    <div>
        <div
            class="v-sidebar-menu"
            :class="sidebarClass"
            :style="`--width:${width}; --widthCollapsed:${collapsed.width}`"
            @mouseleave="onMouseLeave"
            @mouseenter="onMouseEnter"
        >
            <slot name="header" />
            <div
                class="vsm--scroll-wrapper"
                :style="collapsed.value && [rtl ? {'margin-left': '-17px'} : {'margin-right': '-17px'}]"
            >
                <div class="vsm--list" :style="collapsed.value && {'width': collapsed.width}">
                    <sidebar-menu-item
                        v-for="(item, index) in menu"
                        :key="index"
                        :item="item"
                        :is-collapsed="collapsed.value"
                        :active-show="activeShow"
                        :show-one-child="showOneChild"
                        :show-child="showChild"
                        :rtl="rtl"
                        :mobile-item="mobileItem"
                        :disable-hover="disableHover"
                        @set-mobile-item="setMobileItem"
                        @unset-mobile-item="unsetMobileItem"
                    >
                        <slot slot="dropdown-icon" name="dropdown-icon" />
                    </sidebar-menu-item>
                </div>
                <div v-if="collapsed.value" class="vsm--mobile-item" :style="mobileItemStyle.item">
                    <sidebar-menu-item
                        v-if="mobileItem"
                        :item="mobileItem"
                        :is-mobile-item="true"
                        :mobile-item-style="mobileItemStyle"
                        :is-collapsed="collapsed.value"
                        :show-child="showChild"
                        :rtl="rtl"
                        :disable-hover="disableHover"
                    >
                        <slot slot="dropdown-icon" name="dropdown-icon" />
                    </sidebar-menu-item>
                    <transition name="slide-animation">
                        <div
                            v-if="mobileItem"
                            class="vsm--mobile-bg"
                            :style="mobileItemStyle.background"
                        />
                    </transition>
                </div>
            </div>
            <slot name="footer" />
            <button
                v-if="!hideToggle"
                class="vsm--toggle-btn"
                :class="{'vsm--toggle-btn_slot' : $slots['toggle-icon']}"
                @click="onToggleClick"
            >
                <slot name="toggle-icon" />
            </button>
        </div>
        <div class="v-overlay" @click="onToggleClick"></div>
    </div>
</template>

<script>
import SidebarMenuItem from "./SidebarMenuItem.vue";

export default {
    name: "VueAdminSidebar",
    components: {
        SidebarMenuItem,
    },
    props: {
        menu: {
            type: Array,
            required: true,
        },
        collapsed: {
            type: Object,
            default: () => ({ value: false, width: "50px" }),
        },
        width: {
            type: String,
            default: "350px",
        },
        showChild: {
            type: Boolean,
            default: false,
        },
        theme: {
            type: String,
            default: "",
        },
        showOneChild: {
            type: Boolean,
            default: true,
        },
        rtl: {
            type: Boolean,
            default: false,
        },
        hideToggle: {
            type: Boolean,
            default: false,
        },
        disableHover: {
            type: Boolean,
            default: false,
        },

        // Classes
        sidebarClasses: {
            type: String,
            default: 'vsm--background'
        }
    },
    data() {
        return {
            mobileItem: null,
            mobileItemPos: 0,
            mobileItemHeight: 0,
            mobileItemTimeout: null,
            activeShow: null,
            parentHeight: 0,
            parentWidth: 0,
            parentOffsetTop: 0,
            parentOffsetLeft: 0,
        };
    },
    computed: {
        sidebarWidth() {
            return this.collapsed.value ? this.collapsed.width : this.width;
        },
        sidebarClass() {
            return [
                !this.collapsed.value ? "vsm_expanded" : "vsm_collapsed",
                this.theme ? `vsm_${this.theme}` : "",
                this.rtl ? "vsm_rtl" : "",
                this.sidebarClasses
                // this.relative ? "vsm_relative" : "",
            ];
        },
        mobileItemStyle() {
            return {
                item: [
                    { position: "absolute" },
                    { top: `${this.mobileItemPos}px` },
                    this.rtl ? { right: "0px" } : { left: "0px" },
                    this.rtl
                        ? { "padding-right": this.sidebarWidth }
                        : { "padding-left": this.sidebarWidth },
                    this.rtl && { direction: "rtl" },
                    { "z-index": 0 },
                    { width: `${this.parentWidth - this.parentOffsetLeft}px` },
                    { "max-width": this.width },
                ],
                dropdown: [
                    { position: "absolute" },
                    { top: `${this.mobileItemHeight}px` },
                    { width: "100%" },
                    {
                        "max-height": `${
                            this.parentHeight -
                            (this.mobileItemPos + this.mobileItemHeight) -
                            this.parentOffsetTop
                        }px`,
                    },
                    { "overflow-y": "auto" },
                ],
                background: [
                    { position: "absolute" },
                    { top: "0px" },
                    { left: "0px" },
                    { right: "0px" },
                    { width: "100%" },
                    { height: `${this.mobileItemHeight}px` },
                    { "z-index": -1 },
                ],
            };
        },
    },
    methods: {
        onMouseLeave() {
            this.unsetMobileItem(false, 300);
        },
        onMouseEnter() {
            if (this.collapsed.value) {
                if (this.mobileItemTimeout)
                    clearTimeout(this.mobileItemTimeout);
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
        setMobileItem({ item, itemEl }) {
            if (this.mobileItem === item) return;
            const sidebarTop = this.$el.getBoundingClientRect().top;
            const itemLinkEl = itemEl.children[0];
            const { top, height } = itemLinkEl.getBoundingClientRect();

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
                right: sidebarRight,
            } = this.$el.getBoundingClientRect();
            let parent = this.relative
                ? this.$el.parentElement
                : document.documentElement;
            this.parentHeight = parent.clientHeight;
            this.parentWidth = parent.clientWidth;
            if (this.relative) {
                let {
                    top: parentTop,
                    left: parentLeft,
                } = parent.getBoundingClientRect();
                this.parentOffsetTop =
                    sidebarTop - (parentTop + parent.clientTop);
                this.parentOffsetLeft = this.rtl
                    ? this.parentWidth -
                      sidebarRight +
                      (parentLeft + parent.clientLeft)
                    : sidebarLeft - (parentLeft + parent.clientLeft);
            } else {
                this.parentOffsetTop = sidebarTop;
                this.parentOffsetLeft = this.rtl
                    ? this.parentWidth - sidebarRight
                    : sidebarLeft;
            }
        },
        onItemUpdate(newItem, item) {
            if (item === this.mobileItem) {
                this.mobileItem = newItem;
            }
            if (item === this.activeShow) {
                this.activeShow = newItem;
            }
        },

        onResize() {
            if (window.innerWidth <= 992) {
                this.collapsed.value = true;
            } 
            // else {
            //     // this.isOnMobile = false;
            //     this.collapsed.value = false;
            // }
        },
    },
    mounted() {
        this.onResize();
        window.addEventListener("resize", this.onResize);
    },
    provide() {
        return {
            emitActiveShow: this.onActiveShow,
            emitItemClick: this.onItemClick,
            emitItemUpdate: this.onItemUpdate,
        };
    },
};
</script>

<style lang="scss">
@import "../scss/vue-admin-sidebar";
</style>
