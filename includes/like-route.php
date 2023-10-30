<?php

add_action('rest_api_init', 'universityLikeRoutes');

function universityLikeRoutes() {
    //  the two register_rest_routes are more or less the same
    // but one responds to a POST request and the other
    // to a DELETE request

    // first 2 args for register_rest_routes are arbitrary, 
    //  could be pizza, unicorn etc
    // in this case the url for the fetch would be:
    // [university-url-whatever]/university/v1/manageLike
    register_rest_route('university/v1/', 'manageLike', array(
        // methods is the the type of http request
        'methods' => 'POST',
        'callback' => 'createLike'
    ));

    register_rest_route('university/v1/', 'manageLike', array(
        'methods' => 'DELETE',
        'callback' => 'deleteLike'
    ));
}

// the callback functions
// any incoming data to the rest route
// is automatically passed to the callback function
function createLike($data) {
    
    $professor = sanitize_text_field($data['professorId']);

    // programmatically create post from within PHP!
    wp_insert_post(array(
        'post_type' => 'like',
        'post_status' => 'publish', // NB publish NOT published!
        'post_title' => 'Umpteenth PHP Test',
        // meta_input for the liked_professor_id field / value
        'meta_input' => array(
            'liked_professor_id' => $professor
        )
    ));

    // return 'Thanks for trying to create a like.';
    // return $data['professorId'];
    return $professor;
}

function deleteLike() {
    return 'Thanks for trying to delete a like.';
}