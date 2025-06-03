define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojbutton',
  'ojs/ojinputtext',
  'ojs/ojformlayout',
  'ojs/ojvalidationgroup',
  'ojs/ojtable',
  'ojs/ojarraydataprovider',
  'ojs/ojasyncvalidator-regexp'
], function (
  oj,
  ko,
  Button,
  InputText,
  FormLayout,
  ValidationGroup,
  Table,
  ArrayDataProvider,
  AsyncRegExpValidator
) {
  function EmployeeViewModel() {
    this.employeeId = ko.observable('');
    this.employeeName = ko.observable('');
    this.employeeEmail = ko.observable('');
    this.employeePhone = ko.observable('');
    this.employeeDepartment = ko.observable('');
    this.employeeCity = ko.observable('');

    this.employeeList = ko.observableArray([]);


    // Load from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('employeeData')) || [];
    this.employeeList = ko.observableArray(storedEmployees);



    this.employeeDataProvider = new ArrayDataProvider(this.employeeList, {
      keyAttributes: 'employeeId'
    });

    // Validators
    this.emailValidator = [
      new AsyncRegExpValidator({
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        hint: 'Enter a valid email address',
        messageSummary: 'Invalid Email',
        messageDetail: 'Email format should be like user@example.com'
      })
    ];

    this.phoneValidator = [
      new AsyncRegExpValidator({
        pattern: '^\\d{10}$',
        hint: 'Enter 10-digit phone number',
        messageSummary: 'Invalid Phone',
        messageDetail: 'Phone number must be exactly 10 digits'
      })
    ];

    this.submitForm = () => {
      const valid = this._checkValidationGroup();
      if (valid) {
        const newEmployee = {
          employeeId: this.employeeId(),
          employeeName: this.employeeName(),
          employeeEmail: this.employeeEmail(),
          employeePhone: this.employeePhone(),
          employeeDepartment: this.employeeDepartment(),
          employeeCity: this.employeeCity()
        };

        this.employeeList.push(newEmployee);



        // 🔁 Save to localStorage
        localStorage.setItem('employeeData', JSON.stringify(this.employeeList()));


        console.log('Employee Added:', newEmployee);

        this.employeeId('');
        this.employeeName('');
        this.employeeEmail('');
        this.employeePhone('');
        this.employeeDepartment('');
        this.employeeCity('');
      }
    };

    this._checkValidationGroup = function () {
      const tracker = document.getElementById('tracker');
      if (tracker && tracker.valid === 'valid') {
        return true;
      } else {
        tracker.showMessages();
        tracker.focusOn('@firstInvalidShown');
        return false;
      }
    };
  }

  //   self.logout = function () {
  //   localStorage.removeItem('loggedInUser');
  //   window.location.href = 'http://localhost:8000/?ojr=login';
  // };


  return new EmployeeViewModel();
});




