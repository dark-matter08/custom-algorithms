class Sorting {
  insertion(array, arrLength) {
    for (let index = 1; index < arrLength; index++) {
      console.log('================================================');

      let key = array[index];
      let previous = index - 1;

      console.log(array[previous], '=at=', index);
      while (previous > -1 && array[previous] > key) {
        console.log('============Moves============');

        console.log(array[previous], '=key as =', key);
        console.log(array[previous], '=prev as=', array[previous]);
        array[previous + 1] = array[previous];
        previous = previous - 1;
        console.log('Array at this point: ', array);
      }
      array[previous + 1] = key;
    }

    return array;
  }
}

const sorter = new Sorting();

const original = [12, 23, 43, 28, 13];
const original2 = [5, 2, 4, 6, 1, 3];
console.log('Original Array     : ', original);
const sortedInsertion = sorter.insertion([...original], original.length);

console.log('Sorted by insertion: ', sortedInsertion);
