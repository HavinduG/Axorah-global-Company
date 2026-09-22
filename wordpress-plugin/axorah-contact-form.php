<?php
/**
 * Plugin Name: Axorah Contact Form
 * Description: Handles contact form submissions via REST API and stores them as Custom Post Types.
 * Version: 1.0.0
 * Author: Axorah
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class Axorah_Contact_Form {

    public function __construct() {
        add_action( 'init', array( $this, 'register_cpt' ) );
        add_action( 'rest_api_init', array( $this, 'register_rest_endpoint' ) );
        add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
        add_action( 'manage_axorah_contact_posts_columns', array( $this, 'set_custom_columns' ) );
        add_action( 'manage_axorah_contact_posts_custom_column', array( $this, 'custom_column_data' ), 10, 2 );
        
        // Allow CORS for the frontend if they are on different domains
        add_action( 'rest_api_init', function() {
            remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
            add_filter( 'rest_pre_serve_request', function( $value ) {
                header( 'Access-Control-Allow-Origin: *' );
                header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE' );
                header( 'Access-Control-Allow-Credentials: true' );
                header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );
                return $value;
            });
        }, 15 );
    }

    public function register_cpt() {
        $labels = array(
            'name'               => 'Contact Messages',
            'singular_name'      => 'Contact Message',
            'menu_name'          => 'Contact Messages',
            'name_admin_bar'     => 'Contact Message',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Contact Message',
            'new_item'           => 'New Contact Message',
            'edit_item'          => 'View Contact Message',
            'view_item'          => 'View Contact Message',
            'all_items'          => 'All Messages',
            'search_items'       => 'Search Messages',
            'not_found'          => 'No messages found.',
            'not_found_in_trash' => 'No messages found in Trash.'
        );

        $args = array(
            'labels'             => $labels,
            'public'             => false,
            'publicly_queryable' => false,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => false,
            'rewrite'            => false,
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_position'      => 30,
            'menu_icon'          => 'dashicons-email',
            'supports'           => array( 'title' ),
            'capabilities'       => array(
                'create_posts' => 'do_not_allow', // Disable "Add New" from UI to prevent manual spam
            ),
            'map_meta_cap'       => true,
        );

        register_post_type( 'axorah_contact', $args );
    }

    public function register_rest_endpoint() {
        register_rest_route( 'axorah/v1', '/contact', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'handle_form_submission' ),
            'permission_callback' => '__return_true', // Publicly accessible
        ) );
    }

    public function handle_form_submission( WP_REST_Request $request ) {
        $params = $request->get_json_params();
        
        if ( empty( $params ) ) {
            $params = $request->get_body_params();
        }

        $name    = isset( $params['name'] ) ? sanitize_text_field( $params['name'] ) : '';
        $email   = isset( $params['email'] ) ? sanitize_email( $params['email'] ) : '';
        $service = isset( $params['service'] ) ? sanitize_text_field( $params['service'] ) : '';
        $message = isset( $params['message'] ) ? sanitize_textarea_field( $params['message'] ) : '';

        if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
            return new WP_Error( 'missing_fields', 'Name, email, and message are required.', array( 'status' => 400 ) );
        }

        if ( ! is_email( $email ) ) {
            return new WP_Error( 'invalid_email', 'Invalid email address.', array( 'status' => 400 ) );
        }

        $post_title = $name . ' - ' . current_time('Y-m-d H:i:s');

        $post_id = wp_insert_post( array(
            'post_type'    => 'axorah_contact',
            'post_title'   => $post_title,
            'post_status'  => 'publish',
        ) );

        if ( is_wp_error( $post_id ) ) {
            return new WP_Error( 'insert_failed', 'Failed to save message.', array( 'status' => 500 ) );
        }

        update_post_meta( $post_id, '_contact_name', $name );
        update_post_meta( $post_id, '_contact_email', $email );
        update_post_meta( $post_id, '_contact_service', $service );
        update_post_meta( $post_id, '_contact_message', $message );

        // Optional: Send email notification to admin
        $to = get_option( 'admin_email' );
        $subject = 'New Contact Form Submission: ' . $name;
        $body = "Name: $name\nEmail: $email\nService: $service\n\nMessage:\n$message";
        $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email);
        
        wp_mail( $to, $subject, $body, $headers );

        return rest_ensure_response( array(
            'success' => true,
            'message' => 'Your message has been sent successfully.',
        ) );
    }

    public function add_meta_boxes() {
        add_meta_box(
            'axorah_contact_details',
            'Contact Submission Details',
            array( $this, 'render_meta_box' ),
            'axorah_contact',
            'normal',
            'high'
        );
    }

    public function render_meta_box( $post ) {
        $name    = get_post_meta( $post->ID, '_contact_name', true );
        $email   = get_post_meta( $post->ID, '_contact_email', true );
        $service = get_post_meta( $post->ID, '_contact_service', true );
        $message = get_post_meta( $post->ID, '_contact_message', true );

        echo '<table class="form-table">';
        echo '<tr><th>Name</th><td>' . esc_html( $name ) . '</td></tr>';
        echo '<tr><th>Email</th><td><a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></td></tr>';
        echo '<tr><th>Service Required</th><td>' . esc_html( $service ) . '</td></tr>';
        echo '<tr><th>Message</th><td><p>' . nl2br( esc_html( $message ) ) . '</p></td></tr>';
        echo '</table>';
    }

    public function set_custom_columns( $columns ) {
        // Move date to the end
        $date = $columns['date'];
        unset( $columns['date'] );
        
        $columns['contact_email']   = 'Email';
        $columns['contact_service'] = 'Service';
        $columns['date']            = $date;
        return $columns;
    }

    public function custom_column_data( $column, $post_id ) {
        switch ( $column ) {
            case 'contact_email':
                $email = get_post_meta( $post_id, '_contact_email', true );
                echo '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
                break;
            case 'contact_service':
                echo esc_html( get_post_meta( $post_id, '_contact_service', true ) );
                break;
        }
    }
}

new Axorah_Contact_Form();
