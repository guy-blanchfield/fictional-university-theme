<?php 

get_header(); 
pageBanner(array(
  'title' => 'All Programs',
  'subtitle' => 'There is something for everyone. Have a look around.'
))
?>

<div class="container container--narrow page-section">

<ul class="link-list min-list">

<?php

  while(have_posts()) {
    the_post();
    ?>

    <li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>    
    
    <?php
  }



  // does the pagination thing
  // will only show if there are more posts than the 'pages show at most'
  // setting, which is in settings > reading
  echo paginate_links();

?>
</ul>

</div>

<?php

get_footer();

?>