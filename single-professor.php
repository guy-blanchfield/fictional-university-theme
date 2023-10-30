<?php 

    get_header();

    while(have_posts()) {
        the_post();
        pageBanner();
        ?>

        <div class="container container--narrow page-section">

            <div class="generic-content">
                <div class="row group">
                    <div class="one-third">
                        <?php the_post_thumbnail('professorPortrait'); // arg could be 'small', 'medium', or 'large' to use the automatically generated sizes ?>
                    </div>
                    <div class="two-thirds">
                        <!-- like/heart thing for professors -->
                        <?php

                        $likeCount = new WP_Query(array(
                            'post_type' => 'like',
                            'meta_query' => array(
                                array(
                                    'key' => 'liked_professor_id',
                                    'compare' => '=',
                                    // comparing to the current post (professor) id
                                    'value' => get_the_ID()
                                )
                            )
                        ));
                        // $likeCount->found_posts will give us the total number of
                        // posts returned by this query

                        $existStatus = 'no';
                        // custom query to find all the like posts that liked this professor
                        // AND were authored by the current user
                        $existQuery = new WP_Query(array(
                            'author' => get_current_user_id(),
                            'post_type' => 'like',
                            'meta_query' => array(
                                array(
                                    'key' => 'liked_professor_id',
                                    'compare' => '=',
                                    // comparing to the current post (professor) id
                                    'value' => get_the_ID()
                                )
                            )
                        ));
                        // if there are more than 0 of these likes, set existStatus to 'yes'
                        if ($existQuery->found_posts) {
                            $existStatus = 'yes';
                        }

                         ?>
                        <span class="like-box" data-professor="<?php the_ID(); ?>" data-exists="<?php echo $existStatus; ?>">
                            <i class="fa fa-heart-o" aria-hidden="true"></i>
                            <i class="fa fa-heart" aria-hidden="true"></i>
                            <span class="like-count"><?php echo $likeCount->found_posts; ?></span>
                        </span>
                        <?php the_content(); ?>
                    </div>
                </div>
            </div>

            <?php 
            
                // get the related programs from the custom field
                $relatedPrograms = get_field('related_programs');

                if ($relatedPrograms) {
                    echo '<hr class="section-break">';
                    echo '<h2 class="headline headline--medium">Subject(s) Taught</h2>';
                    echo '<ul class="link-list min-list">';
                    foreach($relatedPrograms as $program) { ?>
                        <li><a href="<?php echo get_the_permalink($program); ?>"><?php echo get_the_title($program); ?></a></li>
                    <?php }
                    echo '</ul>';
                }
                
            ?>

        </div>

    <?php }


    get_footer();

?>