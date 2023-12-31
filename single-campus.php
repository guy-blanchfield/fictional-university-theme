<?php 

    get_header();

    while(have_posts()) {
        the_post(); 
        pageBanner();
        ?>

        <div class="container container--narrow page-section">

            <div class="metabox metabox--position-up metabox--with-home-link">
                <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('campus'); ?>"><i class="fa fa-home" aria-hidden="true"></i>&nbsp;All Campuses</a> 
                <span class="metabox__main"><?php the_title(); ?></span></p>
            </div>

            <div class="generic-content"><?php the_content() ?></div>

            <?php 
                $mapLocation = get_field('map_location'); 
            ?>

            <div class="acf-map">

                <div class="marker" data-lat="<?php echo $mapLocation['lat']; ?>" data-lng="<?php echo $mapLocation['lng']; ?>">
                
                <h3><?php the_title(); ?></h3>
                <?php echo $mapLocation['address'] ?>

                </div>

            </div>

            <?php 

              // custom query for the related professors
              $relatedPrograms = new WP_Query(array(
              // -1 means give us all the posts that meet the criteria
              'posts_per_page' => -1,
              'post_type' => 'program',
              // orderby default is 'post_date'
              // title does reverse alphabetical, unless you define 'order' as 'ASC', presumably default is DESC
              'orderby' => 'title',
              'order' => 'ASC',
              // to filter out events that are now in the past
              // we need a meta query, taking an array of arrays
              'meta_query' => array(
                // filter for the related_programs
                array(
                    'key' => 'related_campus',
                    'compare' => 'LIKE',
                    'value' => '"' . get_the_ID() . '"', // looking for "34" not 34
                ),
              )
              ));

              // can't just use if ($homepageEvents) here, because it's a query so
              // it'll return true even if there are no posts,
              // so we need to use the have_posts method
              if ($relatedPrograms->have_posts()) {
                echo '<hr class="section-break">';
                echo '<h2 class="headline headline--medium">Programs Available At This Campus</h2>';
                echo '<ul class="min-list link-list">';

                while($relatedPrograms->have_posts()) {
                  $relatedPrograms->the_post();
                ?>
                
                <li>
                  <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                </li>

              <?php }

                  echo '</ul>';

              }

              // resets the global post object
              // (is currently the relatedProfessors->the_post())
              // it needs to be the current page post for the next query to work
              wp_reset_postdata();

          ?>

        </div>

    <?php }

    get_footer();

?>