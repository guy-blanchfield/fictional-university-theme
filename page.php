<?php

    get_header();

    while(have_posts()) {
        the_post();
        pageBanner();
        ?>

    <div class="container container--narrow page-section">
      <!-- only display the parent child meta box if page is a child, i.e. has a parent -->
      <?php 
        $theParent = wp_get_post_parent_id(get_the_ID());
        if ($theParent) { ?>
          <div class="metabox metabox--position-up metabox--with-home-link">
            <p>
              <a class="metabox__blog-home-link" href="<?php echo get_permalink($theParent) ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($theParent); ?></a> <span class="metabox__main"><?php the_title(); ?></span>
            </p>
          </div>
        <?php }
      ?>
      
      <?php 

      // round about tricky way of checking if the page is a parent
      // if the current page has children, get_pages will return
      //  a collection of any and all children
      // because we're passing the child_of => this page ID as an arg
      // if it doesn't have children the get_pages_function will return falsy
      $testArray = get_pages(array(
        'child_of' => get_the_ID()
      ));
      
      if ($theParent or $testArray) { ?>

        <div class="page-links">
          <!-- if $theParent get_the_title will get the title for the parent id -->
          <!-- else if it's 0 get_the_tile() and will get current page title -->
          <!-- same goes for get_permalink() -->
          <h2 class="page-links__title"><a href="<?php echo get_permalink($theParent) ?>"><?php echo get_the_title($theParent) ?></a></h2>
          <ul class="min-list">
            <?php 

              // if we're on a parent page we can use the current page id
              // but if we're on a child page, we need to get the parent page id
              
              // if ($theParent) {
              //   $findChildrenOf = $theParent;
              // } else {
              //   $findChildrenOf = get_the_ID();
              // }

              // will this work instead? yep!
              $findChildrenOf = ($theParent) ? $theParent : get_the_ID();

              // wp_list_pages wants an associative array as argument
              wp_list_pages(array(
                // don't output the title (i.e. pages)
                'title_li' => NULL,
                'child_of' => $findChildrenOf,
                // menu order can be set in wp-admin under page attributes
                'sort_column' => 'menu_order'
              ));
            ?>
          </ul>
        </div>

      <?php } ?>
       

    <div class="generic-content">
        <?php the_content(); ?>
    </div>
    </div>

    <?php }

    get_footer();

?>