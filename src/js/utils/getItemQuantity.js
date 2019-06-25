export default function getItemQuantity() {
  const itemQuantity = $('th:contains("Item")').length;

  return itemQuantity;
}

export function getPersonOneItemQuantity() {
  const personOneItemQuantity = $('tr:first-child input[type="number"]').length;
  
  return personOneItemQuantity;
}
