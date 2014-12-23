# Backbone Sortable Collection

[![Build Status](https://travis-ci.org/golmansax/backbone-sortable-collection.svg?branch=master)](https://travis-ci.org/golmansax/backbone-sortable-collection)
[![Coverage Status](https://img.shields.io/coveralls/golmansax/backbone-sortable-collection.svg)](https://coveralls.io/r/golmansax/backbone-sortable-collection?branch=master)

## Sample Usage
```js
var TurtleCollection = Backbone.SortableCollection.extend({

  // Sorts are named by the key in this object
  comparators: {
    initial: function (turtle) { return turtle.get('initial'); },
    food: function (food) { return turtle.get('food'); },
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
  
  // Sorts can be called by name, or as an object with name and dir ('asc' or 'desc')
  defaultSort: 'initial' // or { name: 'initial', dir: 'desc' }
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
turtles.changeSort([{ name: 'weird', dir: 'desc' }, 'initial']);
console.log(turtles.pluck('initial')); // ['D', 'L', 'R', 'M']

// Fires sort event
turtes.on('sort', function () { console.log('Sorting!'); });
turtles.changeSort('initial'); // Sorting!
```

## Installation
```bash
# Node
npm install backbone-sortable-collection --save

# Bower
bower install backbone-sortable-collection
```
