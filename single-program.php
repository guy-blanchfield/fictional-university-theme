<?php 

    get_header();

    while(have_posts()) {
        the_post(); 
        pageBanner();
        ?>

        <div class="container container--narrow page-section">

            <div class="metabox metabox--position-up metabox--with-home-link">
                <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('program'); ?>"><i class="fa fa-home" aria-hidden="true"></i>&nbsp;All Programs</a> 
                <span class="metabox__main"><?php the_title(); ?></span></p>
            </div>

            <div class="generic-content"><?php the_content() ?></div>

            <?php 

              // custom query for the related professors
              $relatedProfessors = new WP_Query(array(
              // -1 means give us all the posts that meet the criteria
              'posts_per_page' => -1,
              'post_type' => 'professor',
              // orderby default is 'post_date'
              // title does reverse alphabetical, unless you define 'order' as 'ASC', presumably default is DESC
              'orderby' => 'title',
              'order' => 'ASC',
              // to filter out events that are now in the past
              // we need a meta query, taking an array of arrays
              'meta_query' => array(
                // filter for the related_programs
                array(
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => '"' . get_the_ID() . '"', // looking for "34" not 34
                ),
              )
              ));

              // can't just use if ($homepageEvents) here, because it's a query so
              // it'll return true even if there are no posts,
              // so we need to use the have_posts method
              if ($relatedProfessors->have_posts()) {
                echo '<hr class="section-break">';
                echo '<h2 class="headline headline--medium">' . get_the_title() . ' Professors</h2>';
                echo '<ul class="professor-cards">';

                while($relatedProfessors->have_posts()) {
                  $relatedProfessors->the_post();
                ?>
                
                <li class="professor-card__list-item">
                  <a class="professor-card" href="<?php the_permalink(); ?>">
                    <img class="professor-card__image" src="<?php the_post_thumbnail_url('professorLandscape'); ?>">
                    <span class="professor-card__name"><?php the_title(); ?></span>
                  </a>
                </li>

              <?php }

                  echo '</ul>';

              }

              // resets the global post object
              // (is currently the relatedProfessors->the_post())
              // it needs to be the current page post for the next query to work
              wp_reset_postdata();

            // variable to store todays date
            // has to the same date format as the custom field 'event_date'
            $today = date('Ymd');
            // variable to store custom query instance
            // (variable is named $homepageevents because this code is a slightly
            // amended version of the home page events custom query)
            $homepageEvents = new WP_Query(array(
              // -1 means give us all the posts that meet the criteria
              'posts_per_page' => 2,
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
                  'compare' => '>=',
                  'value' => $today,
                  'type' => 'numeric'
                ),
                // another filter for the related_programs
                array(
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => '"' . get_the_ID() . '"', // looking for "34" not 34
                ),
              )
            ));

            // can't just use if ($homepageEvents) here, because it's a query so
            // it'll return true even if there are no posts,
            // so we need to use the have_posts method
            if ($homepageEvents->have_posts()) {
              echo '<hr class="section-break">';
              echo '<h2 class="headline headline--medium">Upcoming ' . get_the_title() . ' Events</h2>';

              while($homepageEvents->have_posts()) {
                $homepageEvents->the_post();
                get_template_part('template-parts/content-event');
              }
            }

             wp_reset_postdata();
          ?>

        </div>

    <?php }


    get_footer();

?>