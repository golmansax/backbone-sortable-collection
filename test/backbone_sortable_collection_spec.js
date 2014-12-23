var expect = require('chai').expect;
var SortableCollection = require('../lib/backbone_sortable_collection');
var _ = require('underscore');

describe('backbone_sortable_collection', function () {
  'use strict';

  var leo, raf, don, mike, createTurtles;

  beforeEach(function () {
    leo = { initial: 'L', food: 'rice', numWeapons: 2 };
    raf = { initial: 'R', food: 'cereal', numWeapons: 2 };
    don = { initial: 'D', food: 'pizza', numWeapons: 1 };
    mike = { initial: 'M', food: 'pizza', numWeapons: 2 };

    var defaultOptions = {
      comparators: {
        initial: function (turtle) { return turtle.get('initial'); },
        food: function (turtle) { return turtle.get('food'); },
        numWeapons: function (turtle) { return turtle.get('numWeapons'); },
        weird: function (turtleA, turtleB) {
          if (turtleA.get('initial') === 'M') {
            return -1;
          } else if (turtleB.get('initial') === 'M') {
            return 1;
          } else {
            return 0;
          }
        }
      }
    };

    createTurtles = function (options) {
      var myOptions = _(defaultOptions).extend(options);
      var TurtleCollection = SortableCollection.extend(myOptions);
      return new TurtleCollection([leo, raf, don, mike]);
    };
  });

  describe('#initialize', function () {
    it('works without defaultSort', function () {
      var turtles = createTurtles();
      expect(turtles.pluck('initial')).to.deep.equal(['L', 'R', 'D', 'M']);
    });

    it('sets defaultSort if provided', function () {
      var turtles = createTurtles({ defaultSort: 'initial' });
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'L', 'M', 'R']);
    });

    it('sorts with direction in if provided', function () {
      var sort = { name: 'initial', dir: 'desc' };
      var turtles = createTurtles({ defaultSort: sort });
      expect(turtles.pluck('initial')).to.deep.equal(['R', 'M', 'L', 'D']);
    });
  });

  describe('#changeSort', function () {
    var turtles;

    beforeEach(function () { turtles = createTurtles(); });

    it('works with sorts on one comparator', function () {
      turtles.changeSort('initial');
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'L', 'M', 'R']);
    });

    it('can multi-sort with both types of comparators', function () {
      turtles.changeSort(['food', { name: 'weird', dir: 'desc' }]);
      expect(turtles.pluck('initial')).to.deep.equal(['R', 'D', 'M', 'L']);
    });

    it('can multi-sort with directions', function () {
      turtles.changeSort(['numWeapons', 'weird', 'food']);
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'M', 'R', 'L']);
    });

    it('throws an error if the comparator is not set', function () {
      expect(function () {
        turtles.changeSort('shoes');
      }).to.throw('Comparator \'shoes\' is missing, add it to comparators');
    });

    it('throws an error if the direction is not valid', function () {
      expect(function () {
        turtles.changeSort({ direction: 'upside down' });
      }).to.throw('Sort direction must be either \'asc\' or \'desc\'');
    });
  });
});
