<div class="event-summary">
    <!-- NB the dates here are the the dte of the event -->
    <!-- not when the event post was published! -->
    <!-- so it needs a custom field -->
    <!-- see mu-plugins/university-post-types.php -->
    <!-- and enable custom fields in editor > preferences > panels -->
    <!-- then get custom-field plugin 'Advanced Custom Fields (ACF)' -->
    <!-- if you get 'Download failed. No working transports found' see below -->
    <!-- https://wordpress.org/support/topic/download-failed-no-working-transports-found-2/ -->
    <!-- download the plugin from https://wordpress.org/plugins/ -->
    <!-- then go to wp-admin plugins and choose upload -->
    
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
        <p><?php if(has_excerpt()) {
            echo get_the_excerpt();
        } else {
        echo wp_trim_words(get_the_content(), 18); 
        } ?> <a href="<?php the_permalink(); ?>" class="nu gray">Learn more</a></p>
    </div>
</div>