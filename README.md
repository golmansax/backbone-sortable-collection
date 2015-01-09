# Backbone Sortable Collection

[![Build Status](https://travis-ci.org/golmansax/backbone-sortable-collection.svg?branch=master)](https://travis-ci.org/golmansax/backbone-sortable-collection)
[![Code Climate](https://codeclimate.com/github/golmansax/backbone-sortable-collection/badges/gpa.svg)](https://codeclimate.com/github/golmansax/backbone-sortable-collection)
[![Test Coverage](https://codeclimate.com/github/golmansax/backbone-sortable-collection/badges/coverage.svg)](https://codeclimate.com/github/golmansax/backbone-sortable-collection)

## Sample Usage
```js
var TurtleCollection = Backbone.SortableCollection.extend({

  // Sorts are named by the key in this object
  comparators: {
    initial: function (turtle) { return turtle.get('initial'); },

    // shorthand for function (food) { return turtle.get('food'); },
    food: 'get'

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

  // Sorts can be called by name, or as an object with name => dir ('asc' or 'desc')
  defaultSort: 'initial' // or { initial: 'desc' }
});

var turtles = new TurtleCollection([
  { initial: 'L', food: 'rice' },
  { initial: 'R', food: 'cereal' },
  { initial: 'D', food: 'pizza' },
  { initial: 'M', food: 'pizza' }
]);

// Default sort is active
console.log(turtles.pluck('initial')); // ['D', 'L', 'M', 'R']

// Single sort
turtles.changeSort('food');
console.log(turtles.pluck('initial')); // ['R', 'D', 'M', 'L']

// Bi-directional multi-sort
turtles.changeSort([{ weird: 'desc' }, 'initial']);
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
