(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore', 'backbone'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('underscore'), require('backbone'));
  } else {
    // Browser globals
    root.Backbone.SortableCollection = factory(root._, root.Backbone);
  }
}(this, function (_, Backbone) {
  'use strict';

  function ComparatorRunner() {
    this.init = function (comparator, options) {
      var reverse = !!options.reverse;

      if (comparator.length === 1) {
        this.compare = sortByComparator(comparator, reverse);
      } else {
        this.compare = traditionalComparator(comparator, reverse);
      }

      return this;
    };

    function traditionalComparator(comparator, reverse) {
      if (!reverse) { return comparator; }

      return function (modelA, modelB) {
        return !comparator(modelA, modelB);
      };
    }

    function sortByComparator(comparator, reverse) {
      var reverseFactor = reverse ? -1 : 1;

      return function (modelA, modelB) {
        var valueA = comparator(modelA);
        var valueB = comparator(modelB);

        if (valueA < valueB) {
          return -1 * reverseFactor;
        } else if (valueA > valueB) {
          return 1 * reverseFactor;
        } else {
          return 0;
        }
      };
    }
  }

  var SortableCollection = Backbone.Collection.extend({
    initialize: function () {
      if (this.defaultSort) { this.changeSort(this.defaultSort); }
    },

    defaultSort: null,

    changeSort: function (sort) {
      this.comparator = this._createComparator(sort);
      this.sort();
    },

    comparators: {},

    _createComparatorRunners: function (sort) {
      var comparators = this.comparators;

      return _(sort).map(function (sortUnit) {
        var name, direction;

        if (_.isObject(sortUnit)) {
          name = sortUnit.name;
          direction = sortUnit.dir;
        } else {
          name = sortUnit;
          direction = 'asc';
        }

        if (direction !== 'asc' && direction !== 'desc') {
          throw 'Sort direction must be either \'asc\' or \'desc\'';
        }

        var comparator = comparators[name];
        if (!comparator) {
          throw 'Comparator \'' + name + '\' is missing, add it to comparators';
        }

        return new ComparatorRunner().init(comparator, {
          reverse: direction === 'desc'
        });
      });
    },

    _createComparator: function (sort) {
      if (!_.isArray(sort)) { sort = [sort]; }
      var comparatorRunners = this._createComparatorRunners(sort);

      return function (modelA, modelB) {
        var index, returnValue;

        for (index = 0; index < comparatorRunners.length; index++) {
          returnValue = comparatorRunners[index].compare(modelA, modelB);
          if (returnValue !== 0) { break; }
        }

        return returnValue;
      };
    }
  });

  return SortableCollection;
}));