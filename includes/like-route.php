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

    // check user is logged in
    // NB: a nonce is also required in the XHR for this to evaluate true
    // it's an additional security feature
    if (is_user_logged_in()) {
        $professor = sanitize_text_field($data['professorId']);

        // custom query to find if this account has already liked this professor
        $existQuery = new WP_Query(array(
                            
            'author' => get_current_user_id(),
            'post_type' => 'like',
            'meta_query' => array(
                array(
                    'key' => 'liked_professor_id',
                    'compare' => '=',
                    // comparing to the current post (professor) id
                    'value' => $professor
                )
            )
        ));

        // if a like from this account does not already exist
        // AND that the id being sent by js is a professor
        // presumably as extra layer of security
        if ($existQuery->found_posts == 0 AND get_post_type($professor) == 'professor') {
            //  create new like post
            // programmatically create post from within PHP!
            // returning this function will return the id number of the post
            return wp_insert_post(array(
                'post_type' => 'like',
                'post_status' => 'publish', // NB publish NOT published!
                'post_title' => 'Umpteenth PHP Test',
                // meta_input for the liked_professor_id field / value
                'meta_input' => array(
                    'liked_professor_id' => $professor
                )
            ));
        } else {
            die("Invalid professor ID");
        }

        

        // return 'Thanks for trying to create a like.';
        // return $data['professorId'];
        // return $professor;
    } else {
        die("Only logged in users can create a like.");
    }
    
    
}

function deleteLike($data) {
    // return 'Thanks for trying to delete a like.';

    // grab the id of the like post to be deleted
    // ($data is passed into this function automatically 
    // as it's the callback funtion for the register_rest_route)
    $likeId = sanitize_text_field($data['like']);
    // we're using a custom api endpoint
    // so there's no built in permissions checks
    // so we need some conditions
    // if the current user is the author of the post to be deleted
    // AND the post is a like
    if (get_current_user_id() == get_post_field('post_author', $likeId) AND get_post_type($likeId) == 'like') {
        // delete the post
        // true means it gets deleted completely, doesn't go to trash
        wp_delete_post($likeId, true);
        return "Congrats, like deleted.";
    } else {
        die("You do not have permission to delete that.");
    }
}