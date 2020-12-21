import { api, track, LightningElement } from 'lwc';
import { mockMDT } from '../model';

export default class CustomSelect extends LightningElement {
  @api allFields: string[] = mockMDT.fields.Account;
  @api selectedFields: string[];
  _filteredFields: string[] = [];

  renderedCallback() {
    if (this.allFields.length) {
      this._filteredFields = this.allFields;
    }
  }
}
