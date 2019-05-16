import getPeopleQuantity from './getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    for (let i = 0; i < peopleQuantity; i += 1) {
      $(`.item${i}`).on('input', () => {
        $(`.due${i}`).html($(`.item${i}`).val());
        console.log(i);
      });
    }
  });
}
