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
    const self = this;

    // Observables for form
    self.employeeId = ko.observable('');
    self.employeeName = ko.observable('');
    self.employeeEmail = ko.observable('');
    self.employeePhone = ko.observable('');
    self.employeeDepartment = ko.observable('');
    self.employeeCity = ko.observable('');
    self.isUpdateMode = ko.observable(false);

    // Row editing
    self.editRow = ko.observable({ rowKey: null });

    // Load from localStorage or default
    const storedEmployees = JSON.parse(localStorage.getItem('employeeData')) || [];
    self.employeeList = ko.observableArray(storedEmployees);

    self.employeeDataProvider = new ArrayDataProvider(self.employeeList, {
      keyAttributes: 'employeeId'
    });

    // Validators
    self.emailValidator = [
      new AsyncRegExpValidator({
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        hint: 'Enter a valid email address',
        messageSummary: 'Invalid Email',
        messageDetail: 'Email format should be like user@example.com'
      })
    ];

    self.phoneValidator = [
      new AsyncRegExpValidator({
        pattern: '^\\d{10}$',
        hint: 'Enter 10-digit phone number',
        messageSummary: 'Invalid Phone',
        messageDetail: 'Phone number must be exactly 10 digits'
      })
    ];

    // Add new employee
    self.submitForm = () => {
      const valid = self._checkValidationGroup();
      if (!valid) return;

      const newEmployee = {
        employeeId: self.employeeId(),
        employeeName: self.employeeName(),
        employeeEmail: self.employeeEmail(),
        employeePhone: self.employeePhone(),
        employeeDepartment: self.employeeDepartment(),
        employeeCity: self.employeeCity()
      };

      self.employeeList.push(newEmployee);
      localStorage.setItem('employeeData', JSON.stringify(self.employeeList()));

      self._clearForm();
    };

    // Table row edit start
    self.handleRowEdit = function (event) {
      self.editRow({ rowKey: event.detail.rowKey });
    };

    // Table row edit end
    self.handleRowEditEnd = function (event) {
      const detail = event.detail;
      if (!detail.cancelEdit) {
        const editedRow = detail.rowContext.item.data;
        const index = self.employeeList().findIndex(emp => emp.employeeId === editedRow.employeeId);
        if (index !== -1) {
          self.employeeList.splice(index, 1, editedRow);
          localStorage.setItem('employeeData', JSON.stringify(self.employeeList()));
        }
      }
    };

    // Validation group checker
    self._checkValidationGroup = () => {
      const tracker = document.getElementById('tracker');
      if (tracker && tracker.valid === 'valid') {
        return true;
      } else {
        tracker.showMessages();
        tracker.focusOn('@firstInvalidShown');
        return false;
      }
    };

    // Clear form
    self._clearForm = () => {
      self.employeeId('');
      self.employeeName('');
      self.employeeEmail('');
      self.employeePhone('');
      self.employeeDepartment('');
      self.employeeCity('');
      self.isUpdateMode(false);
    };
  }

  return new EmployeeViewModel();
});
