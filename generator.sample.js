function* range(start, end, step) {
  let i = start;
  while (i < end) {
    yield i;
    i += step;
  }
}
//------------------------------------
const generator = range(0, 10, 1);
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
