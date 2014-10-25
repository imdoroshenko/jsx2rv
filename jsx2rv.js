var DOMParser = require('xmldom').DOMParser;

var JSX2RV = {
    rvPattern : '%ref%RV.Node(\'%name%\'%params%%embedding%)',
    componentPattern : '%ref%new %name%(%params%)',
    _extractAtributes: function (el) {
        var attributes = el.attributes,
            extracted = {};
        for(var ln = attributes.length, i = 0; i < ln; i++){
            var attribute = attributes.item(i);
            extracted[attribute.name] = attribute.value;
        }
        return extracted;
    },
    rvRE : /<RV>([\s\S]*?)<\/RV>/g,
    isExpressionRE: /^[\s\t\r]*\{.+\}[\s\t\r]*$/,
    notEmptyRE: /[^\s\t\n\r]/,
    removeBracesRE: /[\{\}]/g,
    removeNewLineRE: /[\n\r]/g,
    escapeQoutesRE: /'/g,
    _parseStrings: function (str) {
        if (this.isExpressionRE.test(str)) {
            return str.replace(this.removeBracesRE, '').replace(this.removeNewLineRE, '');
        }
        return '\'' + str.replace(this.removeNewLineRE, '').replace(this.escapeQoutesRE, '\\\'') + '\'';
    },
    _parseParams: function (params) {
        var result = '{',
            first = true;
        for (var name in params) {
            result += (first
                ? ''
                : ',') + name + ': ' + this._parseStrings(params[name]);
            first = false;
        }
        return name
            ? result + '}'
            : '';
    },
    _createRV: function (name, params, ref, embedding, component) {
        if (params = this._parseParams(params)) {
            params = (component
                ? ''
                : ', ')
            + params;
        }
        if (ref) {
            ref = 'this.refs.' + ref + ' = ';
        } else {
            ref = '';
        }
        if (!component && Array.isArray(embedding) && embedding.length) {
            embedding = ', ' + embedding.join(', ');
        } else {
            embedding = '';
        }
        return (component
            ? this.componentPattern
            : this.rvPattern)
            .replace('%ref%', ref)
            .replace('%name%', name)
            .replace('%params%', params)
            .replace('%embedding%', embedding);
    },
    _parseNode: function (node, embedding, depth) {
        switch (node.nodeType) {
            case 1:
                var name = node.tagName,
                    attributes = this._extractAtributes(node),
                    ref = null,
                    component = name[0].toUpperCase() === name[0];
                if (attributes.ref) {
                    ref = attributes.ref;
                    delete attributes.ref;
                }
                return this._padding(depth) + this._createRV(name, attributes, ref, embedding, component);
            case 3:
                return this.notEmptyRE.test(node.textContent)
                    ?  this._parseStrings(node.textContent)
                    : '';
            default:
                return embedding
                    ? embedding.join(', ')
                    : '';
        }
    },
    _padding: function (num) {
        if (num <= 0) {
            return '';
        }
        var pad = '\n';
        for(var i = 0; i < num; i++){
            pad += '\t';
        }
        return pad;
    },
    _parse: function parse(dom, depth) {
        var childLn = (dom.childNodes
                ? dom.childNodes.length
                : 0),
            embedding = [];
        depth = depth||0;
        if (childLn) {
            for (var i = 0; i < childLn; i++) {
                var embeddingTmp = parse.call(this, dom.childNodes[i], depth + 1);
                if (embeddingTmp) {
                    embedding.push(embeddingTmp);
                }
            }
        }
        return this._parseNode(dom, embedding, depth);
    },
    parseJSX: function (str) {
        var parser = new DOMParser(),
            dom = parser.parseFromString(str, 'text/xml');
        return this._parse(dom, -1);
    },
    parseFileContent: function (content) {
        return content.replace(this.rvRE, function (match, p1) {
            return this.parseJSX(p1);
        }.bind(this));
    }
};

module.exports = JSX2RV;