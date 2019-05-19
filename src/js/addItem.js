$(document).ready(() => {
  let personIndex = 1;

  // Add a person with a consecutive index starting from 2
  $('#addItem').click(() => {
    $(`th:contains("Item ${personIndex}")`).after(
      `<th>Item ${personIndex + 1} Price</th>`,
    );

    personIndex += 1;

    $('tr td:last-child').after(
      `<td><input type="number" class="item0" min="0"/></td>`,
    );


  });
});
