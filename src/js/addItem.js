import getItemQuantity from './utils/getItemQuantity';
import getPeopleQuantity from './utils/getPeopleQuantity';

$(document).ready(() => {
  let itemIndex = 1;
  const itemQuantity = getItemQuantity();
  const peopleQuantity = getPeopleQuantity();

  // Add a person with a consecutive index starting from 2
  $('#addItem').click(() => {
    $(`th:contains("Item ${itemIndex}")`).after(
      `<th>Item ${itemIndex + 1} Price</th>`,
    );

    itemIndex += 1;

    $('tr td:last-child').after(
      `<td>
        <input type="number" class="person${1} item${itemIndex}" min="0" />
      </td>`,
    );
  });
});
