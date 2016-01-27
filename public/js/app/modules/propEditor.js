define(['jquery', 'swig'], function ($, swig) {

    var tpl = '{% for prop in props %}<tr data-prop="{{prop.key}}">\
                    <td data-prop="key">{{prop.key}}</td>\
                    <td data-prop="label"><input type="text" class="form-control" placeholder="别名" value="{{prop.label}}"></td>\
                    <td data-prop="type">\
                        <select class="form-control m-bot15">\
                            <option value="text"   {% if prop.type == "text" %}selected {% endif %}>单行文本</option>\
                            <option value="mtext"  {% if prop.type == "mtext" %}selected {% endif %}>多行文本</option>\
                            <option value="link"   {% if prop.type == "link" %}selected {% endif %}>超链接</option>\
                            <option value="image"  {% if prop.type == "image" %}selected {% endif %}>图片</option>\
                            <option value="number" {% if prop.type == "number" %}selected {% endif %}>数字</option>\
                            <option value="date"   {% if prop.type == "date" %}selected {% endif %}>日期</option>\
                            <option value="boolean" {% if prop.type == "boolean" %}selected {% endif %}">布尔值</option>\
                        </select>\
                    </td>\
                    <td data-prop="validate"><input type="text" class="form-control" placeholder="校验"å></td>\
                    <td><a href="javascript:;" tt-click="deleteProp"><i class="fa fa-trash-o"></i></a></td>\
                </tr>{% endfor %}';

    var tplNew = '<tr><td> <select class="form-control m-bot15" node-type="propSelector">\
                            <option value="title">title</option>\
                            <option value="subtitle">subtitle</option>\
                            <option value="abstract">abstract</option>\
                            <option value="content">content</option>\
                            <option value="sort">sort</option>\
                            <option value="is_show">is_show</option>\
                            <option value="ext1"">ext1</option>\
                            <option value="ext2"">ext2</option>\
                            <option value="ext3"">ext3</option>\
                            <option value="ext4"">ext4</option>\
                            <option value="ext5"">ext5</option>\
                            <option value="ext6"">ext6</option>\
                            <option value="ext7"">ext7</option>\
                            <option value="ext8"">ext8</option>\
                            <option value="ext9"">ext9</option>\
                            <option value="ext10"">ext10</option>\
                        </select></td>\
                        <td> <span class="btn btn-success btn-sm" tt-click="addNewProp"><i class="fa fa-plus"></i> 添加属性</span></td><td></td><td></td></tr>';

    //支持的类型包括 date/color/text/mtext/image/number/link/bool
    var o = [
        //{key: 'title', label:'标题', type: 'text', validator: {}}
        // ,{key: 'subtitle', label:'图片', type: 'image', validator: {}},
        // {key: 'abstract', label:'简介', type: 'mtext', validator: {}},
        // {key: 'content', label:'正文', type: 'mtext', validator: {}},
        // {key: 'sort', label:'排序', type: 'number', validator: {}},
        // {key: 'is_show', label:'显示/隐藏', type: 'checkbox', validator: {}},
        // {key: 'ext1', label:'跳转链接', type: 'alink', validator: {}},
        // {key: 'ext2', label:'浏览次数', type: 'number', validator: {}}
    ];

    var Editor = function(props, opt){
        this.props = props || o;
        this.opt = opt || {};
        this.wrap = this.opt.wrap;
        this.render();
        this.bindEvent();
    };

    Editor.prototype = {
        render: function(){
            var html = swig.render(tpl, { locals: {props: this.props}});
            html += tplNew;
            this.wrap.html(html);
            var trs = this.wrap.find('tr');
        },

        getProps: function(){
            var props = [];
            var trs = this.wrap.find('tr');
            $.each(trs, function(index, item){
                var prop = {
                    key: $(item).find('td[data-prop=key]').text(),
                    label: $(item).find('td[data-prop=label]').find('input').val(),
                    type: $(item).find('td[data-prop=type]').find('select').val(),
                    validate: {},
                }
                if(index < trs.length -1) props.push(prop);
            })

            console.log(props)

            return JSON.stringify(props);
        },

        deleteProp: function(e, self){
            var i, row = $(this).parents('tr'), 
                prop = row.data('prop');
            for ( i=0; i<self.props.length; i++ ){
                if (self.props[i].key == prop) {
                    self.props.splice(i, 1);
                    break;
                 }  
            }
            row.remove();
            e.preventDefault();
        },

        addNewProp: function(e, self){
            var prop, html, i, exist = false, selector = self.wrap.find('[node-type=propSelector]'), 
                val = selector.val();
            for ( i=0; i<self.props.length; i++ ){
                if(self.props[i].key == val) {exist = true; break;}  
            }
            if(!exist) {
                prop = {key: val, label: val, type: 'text', validator: {}};
                self.props.push(prop);
                html = swig.render(tpl, { locals: {props: [prop]}});
                selector.parents('tr').before(html);

            } else {
                alert('该属性已经添加过了，请勿重复操作');
            }
            e.preventDefault();
        },

        bindEvent: function(){
            var self = this;
            this.wrap.on('click', '[tt-click]', function(e){
                var handler = $(this).attr('tt-click');
                if(self[handler] && typeof self[handler] == 'function') {
                    self[handler].call(this, e, self);
                }
            })
        }
    }

    return Editor;
})