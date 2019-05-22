export default function getItemQuantity() {
  const itemQuantity = $('th:contains("Item")').length;

  return itemQuantity;
}
