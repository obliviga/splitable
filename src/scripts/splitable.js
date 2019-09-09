import $ from 'jquery';

import { toFinancialNumber } from './util';

const TipOptions = Object.freeze({
  PERCENT: 'percent',
  FIXED: 'fixed',
});

export default class Splitable {
  constructor(selector) {
    /* DOM Elements */
    this._$el = $(selector);
    this.table = this._$el.find('table');
    // buttons
    this.addPersonBtn = this._$el.find('.add-person-btn');
    this.addItemBtn = this._$el.find('.add-item-btn');
    // inputs
    this.subtotalInput = this._$el.find('.subtotal-input');
    this.taxInput = this._$el.find('.tax-input');
    this.tipInput = this._$el.find('.tip-input');
    this.discountInput = this._$el.find('.discount-input');
    // labels
    this.totalLabel = this._$el.find('.total-label');
    this.itemizedTotalLabel = this._$el.find('.itemized-total-label');
    this.tipTotalLabel = this._$el.find('.tip-total-label');
    // messages
    this.totalMatchMessage = this._$el.find('.total-match-msg');
    this.totalMismatchMessage = this._$el.find('.total-mismatch-msg');

    this.totalMatchMessage.hide();
    this.totalMismatchMessage.hide();

    this.initState();
    this.bindEvents();
  }

  initState() {
    const toggledElements = $('table, .btn, .itemized-total ');

    this.personCount = this.table.find('.person-row').length;
    this.itemCount = this.table.find('.item-col-head').length;

    this.subtotal = this.fetchSubtotal();
    this.tax = this.fetchTax();
    this.discount = this.fetchDiscount();
    this.tipValue = this.fetchTipValue();

    this.tipOption = this._$el.find("input[name='tip-option-group']:checked").val();

    // If subtotal is empty, hide table and associated elements
    if (this.subtotal === 0) {
      toggledElements.hide();
    } else {
      toggledElements.show();
    }
  }

  /* Getters */
  get total() {
    const subtotal = this.subtotal;
    const tax = this.tax;
    const tip = this.tip;
    const discount = this.discount;
    const toggledElements = $('table, .btn, .itemized-total ');

    // If subtotal is empty, hide table and associated elements
    if (subtotal === 0) {
      toggledElements.hide();
    } else {
      toggledElements.show();
    }

    // Add placeholder to first item input field
    $("[data-person-index='1'][data-item-index='1']").attr('placeholder', '66.55');

    return (subtotal * (1 - (discount / 100))) + tip + tax;
  }

  get itemizedTotal() {
    // Add up all the dues
    return this.table.find('.due').toArray()
      .reduce((sum, $el) => sum += (+$($el).html()), 0);
  }

  get tip() {
    return +(this.tipOption === TipOptions.FIXED ? this.tipValue
      : (this.subtotal * this.tipValue / 100));
  }

  getPersonDue(idx) {
    if (!this.subtotal) return 0;

    const subtotal = this.subtotal;
    const tip = this.tip;
    const tax = this.tax;
    const discount = this.discount;

    const itemSum = this.table.find(`.person${idx}-item`)
      .toArray()
      .reduce((sum, $el) => sum += (+$el.value), 0);

    return (itemSum + (tip + tax) * (itemSum / subtotal)) * (1 - (discount / 100));
  }

  /* View Updates */
  updateItemizedTotal() {
    this.itemizedTotalLabel.html(toFinancialNumber(this.itemizedTotal));
  }

  updateTotal() {
    this.totalLabel.html(toFinancialNumber(this.total));
    this.onTotalChanged();
  }

  updateTipTotal() {
    this.tipTotalLabel.html(toFinancialNumber(this.tip));
  }

  updateDues() {
    this.table.find('.due').each((i, el) => {
      const personIdx = i + 1;
      const due = this.getPersonDue(personIdx);
      $(el).html(toFinancialNumber(due));
    });
    this.onDuesChanged();
  }

