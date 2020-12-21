import { api, track, LightningElement } from 'lwc';
import { mockMDT } from '../model';

export default class CustomSelect extends LightningElement {
  @api allFields: string[] = mockMDT.fields.Account;
  @api selectedFields: string[] = [];
  @track _renderedFields: string[] = [];
  searchTerm: string = '';
  optionsWrapper: HTMLElement;

  connectedCallback() {
    document.addEventListener('click', (e) => {
      this.handleClose(e);
    });
  }

  renderedCallback() {
    this.optionsWrapper = this.template.querySelector('.options__wrapper');
  }

  filterFields() {
    if (this.searchTerm) {
      const filteredFields = this.allFields.filter((field) => {
        return field.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      this._renderedFields = filteredFields;
    } else {
      this._renderedFields = this.allFields;
    }
  }

  handleClose(e) {
    e.preventDefault();
    this.optionsWrapper.classList.remove('options--open');
  }

  handleOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    const optionsWrapper = this.template.querySelector('.options__wrapper');
    optionsWrapper.classList.add('options--open');
    this.filterFields();
  }

  handleFieldSearch(e) {
    e.preventDefault();
    this.searchTerm = e.target.value;
    this.filterFields();
  }

  handleFieldSelected(e) {
    e.preventDefault();
    e.stopPropagation();
    const optionValue = e.target.getAttribute('data-option-value');
    if (optionValue) {
      this.selectedFields = [...this.selectedFields, optionValue];
    } else {
      console.log('NO Option Value!');
    }
  }
}
