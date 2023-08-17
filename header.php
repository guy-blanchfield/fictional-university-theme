<!DOCTYPE html>

<!-- NB! wordpress has a function for setting the lang attribute -->
<!-- lang can be set in wp-admin -->
<html <?php language_attributes(); ?>>
    <head>
      <!-- NB! wordpress also has a function that can do the charset -->
      <meta charset="<?php bloginfo('charset'); ?>">
      <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php wp_head(); ?>
    </head>

    <!-- body_class function adds some wordpress specific css classes to the body tag -->
    <!-- give us loads of classes specific to the page, like what template it's using and page id etc -->
    <!-- if we wanted to apply specific styles for specific pages or page types etc -->
    <!-- they could also be used in javascript -->
    <body <?php body_class(); ?>>
        
    <header class="site-header">
      <div class="container">
        <h1 class="school-logo-text float-left">
          <a href="<?php echo site_url(); ?>"><strong>Fictional</strong> University</a>
        </h1>
        <span class="js-search-trigger site-header__search-trigger"><i class="fa fa-search" aria-hidden="true"></i></span>
        <i class="site-header__menu-trigger fa fa-bars" aria-hidden="true"></i>
        <div class="site-header__menu group">
          <nav class="main-navigation">
            <!-- dynamic wp menu -->
            <?php
              // wp_nav_menu(array(
              //   'theme_location' => 'headerMenuLocation'
              // ));
            ?>
            <ul>
              <!-- giving wp_get_post_parent_id() an argument of 0 tells it to use the id of the current page -->
              <li <?php if (is_page('about-us') or wp_get_post_parent_id(0) == 17) echo 'class="current-menu-item"' ?>><a href="<?php echo site_url('/about-us'); ?>">About Us</a></li>
              <li <?php if (get_post_type() == 'program') echo 'class="current-menu-item"' ?>><a href="<?php echo get_post_type_archive_link('program'); ?>">Programs</a></li>
              <li <?php if (get_post_type() == 'event' OR is_page('past-events')) echo 'class="current-menu-item"' ?>><a href="<?php echo get_post_type_archive_link('event'); ?>">Events</a></li>
              <li <?php if (get_post_type() == 'campus') echo 'class="current-menu-item"' ?>><a href="<?php echo get_post_type_archive_link('campus'); ?>">Campuses</a></li>
              <!-- get_post_type() == 'post' as condition to check if current page is a blog post or archive -->
              <li <?php if (get_post_type() == 'post') echo 'class="current-menu-item"' ?>><a href="<?php echo site_url('/blog'); ?>">Blog</a></li>
            </ul>
          </nav>
          <div class="site-header__util">
            <a href="#" class="btn btn--small btn--orange float-left push-right">Login</a>
            <a href="#" class="btn btn--small btn--dark-orange float-left">Sign Up</a>
            <span class="search-trigger js-search-trigger"><i class="fa fa-search" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    </header>