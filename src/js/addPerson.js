import generateDues from './generateDues';

$(document).ready(() => {
  let personIndex = 1;

  // Add a person with a consecutive index starting from 2
  $('#addPerson').click(() => {
    // Generate dues for additional folk
    generateDues();
    personIndex += 1;

    $('tbody').append(
      `<tr><td><input type="text"class="name${personIndex}"placeholder="Bob ${personIndex + 1}"></td><td>$<span class="due${personIndex}">0</span></td><td><input type="number"class="item${personIndex}"min="0"></td></tr>`,
    );
  });
});
