import $ from 'jquery';

const TipOptions = Object.freeze({
    PERCENT: 'percent',
    FIXED: 'fixed'
});

export default class Splitable {

    constructor(selector) {
        //DOM elements
        this._$el = $(selector);
        this.table = this._$el.find('table');
        this.addPersonBtn = this._$el.find('.add-person-btn');
        this.addItemBtn = this._$el.find('.add-item-btn');
        this.subtotalInput = this._$el.find('.subtotal-input');
        this.taxInput = this._$el.find('.tax-input');
        this.tipInput = this._$el.find('.tip-input');
        this.discountInput = this._$el.find('.discount');
        this.totalLabel = this._$el.find('.total-label');
        this.itemizedTotalLabel = this._$el.find('.itemized-total-label');

        // state
        this.personCount = this.table.find('.person-row').length;
        this.itemCount = this.table.find('.item-col-head').length;

        this.bindEvents();
    }

    get total() {
        return this.subtotal * ((1 - this.discount) / 100) + this.tip + this.tax;
    }

    get itemizedTotal() {
        return this.table.find('.due').toArray()
            .reduce((sum, $el) => sum += (+$($el).html()), 0);
    }

    get subtotal() {
        return this.subtotalInput.val();
    }

    get discount() {
        return this.discountInput.val();
    }

    get tax() {
        return this.taxInput.val();
    }

    get tip() {
        const tipInputValue = this.tipInput.val();
        return this.tipOption === TipOptions.FIXED ? tipInputValue :
            (this.subtotal * tipInputValue / 100)
    }

    get tipOption() {
        return this._$el.find("input[name='tip-option']:checked").val() || TipOptions.FIXED;
    }

    getPersonDue(idx) {
        return this.table.find(`.person${idx}-item`)
            .toArray()
            .reduce((sum, $el) => sum += (+$el.value), 0);
    }

    updateItemizedTotal() {
        this.itemizedTotalLabel.html(this.itemizedTotal);
    }

    updateTotal() {
        this.totalLabel.html(this.total);
    }

    updateTipTotal() {
        // TODO
    }

    bindEvents() {
        this.addPersonBtn.click(this.addPerson.bind(this));
        this.addItemBtn.click(this.addItem.bind(this));

        this.table.on('input', '.item-input', (e) => {
            const personIdx = e.target.dataset.personIndex;
            this.table.find(`.due${personIdx}`).html(this.getPersonDue(personIdx));
            this.updateItemizedTotal();
        });

        this._$el.on('input', '.tip-input, .tax-input, .subtotal-input, .discount-input, input[name="tip-option"]', () => {
            this.updateTipTotal();

            this.updateTotal();
        })
    }

    addItem(defaultPrice) {
        this.itemCount++;

        // Add the label for the new item column
        this.table.find('th:last-child').after(
            `<th id="item${this.itemCount}-col-head" class="item-col-head">Item ${this.itemCount} Price</th>`
        );

        const $rows = this.table.find('.person-row');

        //Add item price inputs for each person
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
            html += `<td>`;
            html += this.getItemInputHtmlString(personIdx, i);
            html += `</td>`;
        }
        html += `</tr>`

        this.table.find('tbody').append(html);
    }

    getItemInputHtmlString(personIdx, itemIdx) {
        return `<input type="number" data-person-index="${personIdx}" data-item-index="${itemIdx}" class="item-input person${personIdx}-item" min="0" />`
    }

    getPersonNameInputHtmlString(personIdx) {
        return `<input type="text" id="person${personIdx}-name" placeholder="Bob ${personIdx}" />`
    }

    getDueLabelHtmlString(personIdx, dueValue) {
        return `<span class="due due${personIdx}">${dueValue}</span>`
    }
}