(function(ns) {

    ns.BlocksFactory = function() {

        var
            imageDefaults = function() { return {id: null, url: null, description: null} };

        this.section = function() { return { name: "", blocks: [] } };

        this.header  = function() { return { type: "header", name: "Заголовок", content: {value: null} } };
        this.text    = function() { return { type: "text",   name: "Текст", content: {content: null} } };
        this.quote   = function() { return { type: "quote", name: "Врубка", content: {left: null, right: null, source_name: null, source_url: null}}};
        this.fact   = function() { return { type: "fact", name: "Факт", content: {left: null, right: null, source_name: null, source_url: null}}};
        this.interview = function() { return { type: "interview", name: "Интервью", content: {elements: []}}};
        this.expert  = function() { return { type: "expert", name: "Эксперт", content: {last_name: null, first_name: null, post: null, company: null, header: null, comment: null, image: imageDefaults()} } };
        this.table = function() { return { type: "table", name: "Таблица", content: {header: null, columns: ['c1'], rows: []}}};
        this.digits = function() { return { type: "digits", name: "Цифры", content: {title: null, value: null, description: null, source: null, month: (new Date().getMonth() + 1), year: new Date().getFullYear()}}};

        this.image = function() { return { type: "image", name: "Изображение", content: imageDefaults()}};
        this.video = function() { return { type: "video", name: "Видео", content: {code: null}}};
        this.attach = function() { return { type: "attach", name: "Файл", content: {code: null}}};
        this.gallery = function() { return { type: "gallery", name: "Галерея", content: {images: [imageDefaults(), imageDefaults(), imageDefaults(), imageDefaults(), imageDefaults(), imageDefaults()]}}};
        this.infographic = function() { return { type: "infographic", name: "Инфографика", content: imageDefaults()}};

    }

})(App);