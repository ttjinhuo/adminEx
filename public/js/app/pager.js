define(['jquery', 'swig'], function ($, swig) {

    var tpl = ' <li class="prev {% if hasFirst %}disabled{% endif %}" data-page="prev"><a href="javascript:;">← 上一页</a></li>\
                {% for page in pages %}\
                <li class=" {% if page.current %}active {% endif %}" data-page="{{page.num}}"><a href="javascript:;">{{page.num}}</a></li>\
                {% endfor %}\
                <li class="next {% if hasLast %}disabled{% endif %}" data-page="next"><a href="javascript:;">下一页 → </a></li>'

    var Pager = function(opt){
        var opt = opt || {};
        this.container = opt.wrapper;
        this.page = opt.page || 1;
        this.pages = [];
        this.total = opt.total || 1;
        this.bindEvent();
    };

    Pager.prototype = {
        generatePages:function(){
            var i=0, acc = 1;
            this.pages = [];
            if(this.total <= 6){
                for(i=1; i<= this.total; i++){
                    this.pages.push({
                        num: i,
                        current: i == this.page
                    })
                }
                return;
            }
            if(this.page <= 3) {
                for(i=1; i<= 3; i++){
                    this.pages.push({
                        num: i,
                        current: i == this.page
                    })
                }
                acc = 3;
            } else if(this.page > 3){
                if(acc < this.page -3) {
                    this.pages.push({num: 1})
                    this.pages.push({num: '...'})
                }
                for(i=this.page-3; i<= this.page; i++){
                    this.pages.push({
                        num: i,
                        current: i == this.page
                    })
                }
                acc = this.page
            }
            if(this.total - this.page > 3) {
                //this.pages.push({num: '...'})
                for(i = acc + 1; i<= this.page + 3; i++){
                    this.pages.push({
                        num: i,
                        current: i == this.page
                    })
                }
                this.pages.push({num: '...'})
                this.pages.push({num: this.total})

            } else{
                for(i = acc + 1; i<= this.total; i++){
                    this.pages.push({
                        num: i,
                        current: i == this.page
                    })
                }
            }
        },

        render: function(page, total){
            this.page = page;
            total && (this.total = total);
            this.generatePages();
            var context = { locals: { 
                pages: this.pages, 
                hasFirst: this.page == 1, 
                hasLast: this.page == this.total
            }}
            var html = swig.render(tpl, context);
            this.container.html(html);
        },

        bindEvent: function(){
            var self = this;
            self.container.on('click', 'li', function(e){
                e.preventDefault();
                var page = $(this).data('page') || '1';
                if( !isNaN(parseInt(page))) self.render(parseInt(page));
                else if( page == 'next') {
                    self.page++;
                    self.page = Math.min(self.page , self.total);
                    self.render(self.page);
                } else if( page == 'prev') {
                    self.page--;
                    self.page = Math.max(self.page , 1);
                    self.render(self.page);
                };
                $(document).trigger('PAGER_CHANGED', self.page);
            })
        }
    }

    return Pager;

})