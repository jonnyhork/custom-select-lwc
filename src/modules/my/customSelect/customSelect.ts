import { api, track, LightningElement } from 'lwc';
import { mockMDT } from '../model';

export default class CustomSelect extends LightningElement {
  @api allFields: string[] = mockMDT.fields.Account;
  @api selectedFields: string[];
  @track _renderedFields: string[] = [];
  searchTerm: string = '';

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

  handleFieldSearch(e) {
    e.preventDefault();
    this.searchTerm = e.target.value;
    this.filterFields();
  }
}
