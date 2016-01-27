define(['validator/index'], function(Validator){
    var v = new Validator();
    var Rules = {
        user : {
            email: [{type: 'string'}, {length: [5, 100]}, v.rules.email],
            nickname: [{type: 'string'}, {length: [0, 30]}, v.rules.name],
            name: [{type: 'string'}, {length: [0, 50]}, v.rules.name],
            phone: [{type: 'string'}, {length: [0, 11]}, v.rules.mobile],
            role: [{type: 'number'}, {range: [0, 999]}],
            avatar: [{type: 'string'}, {length: [0, 255]}, v.rules.url],
            active: [{whiteList: [0, 1]}]
            last_login_time: [{type: 'string'}, {length: [0, 255]}],
        },

        address: {
            location: [{type: 'string'}, {length: [0, 200]}, v.rules.name],
            primary: [{whiteList: [0, 1]}]
        },

        cat: {
            cat_name: [{type: 'string'}, {length: [0, 20]}, v.rules.name],
            cat_pic: [{type: 'string'}, v.rules.url],
            parent_id: [{type: 'number'}, {min: 0}],
            sort: [{type: 'number'}, {min: 0}],
            is_show: [{whiteList: [0, 1]}]
        },

        spec: {
            spec_name: [{type: 'string'}, {length: [0, 20]}, v.rules.name],
            spec_pic: [{type: 'string'}, v.rules.url],
            cat_id: [{type: 'number'}, {min: 0}],
            parent_id: [{type: 'number'}, {min: 0}],
            sort: [{type: 'number'}, {min: 0}],
            is_show: [{whiteList: [0, 1]}]
        },

        goods: {
            cat_id:   [{type: 'number'}, {min: 0}],
            spec_id:  [{type: 'number'}, {min: 0}],
            store_id: [{type: 'number'}, {min: 0}],
            name: [{type: 'string'}, {length: [0, 30]}, v.rules.name],
            brand: [{type: 'string'}, {length: [0, 30]}, {func: function(prop){return false}}],
            default_image: [{type: 'string'}, v.rules.url],
            description: [{type: 'string'}],
            price: [{type: 'number'}, {min: 0}],
            market_price: [{type: 'number'}, {min: 0}],
            sales: [{type: 'number'}, {min: 0}],
            stock: [{type: 'number'}, {min: 0}],
            unit:  [{type: 'string'}, {length: [0, 30]}, v.rules.name],
            sku:  [{type: 'string'}, {length: [0, 30]}],
            type: [{type: 'number'}, {range: [0, 999]}],
            hot:  [{type: 'number'}, {min: 0}],
            recommended: [{whiteList: [0, 1]}],
            is_show: [{whiteList: [0, 1]}]
        },

        coupon: {
            type: [{type: 'number'}, {range: [0, 999]}],
            amount: [{type: 'number'}, {min: 0}],
            condition: [{type: 'string'}, {length: [0, 255]}],
            expires: [{type: 'string'}, {length: [0, 255]}],
        },


        order_detail: {
            order_id: [{type: 'number'}, {min: 0}],
            good_id: [{type: 'number'}, {min: 0}],
            amount: [{type: 'number'}, {min: 0}]
        },

        orders: {
            user_id: [{type: 'number'}, {min: 0}],
            sn: [{type: 'string'}, {length: [0, 30]}],
            amount: [{type: 'number'}, {min: 0}],
            status: [{type: 'number'}, {range: [0, 999]}],
            from: [{type: 'string'}, {length: [0, 30]}],
            payment: [{type: 'number'}, {range: [0, 999]}]
        },

        store: {
            user_id: [{type: 'number'}, {min: 0}],
            type: [{type: 'number'}, {range: [0, 999]}],
            name: [{type: 'string'}, {length: [0, 60]}, v.rules.name],
            phone: [{type: 'string'}, {length: [0, 11]}, v.rules.mobile],
            scale: [{type: 'string'}, {length: [0, 255]}],
            business_scope: [{type: 'string'}, {length: [0, 255]}],
            location: [{type: 'string'}, {length: [0, 255]}]
        },

        tag: {
            name: [{type: 'string'}, {length: [0, 60]}, v.rules.name]
        },

        cms_fragment: {
            title:   [{type: 'string'}, {length: [0, 255]}, v.rules.name],
            subtitle: [{type: 'string'}, {length: [0, 255]}],
            abstract: [{type: 'string'}],
            content: [{type: 'string'}],
            sort: [{type: 'number'}, {min: 0}],
            is_show: [{whiteList: [0, 1]}],
            ext1: [{type: 'string'}, {length: [0, 255]}],
            ext2: [{type: 'string'}, {length: [0, 255]}],
            ext3: [{type: 'string'}, {length: [0, 255]}],
            ext4: [{type: 'string'}, {length: [0, 255]}],
            ext5: [{type: 'string'}, {length: [0, 255]}],
            ext6: [{type: 'string'}, {length: [0, 255]}],
            ext7: [{type: 'string'}, {length: [0, 255]}],
            ext8: [{type: 'string'}, {length: [0, 255]}],
            ext9: [{type: 'string'}, {length: [0, 255]}],
            ext10:[{type: 'string'}, {length: [0, 255]}]
        },

        cms_module: {
            type: [{type: 'string'}, {length: [0, 30]}, v.rules.name],
            name: [{type: 'string'}, {length: [0, 30]}, v.rules.name],
            sort: [{type: 'number'}, {min: 0}],
            is_show: [{whiteList: [0, 1]}],
            link: [{type: 'string'}, {length: [0, 255]}],
            ext1: [{type: 'string'}],
            ext2: [{type: 'string'}, {length: [0, 255]}],
            ext3: [{type: 'string'}, {length: [0, 255]}],
            ext4: [{type: 'string'}, {length: [0, 255]}],
            ext5: [{type: 'string'}, {length: [0, 255]}]
        }



    }

    return Rules
})