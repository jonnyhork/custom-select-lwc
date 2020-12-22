import { api, track, LightningElement } from 'lwc';
import { mockMDT } from '../model';

export default class CustomSelect extends LightningElement {
  @api allFields: string[] = mockMDT.fields.Account; // all possible fields
  @api selectedFields: string[] = []; // selections made from text
  @track _renderedFields: string[] = [];
  searchTerm = '';
  originalSearchTerm = '';
  fieldSearchBar: HTMLInputElement;
  optionsWrapper: HTMLElement;
  optionList: HTMLCollection;
  optionListIsOpen = false;
  availableFields: string[] = [];
  activeOptionIndex = -1;

  getAvailableFields(): string[] {
    return this.allFields.filter((field) => {
      return !this.selectedFields.includes(field);
    });
  }
  // close the options menu when user click outside element
  connectedCallback() {
    document.addEventListener('click', () => {
      this.handleCloseOptions();
    });
  }

  renderedCallback() {
    this.optionsWrapper = this.template.querySelector('.options__wrapper');
    this.fieldSearchBar = this.template.querySelector(
      'input[name=fieldSearchBar]'
    );
    this.availableFields = this.getAvailableFields();
    this.optionList = this.optionsWrapper.children;
  }

  filterFields() {
    if (this.searchTerm) {
      const filteredFields = this.availableFields.filter((field) => {
        return field.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      this._renderedFields = filteredFields;
    } else {
      this._renderedFields = this.availableFields;
    }
  }

  handleCloseOptions() {
    this.optionsWrapper.classList.remove('options--open');
    this.optionListIsOpen = false;
  }

  openOptionsMenu() {
    this.optionsWrapper.classList.add('options--open');
    this.optionListIsOpen = true;
  }

  handleOpenOptions(e) {
    e.preventDefault();
    e.stopPropagation();
    this.activeOptionIndex = -1;
    this.openOptionsMenu();
    this.filterFields();
  }

  handleFieldSearch(e) {
    e.preventDefault();
    this.openOptionsMenu();
    this.searchTerm = e.target.value;
    this.originalSearchTerm = this.searchTerm;
    this.filterFields();
  }

  handleOptionClickSelection(e) {
    e.preventDefault();
    e.stopPropagation();
    const optionValue = e.target.getAttribute('data-option-value');
    if (optionValue) {
      this.addSelectedField(optionValue);
      this.resetSearchBar();
      this.availableFields = this.getAvailableFields();
    } else {
      console.log('NO Option Value from DOM!');
    }
  }

  handleKeyDown(e) {
    const key = e.key;
    switch (key) {
      case 'ArrowDown':
        if (this.haveOptionsToNavigate()) {
          this.clearOptionHighlight();

          this.activeOptionIndex =
            this.activeOptionIndex < this.optionList.length - 1
              ? ++this.activeOptionIndex
              : this.optionList.length - 1;

          this.addOptionHighlight(this.activeOptionIndex);
          this.searchTerm = this.getCurrentOptionValue();
        }
        break;
      case 'ArrowUp':
        if (this.haveOptionsToNavigate()) {
          this.clearOptionHighlight();

          if (this.activeOptionIndex === 0) {
            this.searchTerm = this.originalSearchTerm;
            this.fieldSearchBar.focus();
            this.activeOptionIndex = -1;
            break;
          }
          // make sure cursor is in range of list
          this.activeOptionIndex =
            this.activeOptionIndex > 0 ? --this.activeOptionIndex : -1;

          this.addOptionHighlight(this.activeOptionIndex);
          this.searchTerm = this.getCurrentOptionValue();
        }
        break;
      case 'Enter':
        // submit selection if searchTerm is a valid field
        this.addSelectedField(this.getCurrentOptionValue());
        break;
      default:
        break;
    }
  }

  clearOptionHighlight() {
    if (this.optionList[this.activeOptionIndex]) {
      this.optionList[this.activeOptionIndex].classList.remove(
        'option--highlight'
      );
    }
  }

  addOptionHighlight(position: number) {
    if (this.optionList[position]) {
      this.optionList[position].classList.add('option--highlight');
    }
  }

  getCurrentOptionValue(): string {
    return this.optionList[this.activeOptionIndex]
      ? this.optionList[this.activeOptionIndex].getAttribute(
          'data-option-value'
        )
      : '';
  }

  addSelectedField(field: string) {
    // Only add valid fields, need to be case insensitive.
    const isValidField: string[] = this.getAvailableFields().filter((field) => {
      return field.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    if (isValidField.length) {
      this.selectedFields = [...this.selectedFields, field];
      this.resetSearchBar();
    } else {
      console.error('that is not a valid field');
    }
  }

  resetSearchBar() {
    this.clearOptionHighlight();
    this.handleCloseOptions();
    this.searchTerm = '';
    this.originalSearchTerm = '';
    this.activeOptionIndex = -1;
  }

  haveOptionsToNavigate() {
    return this.optionListIsOpen && this.optionList.length;
  }
}

/*NOTE:
  - should the options div and input be separate elements?
*/