  updateCompareTotalMessage() {
    if (toFinancialNumber(this.total) === toFinancialNumber(this.itemizedTotal)) {
      this.totalMatchMessage.show();
      this.totalMismatchMessage.hide();
    } else {
      this.totalMatchMessage.hide();
      this.totalMismatchMessage.show();
    }

    const toggledElements = $('table, .btn, .itemized-total');

    // If subtotal is empty, hide table and associated elements
    if (this.subtotal === 0) {
      toggledElements.hide();
    } else {
      toggledElements.show();
    }
  }

  /* Events */
  onTotalChanged() {
    this.updateDues();
  }

  onDuesChanged() {
    this.updateItemizedTotal();
    this.updateCompareTotalMessage();
  }

  bindEvents() {
    this.addPersonBtn.click(this.addPerson.bind(this));
    this.addItemBtn.click(this.addItem.bind(this));

    this.subtotalInput.on('input', () => {
      this.subtotal = this.fetchSubtotal();
      this.updateTotal();
      this.updateTipTotal();
    });
    this.taxInput.on('input', () => {
      this.tax = this.fetchTax();
      this.updateTotal();
    });
    this.discountInput.on('input', () => {
      this.discount = this.fetchDiscount();
      this.updateTotal();
      this.updateTipTotal();
    });
    this.tipInput.on('input', () => {
      this.tipValue = this.fetchTipValue();
      this.updateTotal();
      this.updateTipTotal();
    });
    this._$el.find('input[name="tip-option-group"]').on('input', (e) => {
      this.tipOption = e.target.value;
      this.updateTotal();
      this.updateTipTotal();
    });
    this.table.on('input', '.item-input', (e) => {
      const personIdx = e.target.dataset.personIndex;
      const personDue = this.getPersonDue(personIdx);
      
      this.table.find(`.due${personIdx}`).html(toFinancialNumber(personDue));
      this.onDuesChanged();
    });
  }

  fetchSubtotal() {
    return +this.subtotalInput.val() || 0;
  }

  fetchTax() {
    return +this.taxInput.val() || 0;
  }

  fetchDiscount() {
    return +this.discountInput.val() || 0;
  }

  fetchTipValue() {
    return +this.tipInput.val() || 0;
  }
 
  addItem() {
    this.itemCount++;

    // Add the label for the new item column
    this.table.find('th:last-child').after(`<th id="item${this.itemCount}-col-head" class="item-col-head">Item ${this.itemCount}</th>`);

    const $rows = this.table.find('.person-row');

    // Add item price inputs for each person
    for (let i = 0; i < this.personCount; i++) {
      const personIdx = i + 1;
      $rows.eq(i).append(`
        <td>
            ${this.getItemInputHtmlString(personIdx, this.itemCount)}
        </td>
      `);
    }
  }

  addPerson() {
    this.personCount++;

    const personIdx = this.personCount;
    let html = `<tr id="person${personIdx}-row" class="person-row">`;
    html += `    <td>${this.getPersonNameInputHtmlString(personIdx)}</td>`;
    html += `    <td>$${this.getDueLabelHtmlString(personIdx, toFinancialNumber(0))}</td>`;
    // Add item price inputs
    for (let i = 1; i <= this.itemCount; i++) {
      html += '<td>';
      html += this.getItemInputHtmlString(personIdx, i);
      html += '</td>';
    }
    html += '</tr>';

    this.table.find('tbody').append(html);
  }

  getItemInputHtmlString(personIdx, itemIdx) {
    return `<input type="number" pattern="[0-9]*" inputmode="decimal" data-person-index="${personIdx}" data-item-index="${itemIdx}" class="item-input person${personIdx}-item" min="0" />`;
  }

  getPersonNameInputHtmlString(personIdx) {
    return `<input type="text" id="person${personIdx}-name" placeholder="Bob ${personIdx}" />`;
  }

  getDueLabelHtmlString(personIdx, dueValue) {
    return `<span data-person-index="${personIdx}" class="due due${personIdx}">${dueValue}</span>`;
  }
}
