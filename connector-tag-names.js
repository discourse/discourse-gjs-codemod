const connectorTagNames = {
  "after-admin-user-fields": "",
  "web-hook-fields": "div",
  "admin-customize-colors-new-button": "",
  "admin-plugin-list-name-badge-after": "span",
  "admin-plugin-list-item-version": "",
  "admin-plugin-list-item-enabled": "",
  "admin-plugin-list-item-settings": "",
  "admin-above-badge-buttons": "",
  "admin-upgrade-header": "",
  "admin-customize-themes-list-item": "span",
  "admin-user-controls-after": "",
  "admin-user-below-names": "",
  "admin-user-details": "div",
  "after-user-details": "div",
  "admin-dashboard-security-top": "div",
  "admin-dashboard-security-bottom": "div",
  "admin-dashboard-moderation-top": "div",
  "admin-dashboard-moderation-bottom": "div",
  "admin-customize-themes-show-top": "div",
  "admin-customize-theme-before-errors": "",
  "admin-customize-theme-before-controls": "",
  "admin-api-keys": "",
  "admin-dashboard-top": "div",
  "admin-dashboard-after-header": "div",
  "admin-dashboard-tabs-after": "",
  "admin-dashboard-bottom": "div",
  "admin-customize-colors-new-button": "",
  "admin-customize-themes": "",
  "admin-dashboard-general-top": "div",
  "admin-dashboard-general-bottom": "div",
  downloader: "div",
  "before-backup-list": "div",
  "badge-granter-form": "",
  "badge-granter-table": "",
  "admin-web-hooks": "",
  "after-embeddable-hosts-table": "",
  "admin-config-customize": "",
  "admin-below-plugins-index": "div",
  "admin-users-list-show-before": "",
  "admin-users-list-thead-after": "",
  "admin-users-list-td-after": "",
  "admin-users-list-icon": "div",
  "sidebar-footer-actions": "",
  "before-sidebar-sections": "",
  "after-sidebar-sections": "",
  "google-search": "",
  "categories-only-wrapper": "",
  "mobile-categories": "",
  "below-categories-only": "div",
  "category-list-above-each-category": "",
  "category-list-before-category-mobile": "",
  "category-list-after-title-mobile-section": "",
  "category-list-before-category-section": "",
  "below-category-title-link": "div",
  "category-list-before-topics-section": "",
  "category-list-topics-wrapper": "",
  "category-list-after-topics-section": "",
  "category-list-latest-wrapper": "",
  "category-list-after-latest-section": "",
  "after-header": "",
  "search-menu-initial-options": "",
  "search-menu-results-type-top": "",
  "search-menu-results-topic-title-suffix": "",
  "search-menu-results-assistant-tag-intersection-top": "",
  "search-menu-results-assistant-category-or-tag-top": "",
  "search-menu-results-assistant-user-top": "",
  "search-menu-results-assistant-shortcut-top": "",
  "search-menu-assistant-bottom": "",
  "search-menu-results-top": "",
  "search-menu-with-results-bottom": "",
  "search-menu-results-bottom": "",
  "group-edit": "div",
  "timeline-controls-before": "",
  "timeline-footer-controls-after": "",
  "post-menu": "",
  "post-avatar": "",
  "post-meta-data-poster-name": "",
  "post-meta-data-poster-name-user-link": "",
  "post-meta-data-poster-name-user-link": "",
  "post-text-buttons": "",
  "quote-share-buttons-before": "span",
  "quote-share-buttons-after": "span",
  "quote-button-after": "div",
  "bookmark-list-table-header": "",
  "bookmark-list-before-link": "",
  "category-box-below-each-category": "",
  "category-name-fields-details": "",
  "after-topic-status": "",
  "bread-crumbs-left": "li",
  "bread-crumbs-right": "li",
  "category-custom-security": "",
  "user-stream-item-above": "",
  "user-stream-item-header": "div",
  "user-summary-topic-wrapper": "",
  "user-stream-item-above": "",
  "user-stream-item-header": "div",
  "user-preferences-tags": "div",
  "user-custom-controls": "div",
  "user-preferences-categories": "div",
  "user-custom-controls": "div",
  "extra-nav-item": "span",
  "inline-extra-nav-item": "span",
  // "extra-nav-item": "li",
  "groups-form-membership-below-automatic": "div",
  "fast-edit-footer-after": "",
  "editor-preview": "div",
  "user-profile-avatar-wrapper": "",
  "user-profile-avatar-img-wrapper": "",
  "user-profile-avatar-flair": "",
  "discovery-list-controls-above": "div",
  "discovery-navigation-bar-above": "div",
  "discovery-above": "div",
  "header-list-container-bottom": "",
  "before-list-area": "",
  "discovery-list-area": "",
  "discovery-list-container-top": "span",
  "discovery-below": "div",
  "above-discovery-categories": "div",
  "above-category-heading": "",
  "category-heading": "div",
  "category-navigation": "div",
  "tag-navigation": "div",
  "before-topic-list": "div",
  "after-topic-list": "div",
  "topic-list-bottom": "",
  "below-filter-input": "",
  "composer-open": "div",
  "composer-action-after": "",
  "before-composer-controls": "",
  "before-composer-fields": "",
  "after-composer-category-input": "",
  "after-composer-tag-input": "",
  "after-title-and-category": "",
  "composer-fields": "div",
  "composer-after-composer-editor": "",
  "composer-fields-below": "div",
  "composer-after-save-or-cancel": "",
  "composer-mobile-buttons-bottom": "",
  "emoji-picker-filter-container": "",
  "topic-footer-main-buttons-before-create": "span",
  "after-topic-footer-main-buttons": "span",
  "after-topic-footer-buttons": "span",
  "above-topic-list-item": "",
  "topic-list-item": "",
  "topic-list-item-mobile-avatar": "",
  "topic-list-before-link": "",
  "topic-list-before-status": "",
  "topic-list-after-title": "",
  "topic-list-after-badges": "",
  "topic-list-main-link-bottom": "",
  "topic-list-after-main-link": "",
  "topic-list-before-category": "",
  "topic-list-after-category": "",
  "topic-list-item-mobile-bumped-at": "",
  "topic-link": "",
  "above-latest-topic-list-item": "div",
  "latest-topic-list-item-topic-poster": "",
  "latest-topic-list-item-main-link-top-row": "",
  "latest-topic-list-item-main-link-bottom-row": "",
  "below-latest-topic-list-item-bottom-row": "span",
  "above-latest-topic-list-item-post-count": "div",
  "latest-topic-list-item-topic-stats": "",
  "topic-list-before-reply-count": "",
  "topic-list-before-relative-date": "",
  "topic-list-before-view-count": "",
  "topic-list-topic-cell-link-top-line": "",
  "topic-list-topic-cell-link-bottom-line": "",
  "before-topic-list-body": "",
  "after-topic-list-item": "tr",
  "after-topic-list-body": "",
  "topic-list-heading-bottom": "",
  "categories-boxes-wrapper": "",
  "category-box-before-each-box": "",
  "category-box-after-each-box": "",
  "category-boxes-after-boxes": "",
  "after-reviewable-flagged-post-body": "div",
  "before-sidebar-sections": "",
  "after-sidebar-sections": "",
  "welcome-banner-below-headline": "",
  "welcome-banner-below-input": "",
  "create-account-after-modal-footer": "div",
  "group-reports-nav-item": "li",
  "search-results-topic-avatar-wrapper": "",
  "search-results-topic-title-suffix": "",
  "full-page-search-category": "div",
  "search-result-entry-blurb-wrapper": "",
  "search-result-entry-stats-wrapper": "",
  "after-search-result-entry": "",
  "advanced-search-options-above": "div",
  "advanced-search-options-below": "div",
  "group-info-details": "",
  "reviewable-item-actions": "div",
  "login-after-modal-footer": "div",
  "category-title-before": "",
  "group-index-box-after": "div",
  "after-login-buttons": "",
  "after-reviewable-post-user": "div",
  "post-article": "",
  "post-metadata": "",
  "post-content-cooked-html": "",
  "extra-categories-column": "div",
  "after-topic-progress": "div",
  "after-d-editor": "div",
  "after-user-name": "span",
  "after-user-info": "div",
  "user-menu-tabs-list__after": "",
  "menu-item-end": "",
  "before-panel-body": "",
  "panel-body-bottom": "",
  "user-menu-items-list-empty-state": "",
  "after-panel-body": "",
  "topic-category": "div",
  "user-main-nav": "li",
  "group-email-in": "div",
  "groups-interaction-custom-options": "div",
  "topic-title": "div",
  "category-name-fields-details": "",
  "badge-contents-top": "",
  "category-email-in": "div",
  "category-custom-settings": "",
  "topic-participant": "",
  "most-liked-replies": "",
  "topic-map-participants-after": "",
  "topic-map": "",
  "topic-map-expanded-after": "",
  "post-list-additional-member-info": "",
  "group-post-additional-member-info": "",
  "before-user-card-content": "",
  "user-card-main-info": "",
  "user-card-avatar-flair": "div",
  "user-card-after-username": "div",
  "user-card-post-names": "div",
  "user-card-below-message-button": "li",
  "user-card-additional-buttons": "li",
  "user-card-additional-controls": "div",
  "user-card-location-and-website": "div",
  "user-card-metadata": "div",
  "user-card-after-metadata": "div",
  "user-card-before-badges": "div",
  "user-card-badges": "",
  "before-composer-toggles": "div",
  "tag-custom-settings": "section",
  "after-flag-modal-review-process-description": "div",
  "flag-modal-bottom": "div",
  "post-revisions": "div",
  "revision-user-details-after": "",
  "share-topic-sources": "",
  "move-to-topic-after-radio-buttons": "",
  "split-new-topic-title-after": "",
  "split-new-topic-category-after": "",
  "split-new-topic-tag-after": "",
  "after-composer-title-input": "div",
  "after-breadcrumbs": "",
  "before-create-topic-button": "",
  "after-create-topic-button": "",
  "conditional-loading-spinner": "",
  "notifications-tracking-icons": "",
  "small-user-list-internal": "",
  "categories-topics-table-heading": "div",
  "user-card-content-container": "",
  "search-menu-before-term-input": "",
  "search-menu-before-advanced-search": "",
  "about-after-description": "section",
  "about-after-admins": "section",
  "about-after-moderators": "section",
  "user-dropdown-notifications__before": "",
  "user-dropdown-notifications__after": "",
  "header-topic-info__before": "",
  "header-topic-title-suffix": "",
  "header-categories-wrapper": "",
  "header-topic-info__after": "",
  "header-contents__before": "",
  "home-logo-wrapper": "",
  "before-header-panel": "",
  "after-header-panel": "",
  "header-contents__after": "",
  "user-dropdown-button__before": "",
  "user-dropdown-button__after": "",
  "home-logo": "",
  "home-logo-contents": "",
  "extra-categories-column": "div",
  "before-groups-index-container": "div",
  "evil-trout": "",
  "mobile-subcategories-with-featured-topics-list": "",
  "subcategories-with-featured-topics-list": "",
  "below-wizard-extra-description": "",
  "below-wizard-field": "",
  "wizard-checkbox": "",
  "below-wizard-checkbox": "",
  "wizard-radio": "",
  "below-wizard-radio": "",
  "above-static": "",
  "below-static": "",
  "user-custom-controls": "div",
  "user-preferences-profile": "div",
  "user-custom-preferences": "div",
  "user-custom-controls": "div",
  "user-preferences-desktop-notifications": "div",
  "user-preferences-notifications": "div",
  "user-custom-controls": "div",
  "user-preferences-security": "div",
  "user-custom-controls": "div",
  "user-preferences-emails-pref-email-settings": "div",
  "user-preferences-emails": "div",
  "user-custom-controls": "div",
  "user-preferences-apps": "div",
  "user-preferences-interface-top": "div",
  "user-preferences-interface": "div",
  "user-custom-controls": "div",
  "user-preferences-tracking-topics": "",
  "user-preferences-account": "div",
  "user-custom-controls": "div",
  "users-top": "div",
  "users-directory-controls": "",
  "above-static": "",
  "below-static": "",
  "create-account-before-modal-body": "div",
  "create-account-header-bottom": "",
  "create-account-before-password": "",
  "create-account-after-password": "",
  "create-account-after-user-fields": "",
  "group-activity-bottom": "li",
  "before-manage-group-tags": "div",
  "about-wrapper": "",
  "above-static": "",
  "below-static": "",
  "topic-above-post-stream": "div",
  "edit-topic-title": "",
  "edit-topic-category": "",
  "edit-topic-tags": "",
  "edit-topic": "div",
  "topic-title-suffix": "",
  "topic-category-wrapper": "",
  "above-timeline": "div",
  "topic-navigation": "div",
  "before-topic-progress": "div",
  "topic-navigation-bottom": "div",
  "topic-above-posts": "div",
  "topic-additional-reviewable-actions": "",
  "topic-area-bottom": "div",
  "topic-above-footer-buttons": "div",
  "topic-above-suggested": "div",
  "topic-below-suggested": "",
  "below-discovery-categories": "div",
  "above-login": "",
  "above-static": "",
  "below-static": "",
  "below-login": "",
  "below-login-buttons": "",
  "custom-homepage": "",
  "user-activity-navigation-wrapper": "",
  "user-activity-bottom": "li",
  "user-notifications-bottom": "li",
  "above-user-summary-stats": "",
  "user-summary-stat": "li",
  "below-user-summary-stats": "",
  "user-summary-top-category-row": "",
  "after-user-summary-badges": "",
  "user-badges-content": "",
  "after-user-profile-badges": "",
  "above-user-bookmarks": "div",
  "user-messages-above-navigation": "",
  "user-messages-controls-bottom": "",
  "user-profile-above-collapsed-info": "",
  "user-profile-secondary": "",
  "user-notifications-empty-state": "",
  "user-notifications-above-filter": "",
  "user-notifications-after-filter": "",
  "user-notifications-list-bottom": "",
  "after-groups-index-container": "div",
  "user-preferences-nav-under-interface": "div",
  "user-preferences-nav": "li",
  "above-user-preferences": "div",
  "login-before-modal-body": "div",
  "login-header-bottom": "",
  "below-login-page": "",
  "tags-below-title": "div",
  "above-site-header": "div",
  "below-site-header": "div",
  "before-main-outlet": "",
  "above-main-container": "div",
  "top-notices": "div",
  "main-outlet-bottom": "",
  "after-main-outlet": "",
  "above-footer": "div",
  "below-footer": "div",
  "footer-nav": "",
  "group-index-table-header-after-username": "",
  "group-index-table-row-after-username": "",
  "before-group-container": "div",
  "group-details-after": "div",
  "above-review-filters": "div",
  "below-badges-title": "div",
  "selectable-user-badges": "",
  "full-page-search-above-search-header": "div",
  "full-page-search-filters": "",
  "full-page-search-below-search-header": "div",
  "full-page-search-below-search-info": "div",
  "full-page-search-below-results": "",
  "above-user-profile": "div",
  "before-user-profile-avatar": "",
  "user-post-names": "div",
  "user-location-and-website": "div",
  "before-user-profile-bio": "div",
  "user-profile-public-fields": "div",
  "user-profile-primary": "div",
  "user-profile-controls": "li",
  "after-chat-channel-username": "",
  "chat-join-channel-button": "",
  "below-direct-chat-channels": "",
  "chat-drawer-before-content": "",
  "below-public-chat-channels": "",
  "chat-composer-inline-buttons": "",
  // plugins
  "circles-background": "",
  "circles-logo": "",
  "circles-card-actions": "",
  "circles-card": "",
  "circles-card-featured-topic": "",
  "circles-card-stats": "",
  "circles-search-filter": "",
  "circles-view-navigation-tabs": "",
  "circles-view-navigation-tab-item": "",
  "circles-view-page": "",
  "circles-view-info-name": "",
  "circles-manage-navigation-items": "",
  "circles-activity-topics": "",
  "circles-activity-topics-paginated-list": "",
  "circles-manage-profile": "",
  "circles-view-page": "div",
  "circles-view-info-name": "div",
  "circles-manage-navigation-items": "",
  "circles-activity-topics": "",
  "circles-activity-topics-paginated-list": "",
  "circles-manage-profile": "div",
  "circles-browser-navigation-header": "",
  "circles-browser-navigation-filters": "",
  "circles-browser-navigation-actions": "",
  "user-circles-content": "",
  "before-filtered-category-drop": "",
  "agc-sidebar-top": "",
  "above-topic-list": "",
  "homepage-topic-list-admin-dropdown-after": "",
  "homepage-topic-list-navigation": "",
  "below-topic-list-toggle": "",
  "user-activity-bottom": "",
  "vendor-directory-main-outlet": "",
  "search-banner-below-input": "",
  "above-custom-category-columns": "",
  "ai-bot-conversations-above-input": "",
  "ai-bot-header-icon": "",
  "upcoming-events-list-container": "",
  "discourse-post-event-status-and-creators": "",
  "discourse-post-event-info": "",
  "discourse-post-event-status-buttons": "",
  "discourse-post-event-status-going-button": "",
  "discourse-post-event-status-interested-button": "",
  "discourse-post-event-status-not-going-button": "",
  "post-event-builder-form": "div",
  "inside-category-experts-search-fields": "div",
  "after-docs-topic": "div",
  "custom-checkbox": "",
  "categories-controls-buttons-bottom": "",
  "tags-controls-buttons-bottom": "",
  "before-docs-tag-list": "div",
  "below-docs-topic": "div",
  "after-docs-empty-results": "div",
  "before-docs-search": "div",
  "category-banners-after-title": "",
  "category-banners-after-description": "",
  "admin-menu": "",
  "easy-footer-second-box": "",
  "kanban-card-bottom": "",
  "above-right-sidebar-blocks": "",
  "below-right-sidebar-block": "",
  "below-right-sidebar-blocks": "",
  "search-banner-below-headline": "",
  "search-banner-below-input": "",
  "above-discourse-showcased-categories": "div",
  "below-featured-tiles": "div",
};

export default connectorTagNames;
