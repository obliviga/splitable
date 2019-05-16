$(document).ready(() => {
  let personIndex = 1;

  // Add a person with a consecutive index starting from 2
  $('#addPerson').click(() => {
    personIndex += 1;

    $('tbody').append(
      `<tr><td><input type="text"placeholder="Bob"></td><td>$<span class="due${personIndex}">0</span></td><td><input type="number"min="0"></td></tr>`,
    );
  });
});
