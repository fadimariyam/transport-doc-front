export function generateId(type, list) {

  if (!type) return "";

  // take first 2 letters

  const prefix =
    type.substring(0, 2).toUpperCase();


  // filter same type

  const same = list.filter(
    (i) => i.type === type
  );


  // next number

  const num = same.length + 1;


  // format 001

  const formatted =
    String(num).padStart(3, "0");


  return prefix + formatted;

}