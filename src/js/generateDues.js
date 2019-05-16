import getPeopleQuantity from './getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    for (let i = 0; i < peopleQuantity; i += 1) {
      $(`.item${i}`).on('input', () => {
        $(`.due${i}`).html($(`.item${i}`).val());
      });
    }
  });
}

// Call the function immediately, to affect the two default people
generateDues();
