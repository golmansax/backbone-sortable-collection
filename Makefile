test:
	istanbul cover ./node_modules/.bin/_mocha -- -R spec test/**/*

coveralls:
	istanbul cover ./node_modules/.bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/.bin/coveralls.js

.PHONY: test
