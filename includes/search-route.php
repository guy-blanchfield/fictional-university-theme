<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
    // whateverurl.com/wp-json/university/v1/search
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'universitySearchResults'
    ));
}

// $data is what gets passed to the function 
// by the rest route above, i.e. anything that is
// in the query string
// e.g. ?term=barksalot becomes array('term' => 'barksalot')
function universitySearchResults($data) {
    // this is the generic keyword query
    // the related programs, events, campus etc queries are at the end
    $mainQuery = new WP_Query(array(
        // use array to query multiple post types
        'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
        // s stands for search
        // 'term' could be 'pizza', 'unicorn' etc
        // also wrap the data within sanitize_text_field for extra security
        's' => sanitize_text_field($data['term'])
    ));

    // create category arrays for the posts that will
    // be returned by the custom query
    $results = array(
        'generalInfo' => array(),
        'professors' => array(),
        'programs' => array(),
        'events' => array(),
        'campuses' => array()
    );

    while($mainQuery->have_posts()) {
        $mainQuery->the_post();

        //  sort the posts into the appropriate category
        // i.e. push the post title and permalink into 
        // one of the category arrays

        if (get_post_type() == 'post' OR get_post_type() == 'page') {
            array_push($results['generalInfo'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'postType' => get_post_type(),
                'author' => get_the_author()
            ));
        }

        if (get_post_type() == 'professor') {
            array_push($results['professors'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                // the first arg here (0) means the current post
                'thumbnail' => get_the_post_thumbnail_url(0, 'professorLandscape')
            ));
        }

        if (get_post_type() == 'program') {

            // find any related campuses
            $relatedCampuses = get_field('related_campus');
            if ($relatedCampuses) {
                foreach($relatedCampuses as $campus) {
                    array_push($results['campuses'], array(
                        'title' => get_the_title($campus),
                        'permalink' => get_the_permalink($campus)
                    ));
                }
            }
            
            array_push($results['programs'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                // outputting the id here so it can be used in the
                // related programs search custom query below
                'id' => get_the_id()
            ));
        }

        if (get_post_type() == 'event') {

            $eventDate = new DateTime(get_field('event_date'));

            $description = null;
            if (has_excerpt()) {
                $description = get_the_excerpt();
            } else {
                $description = wp_trim_words(get_the_content(), 18); 
            }

            array_push($results['events'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink(),
                'month' => $eventDate->format('M'),
                'day' => $eventDate->format('d'),
                'description' => $description
            ));
        }

        if (get_post_type() == 'campus') {
            array_push($results['campuses'], array(
                'title' => get_the_title(),
                'permalink' => get_the_permalink()
            ));
        }
    }

    
    // if there are any programs returned by the main search query
    // create a new query to go through the professors posts
    // and see which ones match those programs
    if ($results['programs']) {
        // create a var for handling multidimensional programs
        // e.g. if there was multiple sub programs
        // human biology, marine biology etc
        $programsMetaQuery = array('relation' => 'OR');

        foreach($results['programs'] as $program) {
            array_push($programsMetaQuery, array(
                'key' => 'related_programs',
                // we're not looking for an exact or number match just strings
                'compare' => 'LIKE',
                'value' => '"' . $program['id'] . '"'
            ));
        }

        // a different custom query for the related programs search
        $programRelationshipQuery = new WP_Query(array(
            'post_type' => array('professor', 'event'),
            // meta_query takes an array of filters (each filter is an array)
            'meta_query' => $programsMetaQuery
        ));

        // now loop through the posts returned by the custom query
        while ($programRelationshipQuery->have_posts()) {
            $programRelationshipQuery->the_post();

            if (get_post_type() == 'professor') {
                array_push($results['professors'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    // the first arg here (0) means the current post
                    'thumbnail' => get_the_post_thumbnail_url(0, 'professorLandscape')
                ));
            }

            if (get_post_type() == 'event') {

                $eventDate = new DateTime(get_field('event_date'));

                $description = null;
                if(has_excerpt()) {
                    $description = get_the_excerpt();
                } else {
                    $description = wp_trim_words(get_the_content(), 18); 
                }

                array_push($results['events'], array(
                    'title' => get_the_title(),
                    'permalink' => get_the_permalink(),
                    'month' => $eventDate->format('M'),
                    'day' => $eventDate->format('d'),
                    'description' => $description
                ));
            }
        }

        // remove any duplicates from the professors array
        // we wrap array_unique() in array_values() to get rid of the keys that
        // array_unique() creates
        // not sure we need this, my json looks different to brad's
        // yeah hasn't made any difference afaik
        // maybe it's a postman thing
        $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
        $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));

    }

    
    return $results;
}

?>