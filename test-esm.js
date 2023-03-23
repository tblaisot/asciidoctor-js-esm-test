import asciidoctor from "@asciidoctor/core";

const OPTIONS = {
    backend: 'html',
    template_dirs: ['./templates-esm'],
}

asciidoctor().convertFile('index.adoc', OPTIONS);
