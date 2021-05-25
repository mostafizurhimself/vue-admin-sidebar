<template>
  <div>
    <h2>Styling</h2>
    <p>All styles customization can be done in normal CSS by using this classes</p>
    <pre>.v-sidebar-menu {}
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
</pre>
    <p>or you can override Sass variables (complete list of all variables can be found in `src/scss/_variables.scss`) and create your own theme</p>
    <pre>@import "custom-var.scss";
@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";
</pre>
    <h3>Customize Toggle & Dropdown Icons</h3>
    <p>The component use 'Font Awesome 5 Free' as default, but you can either customize them using slots or by overriding css style</p>
    <h2>Slots</h2>
    <pre>
&lt;sidebar-menu&gt;
    &lt;span slot="header"&gt;header&lt;/span&gt;
    &lt;span slot="footer"&gt;footer&lt;/span&gt;
    &lt;span slot="toggle-icon"&gt;toggle-icon&lt;/span&gt;
    &lt;span slot="dropdown-icon"&gt;dropdown-icon&lt;/span&gt;
&lt;/sidebar-menu&gt;
</pre>
  </div>
</template>
