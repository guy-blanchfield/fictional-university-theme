<?php 

//  this file renders the blog archive
// if home.php exists, that will be used
// in our case, it does not, so index.php is used

get_header(); 
pageBanner(array(
  'title' => 'Search Results',
  'subtitle' => 'You searched for &ldquo;' . esc_html(get_search_query(false)) . '&rdquo; '
));
?>

<div class="container container--narrow page-section">

<?php

    if(have_posts()) {

    while(have_posts()) {
        the_post();
        get_template_part('template-parts/content', get_post_type());
    }

    // does the pagination thing
    // will only show if there are more posts than the 'pages show at most'
    // setting, which is in settings > reading
    echo paginate_links();

    } else {

        echo '<h2 class="headline headline--small-plus">No results match that search</h2>';
        
    }

    get_search_form();

?>

</div>

<?php

get_footer();

?>