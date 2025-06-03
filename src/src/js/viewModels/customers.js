define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojbutton',
  'ojs/ojinputtext',
  'ojs/ojformlayout',
  'ojs/ojvalidationgroup',
  'ojs/ojasyncvalidator-regexp'
], function (oj, ko, Button, InputText, FormLayout, ValidationGroup, AsyncRegExpValidator) {

  function EmployeeViewModel() {
    this.employeeId = ko.observable('');
    this.employeeName = ko.observable('');
    this.employeeEmail = ko.observable('');
    this.employeePhone = ko.observable('');
    this.employeeDepartment = ko.observable('');
    this.employeeCity = ko.observable('');

    // ✅ Email Validator (basic email pattern)
    this.emailValidator = [
      new AsyncRegExpValidator({
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        hint: 'Enter a valid email address (e.g., name@example.com)',
        messageSummary: 'Invalid Email Format',
        messageDetail: 'Please enter a valid email address in the format name@example.com'
      })
    ];

    // ✅ Phone Validator (exactly 10 digits)
    this.phoneValidator = [
      new AsyncRegExpValidator({
        pattern: '^\\d{10}$',
        hint: 'Enter a 10-digit phone number',
        messageSummary: 'Invalid Phone Number',
        messageDetail: 'Phone number must be exactly 10 digits'
      })
    ];

    this.submitForm = () => {
      const valid = this._checkValidationGroup();
      if (valid) {
        console.log('--- Employee Information ---');
        console.log('Employee ID:', this.employeeId());
        console.log('Employee Name:', this.employeeName());
        console.log('Email:', this.employeeEmail());
        console.log('Phone Number:', this.employeePhone());
        console.log('Department:', this.employeeDepartment());
        console.log('City:', this.employeeCity());

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

  return new EmployeeViewModel();
});
