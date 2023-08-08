<?php 

get_header(); 
pageBanner(array(
  'title' => 'Past Events',
  'subtitle' => 'A recap of our past events.'
));
?>

<div class="container container--narrow page-section">

<?php

    // create custom query for any event posts whose date is in the past
    // var for today's date
    $today = date('Ymd');
    // variable to store custom query instance
    $pastEvents = new WP_Query(array(
        // tells the custom query which page of results it should be on (e.g. for pagination)
        // for example past-events/page/1/, past-events/page/2/ etc
        // get_query_var(paged) means get the page and 1 is the fallback if it can't find it
        'paged' => get_query_var('paged', 1),
        'post_type' => 'event',
        // orderby default is 'post_date'
        // title does reverse alphabetical, unless you define 'order' as 'ASC', presumably default is DESC
        // for custom fields we need meta_value (for strings) or meta_value_num (for numbers), and also to define meta_key
        'meta_key' => 'event_date',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        // to filter out events that are now in the past
        // we need a meta query, taking an array of arrays
        'meta_query' => array(
        array(
            // only show posts with an event date greater than or equal to today's date
            'key' => 'event_date',
            'compare' => '<',
            'value' => $today,
            'type' => 'numeric'
        ),
        )
    ));

  while($pastEvents->have_posts()) {
    $pastEvents->the_post();
    ?>

        <div class="event-summary">
          <a class="event-summary__date t-center" href="<?php the_permalink(); ?>">
                <span class="event-summary__month"><?php 
                // object eventDate is an instance of php class DateTime
                // we can instantiate it with an argument of the custom field date
                $eventDate = new DateTime(get_field('event_date'));
                echo $eventDate->format('M');
                ?></span>
                <span class="event-summary__day"><?php echo $eventDate->format('d'); ?></span>
            </a>
            <div class="event-summary__content">
                <h5 class="event-summary__title headline headline--tiny"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h5>
                <p><?php echo wp_trim_words(get_the_content(), 18); ?> <a href="<?php the_permalink(); ?>" class="nu gray">Learn more</a></p>
            </div>
        </div>
    
    <?php
  }

    // does the pagination thing
    //   arg tells it to do pagination based on the custom query ($pastEvents)
    // not the default page query
  echo paginate_links(array(
     'total' => $pastEvents->max_num_pages
  ));

?>

</div>

<?php

get_footer();

?>