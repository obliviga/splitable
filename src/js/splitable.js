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
    this.personCount = this.table.find('.person-row').length;
    this.itemCount = this.table.find('.item-col-head').length;
    this.subtotal = +this.subtotalInput.val() || 0;
    this.discountValue = +this.discountInput.val() || 0;
    this.tax = +this.taxInput.val() || 0;
    this.tipValue = +this.tipInput.val() || 0;
    this.tipOption = this._$el.find("input[name='tip-option']:checked").val();
  }

  /* Getters */
  get total() {
    // Make sure we don't get any undefined values
    const subtotal = this.subtotal || 0;
    const tax = this.tax || 0;
    const tip = this.tip || 0;
    const discount = this.discount || 0;

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

    const subtotal = this.subtotal || 0;
    const tip = this.tip || 0;
    const tax = this.tax || 0;
    const discount = this.discount || 0;

    const itemSum = this.table.find(`.person${idx}-item`)
      .toArray()
      .reduce((sum, $el) => sum += (+$el.value), 0);
    const result = (itemSum + (tip + tax) * (itemSum / subtotal)) * (1 - (discount / 100));

    return toFinancialNumber(result);
  }

  /* View Updates */
  updateItemizedTotal() {
    this.itemizedTotalLabel.html(toFinancialNumber(this.itemizedTotal));
  }

  updateTotal() {
    this.totalLabel.html(toFinancialNumber(+this.total));
    this.onTotalChanged();
  }

  updateTipTotal() {
    this.tipTotalLabel.html(toFinancialNumber(+this.tip));
  }

  updateDues() {
    this.table.find('.due').each((i, el) => {
      const personIdx = i + 1;
      const due = this.getPersonDue(personIdx) || 0;
      $(el).html(due);
    });
    this.onDuesChanged();
  }

  updateCompareTotalMessage() {
    if (this.total === this.itemizedTotal) {
      this.totalMatchMessage.show();
      this.totalMismatchMessage.hide();
    } else {
      this.totalMatchMessage.hide();
      this.totalMismatchMessage.show();
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
      this.subtotal = +this.subtotalInput.val() || 0;
      this.updateTotal();
      this.updateTipTotal();
    });
    this.taxInput.on('input', () => {
      this.tax = +this.taxInput.val() || 0;
      this.updateTotal();
    });
    this.discountInput.on('input', () => {
      this.discount = +this.discountInput.val() || 0;
      this.updateTotal();
      this.updateTipTotal();
    });
    this.tipInput.on('input', () => {
      this.tipValue = +this.tipInput.val() || 0;
      this.updateTotal();
      this.updateTipTotal();
    });
    this._$el.find('input[name="tip-option"]').on('input', (e) => {
      this.tipOption = e.target.value;
      this.updateTotal();
      this.updateTipTotal();
    });
    this.table.on('input', '.item-input', (e) => {
      const personIdx = e.target.dataset.personIndex;
      this.table.find(`.due${personIdx}`).html(this.getPersonDue(personIdx));
      this.onDuesChanged();
    });
  }

  addItem() {
    this.itemCount++;

    // Add the label for the new item column
    this.table.find('th:last-child').after(
      `<th id="item${this.itemCount}-col-head" class="item-col-head">Item ${this.itemCount} Price</th>`,
    );

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
    html += `    <td>$${this.getDueLabelHtmlString(personIdx, 0)}</td>`;
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
    return `<input type="number" data-person-index="${personIdx}" data-item-index="${itemIdx}" class="item-input person${personIdx}-item" min="0" />`;
  }

  getPersonNameInputHtmlString(personIdx) {
    return `<input type="text" id="person${personIdx}-name" placeholder="Bob ${personIdx}" />`;
  }

  getDueLabelHtmlString(personIdx, dueValue) {
    return `<span data-person-index="${personIdx}" class="due due${personIdx}">${dueValue}</span>`;
  }
}
