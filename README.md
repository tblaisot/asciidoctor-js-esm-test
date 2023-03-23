# This is a demo of bugs using templates in esm module

## Reproduction

```
npm install
```

### Result Expected

No Error and index.html file containing a paragraph `<p>This is a paragraph</p>`


### Case 1: templates in ESM using .js extension


```
node test-esm.js
```

```
asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js:503
            else if ("js"['$===']($case)) {template = { render: require(file), '$file': function() { return file } }}
                                                                ^

Error [ERR_REQUIRE_ESM]: require() of ES Module asciidoctor-js-esm-test/templates-esm/paragraph.js from asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js not supported.
Instead change the require of paragraph.js in asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js to a dynamic import() which is available in all CommonJS modules.
```


### Case 1: templates in commonjs using .js extension

```
node test-commonjs.js
```

```
asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js:503
            else if ("js"['$===']($case)) {template = { render: require(file), '$file': function() { return file } }}
                                                                ^

Error [ERR_REQUIRE_ESM]: require() of ES Module asciidoctor-js-esm-test/templates-commonjs/paragraph.js from asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js not supported.
paragraph.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.
Instead rename paragraph.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in asciidoctor-js-esm-test/package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).
```


### Case 3: templates in commonjs using .cjs extension


```
node test-cjs.js
```

No error But template is not used:

```
<div class="paragraph">
<p>youhou</p>
</div>
```

Note: this is the same result if using ESM modules and `.esm` extension

### Case 3bis: templates in commonjs using .cjs extension and adding support for the extension in asciidoctor

Patch asciidoctor to find `.cjs` extension:

```
--- node_modules/@asciidoctor/core/dist/node/asciidoctor.js	2023-03-23 09:13:41.985408751 +0100
+++ node_modules/@asciidoctor/core/dist/node/asciidoctor.js	2023-03-23 09:13:07.518113792 +0100
@@ -519,7 +519,7 @@
                   template = { render: pug.compileFile(file, opts), '$file': function () { return file } }
                     ;
                 }
-                else if ("js"['$===']($case)) { template = { render: require(file), '$file': function () { return file } } }
+                else if ("js"['$===']($case) || "cjs"['$===']($case)) { template = { render: require(file), '$file': function () { return file } } }
                 else {
                   var registry = Opal.Asciidoctor.TemplateEngine.registry
                   var templateEngine = registry[extsym]

```


```
node test-cjs.js
```

No error And template is used:

```
<p>This is a paragraph</p>
```

### Case 4: templates in ESM using .mjs extension and adding support for the extension in asciidoctor

Patch asciidoctor to find `.mjs` extensions:

```
--- node_modules/@asciidoctor/core/dist/node/asciidoctor.js	2023-03-23 09:13:41.985408751 +0100
+++ node_modules/@asciidoctor/core/dist/node/asciidoctor.js	2023-03-23 09:13:07.518113792 +0100
@@ -519,7 +519,7 @@
                   template = { render: pug.compileFile(file, opts), '$file': function () { return file } }
                     ;
                 }
-                else if ("js"['$===']($case)) { template = { render: require(file), '$file': function () { return file } } }
+                else if ("js"['$===']($case) || "mjs"['$===']($case)) { template = { render: require(file), '$file': function () { return file } } }
                 else {
                   var registry = Opal.Asciidoctor.TemplateEngine.registry
                   var templateEngine = registry[extsym]

```

```
node test-mjs.js
```

```
asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js:522
                else if ("js"['$===']($case) || "mjs"['$===']($case)) { template = { render: require(file), '$file': function () { return file } } }
                                                                                             ^

Error [ERR_REQUIRE_ESM]: require() of ES Module asciidoctor-js-esm-test/templates-mjs/paragraph.js from asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js not supported.
Instead change the require of paragraph.js in asciidoctor-js-esm-test/node_modules/@asciidoctor/core/dist/node/asciidoctor.js to a dynamic import() which is available in all CommonJS modules.
```

### Case 5: add dummy package.json to change type of module

```
node test-packagejson.js
```

No error And template is used:

```
<p>This is a paragraph</p>
```

This is the solution I will be using waiting for official ESM support