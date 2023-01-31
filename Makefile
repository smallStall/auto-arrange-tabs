SOURCES=extension.js package.json
EXT=auto-arrange-tabs-0.4.0.vsix

$(EXT): $(SOURCES) node_modules
	npx vsce package

node_modules:
	npm install

.PHONY: package
package: clean
	cd .. && tar czf auto-arrange-tabs.tgz auto-arrange-tabs

.PHONY: clean
clean:
	rm -rf node_modules $(EXT)
