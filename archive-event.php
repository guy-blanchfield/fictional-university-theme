<?php 

get_header();
pageBanner(array(
  'title' => 'All Events',
  'subtitle' => 'See what is going on in our world'
));
?>

<div class="container container--narrow page-section">

<?php

  // NB the_title() here will return 'The Science of Cats' if no args array 
  // is supplied to pageBanner, why?
  // get_the_title on an archive page will just get the title of the first post
  // get_the_archive_title is what you want (see comments in pageBanner function)

  while(have_posts()) {
    the_post();
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
  // will only show if there are more posts than the 'pages show at most'
  // setting, which is in settings > reading
  echo paginate_links();

?>

<!-- link to past events -->
<hr class="section-break">
<p>Looking for a recap of past events? <a href="<?php echo site_url('/past-events') ?>">Check out our past events archive</a>.</p>

</div>

<?php

get_footer();

?>