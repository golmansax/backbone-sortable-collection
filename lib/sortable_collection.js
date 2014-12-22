(function () {
  'use strict';

  function ComparatorRunner() {
    this.init = init;

    var _comparator;

    function init(comparator) {
      _comparator = comparator;

      // if a 1 param function
      this.compare = true ? runSortByComparator : comparator;
    }

    function runSortByComparator(modelA, modelB) {
      var valueA = _comparator(modelA);
      var valueB = _comparator(modelB);

      if (valueA < valueB) { return -1; }
      else if (valueA > valueB) { return 1; }
      else { return 0; }
    }
  }

  Backbone.SortableCollection = Backbone.Collection.extend({
    initialize: function () {
      this.changeSort(defaultSort);
    },

    defaultSort: null,

    changeSort: function (sort) {
      this.comparator = this._makeComparator(sort);
      this.sort();
    },

    comparators: {},

    _makeComparator: function (sort) {
      // iterate through sort

      var comparatorRunners = this._comparators.map(function (comparator) {
        return new ComparatorRunner().init(comparator);
      });

      return function (modelA, modelB) {
        var index, returnValue;

        for (index = 0; i < sort.length; i++ ) {
          returnValue = comparatorRunner[i].compare(modelA, modelB);
          if (returnValue !== 0) { break; }
        }

        return returnValue;
      };
    }
  });
})();
