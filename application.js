function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
       }
       if (start <= today){
         if (val.end_date){
             end = new Date (val.end_date);
             end.setDate(end.getDate() + 1);
             if (end >= today){
               item_list.push(val);  
             }
             
         } else {
             item_list.push(val);
         }
       }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderPopUp(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    if(collection.photo_link == "" || collection.photo_link === null){
       collection.css = "style=cursor:default;";
       collection.no_link = "return false";
    }
    collection.image_url_abs = "//mallmaverick.cdn.speedyrails.net" + collection.photo_url
    var rendered = Mustache.render(template_html,collection);
    item_rendered.push(rendered);
    $(container).html(item_rendered.join(''));
}

function renderFeatureItems(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreList(container, template, collection, type, starter, breaker){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                val.alt_store_front_url = "";
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
        }
        
        if (val.total_published_promos > 0){
            val.promo_exist = "display:inline"
        } else {
            val.promo_exist = "display:none"
        }
       
        if(val.categories != null){
            val.cat_list = val.categories.join(',');
        }
        
        var current_initial = val.name[0];
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.data_initial = current_initial;
            store_initial = current_initial;
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.data_initial = current_initial;
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        
        if (val.is_coming_soon_store == true){
            val.coming_soon_store = "display:inline";
        } else {
            val.coming_soon_store = "display:none";
        }
        
        if (val.is_new_store == true){
            val.new_store = "display:inline";
        } else {
            val.new_store = "display:none";
        }
        
        val.map_x = val.x_coordinate - 19;
        val.map_y = val.y_coordinate - 58;
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        if(starter == '#' && breaker == '#' && isInt(upper_current_initial)){
            item_rendered.push(rendered);
            $('.numbers_exist').css('display', 'block');
        }
        if (upper_current_initial.charCodeAt(0) <= breaker.charCodeAt(0) && upper_current_initial.charCodeAt(0) >= starter.charCodeAt(0)){
            item_rendered.push(rendered);
        }
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each(collection, function(key, val){
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url).indexOf('missing.png') > -1 || val.store_front_url == null){
            val.alt_store_front_url = site_json.default_image;
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        
        if (val.website != null && val.website.length > 0){
            val.show = "display:block";
        } else {
            val.show = "display:none";
        }
        
        if (val.phone != null && val.phone.length > 0){
            val.phone_show = "display:block";
        }
        else {
            val.phone_show = "display:none";
        }
        
        if (val.twitter != null && val.twitter.length > 0){
            val.twitter_show = "display:inline-block";
        } else {
            val.twitter_show = "display:none";
        }
        
        if ((val.twitter == null || val.twitter == "") && (val.facebook == "" || val.facebook == null)){
            val.hide_social = "display:none;";
        }
        if (val.facebook != null && val.facebook.length > 0){
            val.facebook_show = "display:inline-block";
        } else {
            val.facebook_show = "display:none";
        }
        
        if (val.unit != null && val.unit.length > 0){
            val.address_show = "display:inline-block";
        } else {
            val.address_show = "display:none";
        }
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderStoreDetailsHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        switch(val.day_of_week) {
            case 0:
                val.day = "Sunday";
                break;
            case 1:
                val.day = "Monday";
                break;
            case 2:
                val.day = "Tuesday";
                break;
            case 3:
                val.day = "Wednesday";
                break;
            case 4:
                val.day = "Thursday";
                break;
            case 5:
                val.day = "Friday";
                break;
            case 6:
                val.day = "Saturday";
                break;
        }
        // var open_time = new Date (val.open_time);
        // var close_time = new Date (val.close_time);
        // val.open_time = convert_hour(open_time);
        // val.close_time = convert_hour(close_time);
        // if (val.is_closed == true){
        //     val.hour_string = "Closed"
        // } else {
        //     val.hour_string = val.open_time + " - " + val.close_time;
        // }
        
        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
        if (val.is_closed == true){
            val.hour_string = "Closed"
        } else {
            val.hour_string = open_time.format("h:mma") + " - " + close_time.format("h:mma");
        } 
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromotions(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
        } else {
            val.store_name = site_json.name;
        }
        
        if (val.promo_image_url_abs.indexOf('missing.png') > 0){
            val.promo_image_url_abs  = site_json.default_image ;
            // val.promo_image = "display:none";
            // val.full_width = "width:100%"
        }
        
        if (val.description.length > 200){
            val.description_short = val.description.substring(0, 200) + "..."
        } else {
            val.description_short = val.description
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = "Starts " + (get_month(start.getMonth()))+" "+(start.getDate())+" - Ends "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        } else {
        	val.dates = "Starts " + start.format("MMM D") + " - Ends " + end.format("MMM D");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromotionDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
        }
        else {
            val.store_name = site_json.name;
        }
        if (val.promo_image_url_abs.indexOf('missing.png') > 0){
            val.promo_image_url_abs  = site_json.default_image ;
            val.promo_image = "display:none";
            val.full_width = "width:100%"
        }
        if (val.promo_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = "Starts " + (get_month(start.getMonth()))+" "+(start.getDate())+" - Ends "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        }
        else {
        	val.dates = "Starts " + start.format("MMM D") + " - Ends " + end.format("MMM D");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEvents(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.image_url = store_details.store_front_url_abs;
        }
        else {
            val.store_name = site_json.name;
            val.image_url = site_json.default_image;
        }
        if (val.tags.join(',').indexOf('ongoing') >= 0){
            val.hide_dates= "display:none"
        }
        else {
            val.hide_dates= "display:inline"
        }
        if (val.event_image_url_abs.indexOf('missing.png') > 0){
            val.event_image_url_abs  = site_json.default_image ;
            val.promo_image = "display:none";
            val.full_width = "width:100%"
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0, 200) + "..."
        }
        else {
            val.description_short = val.description
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate())+" - "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        }
        else {
        	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
        }
        else {
            val.store_name = site_json.name;
        }
        if (val.event_image_url_abs.indexOf('missing.png') > 0){
            val.event_image_url_abs  = site_json.default_image ;
            val.promo_image = "display:none";
            val.full_width = "width:100%"
        }
        if (val.tags.join(',').indexOf('ongoing') >= 0){
            val.hide_dates= "display:none"
        }
        else {
            val.hide_dates= "display:inline"
        }
        if (val.event_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0, 200) + "..."
        }
        else {
            val.description_short = val.description
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = "Starts " + (get_month(start.getMonth()))+" "+(start.getDate())+" - Ends "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        }
        else {
        	val.dates = "Starts " + start.format("MMM D") + " - Ends " + end.format("MMM D");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.jobable_type == "Store"){
            val.store_name = getStoreDetailsByID(val.jobable_id).name;
            val.store_detail_btn = getStoreDetailsByID(val.jobable_id).slug;
        }
        else {
            val.store_name = site_json.name;
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0, 200) + "..."
        }
        else {
            val.description_short = val.description
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // val.published_on = get_month(show_date.getMonth()) + " " + show_date.getDate();
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
    
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = "Starts " + (get_month(start.getMonth()))+" "+(start.getDate())+" - Ends "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        val.published_on = show_date.format("MMM D");
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        }
        else {
        	val.dates = "Starts " + start.format("MMM D") + " - Ends " + end.format("MMM D");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.jobable_type == "Store"){
            val.store_name = getStoreDetailsByID(val.jobable_id).name;
            val.store_detail_btn = getStoreDetailsByID(val.jobable_id).slug;
        }
        else {
            val.store_name = site_json.name;
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0, 200) + "..."
        }
        else {
            val.description_short = val.description
        }
        // var show_date = new Date (val.show_on_web_date + site_json.time_zone);
        // start = new Date (val.start_date + site_json.time_zone);
        // end = new Date (val.end_date + site_json.time_zone);
        // if (start.toDateString() == end.toDateString()) {
        //     val.dates = (get_month(start.getMonth()))+" "+(start.getDate());    
        // } else {
        //     val.dates = "Starts " + (get_month(start.getMonth()))+" "+(start.getDate())+" - Ends "+get_month(end.getMonth())+" "+end.getDate();    
        // }
        
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        }
        else {
        	val.dates = "Starts " + start.format("MMM D") + " - Ends " + end.format("MMM D");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        // var d = new Date();
        // var open_time = new Date (val.open_time);
        // var close_time = new Date (val.close_time);
        // val.open_time = convert_hour(open_time);
        // val.close_time = convert_hour(close_time);  
        // if (val.is_closed == true){
        //     val.hour = "Closed"
        // }
        // else{
        //     val.hour = val.open_time+ " - " + val.close_time;
        // }
        
        var d = moment();
        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
        if (val.is_closed == true){
            val.hour = "Closed"
        } else {
            val.hour = open_time.format("h:mma") + " - " + close_time.format("h:mma");
        } 
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}


function renderContest(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses

    collection.alt_photo_url = getImageURL(collection.photo_url);
    collection.property_name = getPropertyDetails().name;
    var rendered = Mustache.render(template_html,collection);
    item_rendered.push(rendered);
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}
