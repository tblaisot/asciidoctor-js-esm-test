import asciidoctor from "@asciidoctor/core";

const OPTIONS = {
    backend: 'html',
    template_dirs: ['./templates-packagejson'],
}

asciidoctor().convertFile('index.adoc', OPTIONS);
