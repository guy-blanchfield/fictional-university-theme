<?php 

function pageBanner($args = NULL) {
    // php logic will live here

    // NB in brad's pageBanner function he was using get_the_title
    // but that wasn't working for archive pages
    // so...

    if (!isset($args['title'])) {
        // check if it's an archive or the blog index page (i.e. a list of posts)
        //  in which case set title to the appropriate value for its post type
        if (is_archive()) {
            $args['title'] = get_the_archive_title();
        } else if (is_home()) {
            $args['title'] = single_post_title('', false);
        } else {
            // set title to the title in the_post
            $args['title'] = get_the_title();
        }
    }

    if (!isset($args['subtitle'])) {
        // check if it's an archive 
        // (the blog index page doesn't have a desription option afaik)
        // if it's an archive or an index get_field() will be wrong
        // as it will be looking for the get_field for the_post
        // so stop that happening
        // and if its blog index (is_home()) just set it to NULL or an empty string
        if (is_archive()) {
            $args['subtitle'] = get_the_archive_description();
        } else if (is_home()) { 
            $args['subtitle'] = NULL;
        } else { 
            $args['subtitle'] = get_field('page_banner_subtitle');
        }
    }

    if (!isset($args['photo'])) {
        if (get_field('page_banner_background_image')) {
            $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
        } else {
            $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
    }

    // echo 'is archive:' . is_archive() . '<br>';
    // echo 'is home:' . is_home() . '<br>';
    // echo 'post type:' . get_post_type() . '<br>';
    


    ?>

    <div class="page-banner">
        <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo'] ?>)"></div>
            <div class="page-banner__content container container--narrow">
                <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
                <div class="page-banner__intro">
                <p><?php echo $args['subtitle']; ?></p>
                </div>
            </div>
        </div>

    <?php
}

// this function gets called by the wp_head() call in header.php
function university_files() {
    // first arg for wp_enqueue_script is a nickname for the script, not something to look for or load
    // third arg for wp_enqueue_script is for dependencies array (in this case jquery)
    // NULL if there are no dependencies
    // fourth arg is for a version number
    // final arg is whether to put the script inside the closing body tag (true) or in the head section (false)
    wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key='.MAP_API_KEY, NULL, '1.0', true);
    wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
    // first arg for wp_enqueue_style is a nickname for the stylesheet we are about to load
    // it's a nickname to associate with the second arg, not something to load or look for
    wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
    // NB link for external stylesheets starts with double slash - i.e. no http
}


// add_action function can do all sorts of stuff,
// depending what args it gets
// in this case load css or javascript
// wp_enqueue_scripts, then a function (defined above) to do at the enqueue hook or moment
// this moment is right before wp_head() runs
add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
    // enables showing the title in the title tag within page head tag
    add_theme_support('title-tag');
    // register wp-admin customisable menu
    // (causes 'Menus' option to appear under Appearance in wp-admin)
    // first arg nickname, second arg human friendly name
    // register_nav_menu('headerMenuLocation', 'Header Menu Location');
    // register_nav_menu('footerLocationOne', 'Footer Location One');
    // register_nav_menu('footerLocationTwo', 'Footer Location Two');

    // add theme support for featured image
    // also needs 'thumbnail' adding to the supports array in mu-plugins/university-post-types
    add_theme_support('post-thumbnails');
    // custom image sizes (nickname, width, height, crop)
    add_image_size('professorLandscape', 400, 260, true);
    // using array to indicate cropping rules (default is toward centre)
    // add_image_size('professorLandscape', 400, 260, array('left', 'top'));
    // plugin to get more control over this is Manual Image Crop by Tomasz Sita
    add_image_size('professorPortrait', 480, 650, true);
    // NB plugin to retroactively resize images to these new sizes
    // is called Regenerate Thumbnails by Alex Mills

    // page banner background image
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme','university_features');

function university_adjust_queries($query) {

    if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
        // list all posts on the same page
        $query->set('posts_per_page', -1);
    }

    if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
        $query->set('orderby','title');
        $query->set('order', 'ASC');
        // list all posts on the same page
        $query->set('posts_per_page', -1);
    }

    if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
        $today = date('Ymd');
        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array(
            array(
              // only show posts with an event date greater than or equal to today's date
              'key' => 'event_date',
              'compare' => '>=',
              'value' => $today,
              'type' => 'numeric'
            )
        ));
    }
}

// when wordpress calls the function 'university_adjust_queries'
// it passes the default query object as an argument
add_action('pre_get_posts', 'university_adjust_queries');


// MAP_API_KEY is currently defined in wp-config
// inform acf about the map api key

function universityMapKey($api) {
    $api['key'] = MAP_API_KEY;
    return $api;
}
add_filter('acf/fields/google_map/api', 'universityMapKey');

?>