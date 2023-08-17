<?php 

get_header(); 
pageBanner(array(
  'title' => 'Our Campuses',
  'subtitle' => 'We have several conveniently located campuses.'
))
?>

<div class="container container--narrow page-section">

<div class="acf-map">

<?php

  while(have_posts()) {
    the_post();
    $mapLocation = get_field('map_location');
    ?>

    <div class="marker" data-lat="<?php echo $mapLocation['lat']; ?>" data-lng="<?php echo $mapLocation['lng']; ?>"></div>  
    
    <?php
  }



  // does the pagination thing
  // will only show if there are more posts than the 'pages show at most'
  // setting, which is in settings > reading
  echo paginate_links();

?>
</div>

</div>

<?php

get_footer();

?>