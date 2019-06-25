import generateDues from './generateDues';
import getItemQuantity, { getPersonOneItemQuantity } from './utils/getItemQuantity';

$(document).ready(() => {
  // Start from the second person, since we already have two people by default
  let personIndex = 2;
  const itemQuantity = getItemQuantity();

  // Add a person with a consecutive index starting from 2
  $('#addPerson').click(() => {
    personIndex += 1;

    $('tbody').append(
      `<tr>
        <td>
          <input type="text" placeholder="Bob ${personIndex}" />
        </td>
        <td>$<span class="due${personIndex}">0</span></td>
      </tr>`,
    );

    // Loop for each item that person one has,
    // make sure subsequent people have the same amount when they are added.
    for (let i = 0; i < getPersonOneItemQuantity(); i += 1) {
      $(`.due${personIndex}`).parent().after(
        `
        <td>
          <input type="number"class="person${personIndex} item${itemQuantity}"min="0" />
        </td>
        `,
      );
    }

    // Generate dues for additional folk
    generateDues();
  });
});
