/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'appState', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function (ko, appState, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {

    function ControllerViewModel() {

      var self = this;

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
        this.message(event.detail.message);
        this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '', redirect: 'login' },
        { path: 'login', detail: { label: 'Login', iconClass: '' } },
        { path: 'register', detail: { label: 'Register', iconClass: '' } },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
        { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } },


        { path: 'notfound', detail: { label: 'Not Found', iconClass: 'oj-ux-ico-warning' } }
      ];

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });


      router.sync().then(() => {
        const currentPath = router._activeState.path ? router._activeState.path : '';
        const storedUser = localStorage.getItem('current_username');
        if (!storedUser) {
          alert("please login first");
          router.go({ path: 'login' });
          return;
        }
        const knownPaths = navData
          .filter(item => !item.redirect)
          .map(item => item.path);

        // Allow 'login' explicitly even if not in knownPaths
        if (currentPath === 'login' || knownPaths.includes(currentPath)) {
          router.go({ path: currentPath });
        } else {
          router.go({ path: 'notfound' });
        }
      }).catch(err => {
        console.error("Routing error:", err);
        router.go({ path: 'notfound' });
      });

      this.router = router;

      let knockoutRouter = new KnockoutRouterAdapter(router);

      this.currentPath = knockoutRouter.state;

      this.isLoginPage = ko.pureComputed(() => {
        return this.currentPath() === 'login';
      });

      // this.moduleAdapter = new ModuleRouterAdapter(router);
      this.moduleAdapter = new ModuleRouterAdapter(router, { params: { router: router } });

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      // this.navDataProvider = new ArrayDataProvider(navData.slice(1), { keyAttributes: "path" });
      this.navDataProvider = new ArrayDataProvider(
        navData.filter(item => !item.redirect && item.path !== 'login' && item.path !== 'register' && item.path !== 'notfound'),
        { keyAttributes: "path" }
      );

      // Computed to check if current page is login or register
      this.isLoginOrRegisterPage = ko.pureComputed(() => {
        const page = this.currentPath()?.path;
        return page === 'login' || page === 'register' || page === 'notfound';
      });


      // Drawer
      self.sideDrawerOn = ko.observable(false);

      // Close drawer on medium and larger screens
      this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });

      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        self.sideDrawerOn(!self.sideDrawerOn());
      }

      self.appName = appState.appName;
      self.userLogin = appState.userLogin;

      var storedUser = localStorage.getItem('current_username');
      if (storedUser) {
        var cleanName = storedUser.split('@')[0];
        self.appName("Welcome, " + cleanName);
        self.userLogin(storedUser);
      }

      this.signOut = () => {

        // ✅ Clear saved user
        localStorage.removeItem('current_username');

        // ✅ Reset global header observables
        if (window.appController) {
          window.appController.appName("Please Login");
          window.appController.userLogin("Guest");
        }

        this.router.go({ path: 'login' });
      };


      // Footer
      this.footerLinks = [
        { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
    }
    // release the application bootstrap busy state
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();

    return new ControllerViewModel();
  }
);



