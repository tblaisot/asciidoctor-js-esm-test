import asciidoctor from "@asciidoctor/core";

const OPTIONS = {
    backend: 'html',
    template_dirs: ['./templates-commonjs'],
}

asciidoctor().convertFile('index.adoc', OPTIONS);
