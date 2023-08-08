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
    get_template_part('template-parts/content-event');
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