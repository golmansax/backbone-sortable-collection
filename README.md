# Backbone Sortable Collection

[![Build Status](https://travis-ci.org/golmansax/backbone-sortable-collection.svg?branch=master)](https://travis-ci.org/golmansax/backbone-sortable-collection)
[![Code Climate](https://codeclimate.com/github/golmansax/backbone-sortable-collection/badges/gpa.svg)](https://codeclimate.com/github/golmansax/backbone-sortable-collection)
[![Test Coverage](https://codeclimate.com/github/golmansax/backbone-sortable-collection/badges/coverage.svg)](https://codeclimate.com/github/golmansax/backbone-sortable-collection)

## Sample Usage
```js
var TurtleCollection = Backbone.SortableCollection.extend({

  // Comparators are named by the key in this object
  comparators: {
    initial: function (turtle) { return turtle.get('initial'); },

    // shorthand for function (food) { return turtle.get('food'); },
    food: 'getter',

    age: 'getter',

    weird: function (turtleA, turtleB) {
      if (turtleA.get('initial') === 'M') {
        return -1;
      } else if (turtleB.get('initial') === 'M') {
        return 1;
      } else {
        return 0;
      }
    }
  },

  // Sorts can be used to string comparators together for multi-sort
  // Useful for specifying fallback comparators and default behavior
  sorts: {
    // Comparators can be called by name, prefixed with '!' if the order should be descending
    weird: ['!weird', 'initial'],

    // Also sorts can be called as a string if there is only one comparator
    oldest: '!age'

    // By default, sort only uses the comparator, so following line is redundant
    // initial: ['initial']
  },

  defaultSort: 'initial'
});

var turtles = new TurtleCollection([
  { initial: 'L', food: 'rice', age: 15.8 },
  { initial: 'R', food: 'cereal', age: 15.7 },
  { initial: 'D', food: 'pizza', age: 15.5 },
  { initial: 'M', food: 'pizza', age: 15.3 }
]);

// Default sort is active
console.log(turtles.pluck('initial')); // ['D', 'L', 'M', 'R']

// Single sort
turtles.changeSort('food');
console.log(turtles.pluck('initial')); // ['R', 'D', 'M', 'L']

// Bi-directional multi-sort
turtles.changeSort('weird');
// turtles.changeSort(['!weird', 'initial']); would achieve same result
console.log(turtles.pluck('initial')); // ['D', 'L', 'R', 'M']

// Fires sort event
turtes.on('sort', function () { console.log('Sorting!'); });
turtles.changeSort('initial'); // Sorting!

// Reverse sort (also fires sort event)
turtles.reverseSort(); // Sorting!
console.log(turtles.pluck('initial')); // ['M', 'R', 'L', 'D']
```

## Installation
```bash
# Node
npm install backbone-sortable-collection --save

# Bower
bower install backbone-sortable-collection
```
