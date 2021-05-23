<script>
import Vue from "vue";
import VueAdminSidebar from "@/components/VueAdminSidebar";

export default Vue.extend({
    name: "ServeDev",
    components: {
        VueAdminSidebar,
    },
    data() {
        return {
            menu: [
                {
                    header: true,
                    title: "Getting Started",
                    hiddenOnCollapse: true,
                },
                {
                    href: "/",
                    title: "Installation",
                    icon: "fa fa-download",
                },
                {
                    href: "/basic-usage",
                    title: "Basic Usage",
                    icon: "fa fa-code",
                },
                {
                    header: true,
                    title: "Usage",
                    hiddenOnCollapse: true,
                },
                {
                    href: "/props",
                    title: "Props",
                    icon: "fa fa-cogs",
                },
                {
                    href: "/events",
                    title: "Events",
                    icon: "fa fa-bell",
                },
                {
                    href: "/styling",
                    title: "Styling",
                    icon: "fa fa-palette",
                },
                {
                    header: true,
                    title: "Example",
                    hiddenOnCollapse: true,
                },
                {
                    href: "/disabled",
                    title: "Disabled page",
                    icon: "fa fa-lock",
                    disabled: true,
                },
                {
                    title: "Badge",
                    icon: "fa fa-cog",
                    badge: {
                        text: "new",
                        class: "vsm--badge_default",
                    },
                },
                {
                    href: "/page",
                    title: "Dropdown Page",
                    icon: "fa fa-list-ul",
                    child: [
                        {
                            href: "/page/sub-page-1",
                            title: "Sub Page 01",
                            icon: "fa fa-file-alt",
                        },
                        {
                            href: "/page/sub-page-2",
                            title: "Sub Page 02",
                            icon: "fa fa-file-alt",
                        },
                    ],
                },
                {
                    title: "Multiple Level",
                    icon: "fa fa-list-alt",
                    child: [
                        {
                            title: "page",
                        },
                        {
                            title: "Level 2 ",
                            child: [
                                {
                                    title: "page",
                                },
                                {
                                    title: "Page",
                                },
                            ],
                        },
                        {
                            title: "Page",
                        },
                        {
                            title: "Another Level 2",
                            child: [
                                {
                                    title: "Level 3",
                                    child: [
                                        {
                                            title: "Page",
                                        },
                                        {
                                            title: "Page",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
});
</script>

<template>
    <div id="app">
        <vue-admin-sidebar :menu="menu"></vue-admin-sidebar>
        <div class="main">
            <div class="header">
                <button>Toggle Button</button>
            </div>
        </div>
    </div>
</template>
