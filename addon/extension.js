import { MenuItem, ExtensionComponent } from "@fleetbase/ember-core/contracts";

/**
 * Menu labels are registered with translation keys, which ember-ui's
 * `translate-label` translates when they render. Consoles running an ember-ui
 * without that helper render the value as-is, so translate up front.
 */
function labelResolver(app) {
    if (app.factoryFor("helper:translate-label")) {
        return (key) => key;
    }

    const intl = app.lookup("service:intl");
    return (key) => intl.t(key);
}

export default {
    setupExtension(app, universe) {
        const label = labelResolver(app);
        const menuService = universe.getService("menu");

        // Register menu item in header
        menuService.registerHeaderMenuItem(label("registry-bridge.extension.title"), "console.extensions", {
            icon: "shapes",
            priority: 99,
            id: "registry-bridge",
            slug: "registry-bridge",
            description: label("registry-bridge.extension.description"),
            shortcuts: [
                {
                    id: "registry-bridge-sc-explore",
                    title: label("registry-bridge.extension.shortcuts.explore.title"),
                    description: label("registry-bridge.extension.shortcuts.explore.description"),
                    icon: "compass",
                    route: "console.extensions.explore",
                },
                {
                    id: "registry-bridge-sc-installed",
                    title: label("registry-bridge.extension.shortcuts.installed.title"),
                    description: label("registry-bridge.extension.shortcuts.installed.description"),
                    icon: "puzzle-piece",
                    route: "console.extensions.installed",
                },
                {
                    id: "registry-bridge-sc-purchased",
                    title: label("registry-bridge.extension.shortcuts.purchased.title"),
                    description: label("registry-bridge.extension.shortcuts.purchased.description"),
                    icon: "receipt",
                    route: "console.extensions.purchased",
                },
            ],
        });

        // Register admin controls
        menuService.registerAdminMenuPanel(
            label("registry-bridge.extension.admin.panel-title"),
            [
                new MenuItem({
                    id: "registry-config",
                    slug: "registry-config",
                    view: "registry-config",
                    title: label("registry-bridge.extension.admin.registry-config"),
                    icon: "gear",
                    component: new ExtensionComponent("@fleetbase/registry-bridge-engine", "registry-admin-config"),
                }),
                new MenuItem({
                    id: "awaiting-review",
                    slug: "awaiting-review",
                    view: "awaiting-review",
                    title: label("registry-bridge.extension.admin.awaiting-review"),
                    icon: "gavel",
                    component: new ExtensionComponent("@fleetbase/registry-bridge-engine", "extension-reviewer-control"),
                }),
                new MenuItem({
                    id: "pending-publish",
                    slug: "pending-publish",
                    view: "pending-publish",
                    title: label("registry-bridge.extension.admin.pending-publish"),
                    icon: "rocket",
                    component: new ExtensionComponent("@fleetbase/registry-bridge-engine", "extension-pending-publish-viewer"),
                }),
            ],
            {
                slug: "extension-registry",
            }
        );
    },
};
