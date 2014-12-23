test:
	istanbul cover ./node_modules/.bin/_mocha -- -R spec test/**/*

.PHONY: test
