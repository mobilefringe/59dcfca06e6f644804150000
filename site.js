var site_json = {
    "name" : "Eglinton Square",
    "default_image" : "//codecloud.cdn.speedyrails.net/sites/59dcfca06e6f644804150000/image/png/1509133798000/EglintonSquarelogo.png",
    "time_zone" : "T08:00:00Z",
    "social_feed" : "//longbeach.mallmaverick.com/api/v2/longbeach/social.json"
}

function show_content(){
    $('.custom_backdrop').remove();
    $('.yield').fadeIn();
    $('.accordion_header').click(function(e){
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
	});
	
	$('.open_stores').click(function(e){
	    var initial = $(this).attr('data-initial')
	    $('.open_' + initial).slideToggle();
	    $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
	})
	var hours = getPropertyRegularHours();
	var all_hours = []

    $.each(hours, function(i, v){
        if ((v.day_of_week == 1 || v.day_of_week == 0 || v.day_of_week == 6) && (v.is_holiday != true )){
            switch(v.day_of_week) {
                case 0:
                    v.day = "Sunday";
                    break;
                case 1:
                    v.day = "Monday to Friday";
                    break;
                case 6:
                    v.day = "Saturday";
                    break;
            }
            all_hours.push(v)
        }
    })
    all_hours = all_hours.sortBy(function(o){ return o.day })
    renderHours('#hours_container', '#hours_template', all_hours)
    
    get_instagram(site_json.social_feed, 15, 'thumbnail', render_instagram)
}
                
function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "property_details"){
        item_list.push(collection);
        collection = [];
        collection = item_list;
    }
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
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
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
            } else {
                "Closed";
            }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("MMM D");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = open_time.format("h:mm A") + " - " + close_time.format("h:mm A");
                } else {
                    val.h = "Closed";
                }
                if (val.h != "Closed"){
                    item_list.push(val);
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "closed_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("dddd, MMM D, YYYY");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());   
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = open_time.format("h:mm A") + " - " + close_time.format("h:mm A");
                } else {
                    val.h = "Closed";
                }
                if (val.h == "Closed"){
                    item_list.push(val);
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}