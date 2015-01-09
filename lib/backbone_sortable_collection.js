/* istanbul ignore next */
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
    this.init = function (name, comparator, options) {
      var reverse = !!options.reverse;

      if (comparator === 'get') {
        this.compare = sortByComparator(function (model) {
          return model.get(name);
        }, reverse);
      } else if (comparator.length === 1) {
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

  function  _parseSortUnit(sortUnit) {
    var name, direction;

    if (_(sortUnit).isObject()) {
      var keys = _(sortUnit).keys();

      if (keys.length !== 1) {
        throw 'Following should be in format of ' +
          '{ comparatorName: sortDirection }: ' + JSON.stringify(sortUnit);
      }

      name = keys[0];
      direction = sortUnit[name];
    } else {
      name = sortUnit;
      direction = 'asc';
    }

    if (direction !== 'asc' && direction !== 'desc') {
      throw 'Sort direction must be either \'asc\' or \'desc\'';
    }

    return { name: name, direction: direction };
  }

  var SortableCollection = Backbone.Collection.extend({
    initialize: function () {
      if (this.defaultSort) { this.changeSort(this.defaultSort); }
    },

    defaultSort: null,

    changeSort: function (sort) {
      this._reverseSort = false;
      this.comparator = this._createComparator(sort);
      this.sort();
    },

    reverseSort: function () {
      this._reverseSort = !this._reverseSort;
      this.sort();
    },

    comparators: {},

    sorts: {},

    _reverseSort: false,

    _createComparatorRunners: function (sort) {
      var self = this;
      var comparators = self.comparators;

      return _(sort).map(function (sortUnit) {
        var parseResult = _parseSortUnit(sortUnit);
        var name = parseResult.name;
        var direction = parseResult.direction;

        var comparator = comparators[name];
        if (!comparator) {
          throw 'Comparator \'' + name + '\' is missing, add it to comparators';
        }

        return new ComparatorRunner().init(name, comparator, {
          reverse: direction === 'desc'
        });
      });
    },

    _createComparator: function (sort) {
      if (!_(sort).isArray()) { sort = this.sorts[sort] || [sort]; }
      var comparatorRunners = this._createComparatorRunners(sort);

      return function (modelA, modelB) {
        var index, returnValue;

        for (index = 0; index < comparatorRunners.length; index++) {
          returnValue = comparatorRunners[index].compare(modelA, modelB);
          if (returnValue !== 0) { break; }
        }

        return returnValue * (this._reverseSort ? -1 : 1);
      };
    }
  });

  return SortableCollection;
}));
