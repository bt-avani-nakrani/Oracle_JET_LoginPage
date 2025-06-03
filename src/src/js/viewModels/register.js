define([
    'knockout',
    'appState',
    'ojs/ojinputtext',
    'ojs/ojbutton',
    'ojs/ojformlayout',
    'ojs/ojrouter'
], function (ko, appState) {
    function MultiFormViewModel(params) {
        const router = params?.router;

        this.username = ko.observable('');
        this.password = ko.observable('');
        this.registerMessage = ko.observable('');


        // Check if already logged in
        var storedUser = localStorage.getItem('current_username');
        if (storedUser) {
            // Redirect to dashboard if user is already logged in
            if (router) {
                router.go({ path: 'dashboard' });
            }
            alert("You are already logged in as " + storedUser);
        }



        this.register = () => {
            const enteredUsername = this.username();
            const enteredPassword = this.password();

            if (!enteredUsername || !enteredPassword) {
                this.registerMessage("Username and password cannot be empty.");
                return;
            }
            // Try to retrieve saved users from localStorage
            let users = JSON.parse(localStorage.getItem('users')) || {};

            if (users[enteredUsername]) {
                this.registerMessage("User already exists. Please login instead.");
                return;
            }

            users[enteredUsername] = enteredPassword;
            localStorage.setItem('users', JSON.stringify(users));


            const cleanName = enteredUsername.split('@')[0];
            appState.appName("Welcome, " + cleanName);  // ✅ Immediately update header
            appState.userLogin(enteredUsername);        // ✅ Update user login observable


            alert("User registered successfully.");
            if (router) {
                router.go({ path: 'dashboard' });
            }
            // window.location.href = "http://localhost:8000/?ojr=dashboard";
        }
        this.back = () => {
            if (router) {
                router.go({ path: 'login' });
            }
        }
    };
    return MultiFormViewModel;
});