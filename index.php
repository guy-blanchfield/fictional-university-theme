<?php 

//  this file renders the blog archive
// if home.php exists, that will be used
// in our case, it does not, so index.php is used

get_header(); 
pageBanner(array(
  'title' => 'Welcome to our blog!',
  'subtitle' => 'Keep up with our latest news.'
));
?>

<div class="container container--narrow page-section">

<?php

  while(have_posts()) {
    the_post();
    ?>

    <div class="post-item">

      <h2 class="headline headline--medium headline--post-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
      
      <div class="metabox">
        <p>Posted by <?php the_author_posts_link() ?> on <?php the_time('j.n.y') ?> in <?php echo get_the_category_list(', ') ?></p>
      </div>

      <div class="generic-content">
        <?php the_excerpt(); ?>
        <p><a class="btn btn--blue" href="<?php the_permalink(); ?>">Continue reading &raquo;</a></p>
      </div>



    </div>
    
    <?php
  }

  // does the pagination thing
  // will only show if there are more posts than the 'pages show at most'
  // setting, which is in settings > reading
  echo paginate_links();

?>

</div>

<?php

get_footer();

?>