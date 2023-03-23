import asciidoctor from "@asciidoctor/core";

const OPTIONS = {
    backend: 'html',
    template_dirs: ['./templates-cjs'],
}

asciidoctor().convertFile('index.adoc', OPTIONS);
