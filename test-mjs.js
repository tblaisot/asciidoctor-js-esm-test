import asciidoctor from "@asciidoctor/core";

const OPTIONS = {
    backend: 'html',
    template_dirs: ['./templates-mjs'],
}

asciidoctor().convertFile('index.adoc', OPTIONS);
