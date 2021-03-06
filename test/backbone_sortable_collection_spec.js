var chai = require('chai');
chai.use(require('dirty-chai'));
var expect = chai.expect;
var SortableCollection = require('../lib/backbone_sortable_collection');
var _ = require('underscore');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('backbone_sortable_collection', function () {
  'use strict';

  var leo, raf, don, mike, createTurtles;

  beforeEach(function () {
    leo = { initial: 'L', food: 'rice', numWeapons: 2, age: 15.8 };
    raf = { initial: 'R', food: 'cereal', numWeapons: 2, age: 15.7 };
    don = { initial: 'D', food: 'pizza', numWeapons: 1, age: 15.5 };
    mike = { initial: 'M', food: 'pizza', numWeapons: 2, age: 15.3 };

    var defaultOptions = {
      comparators: {
        initial: function (turtle) { return turtle.get('initial'); },
        food: 'getter',
        numWeapons: function (turtle) { return turtle.get('numWeapons'); },
        weird: function (turtleA, turtleB) {
          if (turtleA.get('initial') === 'M') {
            return -1;
          } else if (turtleB.get('initial') === 'M') {
            return 1;
          } else {
            return 0;
          }
        },
        age: 'getter'
      },
      sorts: {
        numWeapons: ['numWeapons', '!weird', 'initial'],
        oldest: '!age'
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
      var turtles = createTurtles({ defaultSort: '!initial' });
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

    it('supports get comparator', function () {
      turtles.changeSort('food');
      expect(turtles.pluck('initial')).to.deep.equal(['R', 'D', 'M', 'L']);
    });

    it('can multi-sort with directions', function () {
      turtles.changeSort(['food', '!weird']);
      expect(turtles.pluck('initial')).to.deep.equal(['R', 'D', 'M', 'L']);
    });

    it('can multi-sort with both types of comparators', function () {
      turtles.changeSort('numWeapons');
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'R', 'L', 'M']);
    });

    it('throws an error if the comparator is not set', function () {
      expect(function () {
        turtles.changeSort('shoes');
      }).to.throw('Comparator \'shoes\' is missing, add it to comparators');
    });

    it('throws an error if the direction is not valid', function () {
      expect(function () {
        turtles.changeSort({ initial: 'upside down' });
      }).to.throw('Sort direction must be either \'asc\' or \'desc\'');
    });

    it('throws an error if an object is given in wrong format', function () {
      var expectedError = 'Following should be in format of ' +
        '{ comparatorName: sortDirection }: {}';
      expect(function () {
        turtles.changeSort({});
      }).to.throw(expectedError);
    });

    it('fires a sort event', function () {
      var sortSpy = sinon.spy();
      turtles.on('sort', sortSpy);
      turtles.changeSort('initial');
      expect(sortSpy).to.have.been.called();
    });

    it('resets whether sort is reversed', function () {
      turtles.changeSort('initial');
      turtles.reverseSort();
      turtles.changeSort('initial');
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'L', 'M', 'R']);
    });

    it('works when sort is not an array', function () {
      turtles.changeSort('oldest');
      expect(turtles.pluck('initial')).to.deep.equal(['L', 'R', 'D', 'M']);
    });
  });

  describe('#reverseSort', function () {
    var turtles;

    beforeEach(function () {
      turtles = createTurtles({ defaultSort: 'initial' });
    });

    it('reverses the sort', function () {
      turtles.reverseSort();
      expect(turtles.pluck('initial')).to.deep.equal(['R', 'M', 'L', 'D']);
      turtles.reverseSort();
      expect(turtles.pluck('initial')).to.deep.equal(['D', 'L', 'M', 'R']);
    });

    it('fires a sort event', function () {
      var sortSpy = sinon.spy();
      turtles.on('sort', sortSpy);
      turtles.reverseSort();
      expect(sortSpy).to.have.been.called();
    });
  });
});
