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
        this.loginMessage = ko.observable('');


        // Check if already logged in
        var storedUser = localStorage.getItem('current_username');
        if (storedUser) {
            // Redirect to dashboard if user is already logged in
            if (router) {
                router.go({ path: 'dashboard' });
            }
            alert("You are already logged in as " + storedUser);
        }

        this.login = () => {
            const enteredUsername = this.username();
            const enteredPassword = this.password();

            if (!enteredUsername || !enteredPassword) {
                this.loginMessage("Please enter both username and password.");
                return;
            }


            // Try to retrieve saved users from localStorage
            let users = JSON.parse(localStorage.getItem('users')) || {};

            if (!users[enteredUsername]) {
                this.loginMessage("User not found. Please register first.");
                return;
            }

            if (users[enteredUsername] === enteredPassword) {
                this.loginMessage("");

                // ✅ Store username in localStorage
                localStorage.setItem('current_username', enteredUsername);

                const cleanName = enteredUsername.split('@')[0];
                appState.appName("Welcome, " + cleanName);  // ✅ Immediately update header
                appState.userLogin(enteredUsername);        // ✅ Update user login observable


                if (router) {
                    router.go({ path: 'dashboard' });
                }
                else {
                    this.loginMessage("Incorrect password.");
                }
                // window.location.href = "http://localhost:8000/?ojr=dashboard";
            } else {
                this.loginMessage("Incorrect ID or password.");
            }
        }


        this.register = () => {
            if (router) {
                router.go({ path: 'register' });
            }
        };

    }

    return MultiFormViewModel;
});


