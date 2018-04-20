import { Injectable } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PasswordValidation } from './password-validation';

type UserFields = 'email' | 'password' | 'passwordConfirmation';
type FormErrors = {[u in UserFields]: string };

@Injectable()
export class FormValidatorService {
  public userForm: FormGroup;
  formErrors: FormErrors = {
    'email': '',
    'password': '',
    'passwordConfirmation': ''
  };

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
    'passwordConfirmation': {
      'required': 'Password is required.',
      'equalToPassword': 'The Password and Confirm Password that you enter must be identical.',
    }
  };

  constructor(private fb: FormBuilder) { }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
      'passwordConfirmation': ['', [
        Validators.required,
      ]],
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  private onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) &&
         (field === 'email' || field === 'password' || field === 'passwordConfirmation')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
