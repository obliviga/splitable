import generateDues from './generateDues';
import getItemQuantity from './utils/getItemQuantity';

$(document).ready(() => {
  let personIndex = 1;
  const itemQuantity = getItemQuantity();

  // Add a person with a consecutive index starting from 2
  $('#addPerson').click(() => {
    personIndex += 1;

    $('tbody').append(
      `<tr>
        <td>
          <input type="text" placeholder="Bob ${personIndex + 1}" />
        </td>
        <td>$<span class="due${personIndex + 1}">0</span></td>
        <td>
          <input type="number"class="person${personIndex + 1} item${itemQuantity}"min="0" />
        </td>
      </tr>`,
    );

    // Generate dues for additional folk
    generateDues();
  });
});
