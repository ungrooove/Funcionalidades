<?php

function actualizar_descripcion_corta_mahle_conjuntos() {
    global $wpdb;

    if (!current_user_can('manage_options')) {
        return; // Solo admins pueden ejecutarlo
    }

    // Obtener los IDs de productos en las categorías correctas
    $query = "
        SELECT p.ID FROM {$wpdb->prefix}posts p
        INNER JOIN {$wpdb->prefix}term_relationships tr1 ON p.ID = tr1.object_id
        INNER JOIN {$wpdb->prefix}term_taxonomy tt1 ON tr1.term_taxonomy_id = tt1.term_taxonomy_id
        INNER JOIN {$wpdb->prefix}terms t1 ON tt1.term_id = t1.term_id
        INNER JOIN {$wpdb->prefix}term_relationships tr2 ON p.ID = tr2.object_id
        INNER JOIN {$wpdb->prefix}term_taxonomy tt2 ON tr2.term_taxonomy_id = tt2.term_taxonomy_id
        INNER JOIN {$wpdb->prefix}terms t2 ON tt2.term_id = t2.term_id
        WHERE p.post_type = 'product'
        AND p.post_status = 'publish'
        AND t1.slug = 'marca-mahle'
        AND t2.slug IN ('categoria-conjuntos', 'categoria-subconjunto')
    ";

    $productos = $wpdb->get_col($query);

    if (!empty($productos)) {
        error_log('--- Iniciando actualización de productos ---');
        
        foreach ($productos as $product_id) {
            error_log('Actualizando producto ID: ' . $product_id);

            $nueva_descripcion = 'Precio por unidad no por conjunto';

            // 1️⃣ **Eliminar la descripción corta (post_excerpt) en la base de datos**
            $wpdb->query($wpdb->prepare("
                UPDATE {$wpdb->prefix}posts 
                SET post_excerpt = '' 
                WHERE ID = %d
            ", $product_id));

            // 2️⃣ **Eliminar el metadato `_short_description`**
            $wpdb->query($wpdb->prepare("
                DELETE FROM {$wpdb->prefix}postmeta 
                WHERE post_id = %d AND meta_key = '_short_description'
            ", $product_id));

            // 3️⃣ **Forzar actualización en WooCommerce**
            delete_post_meta($product_id, '_short_description');
            wp_update_post(array(
                'ID'           => $product_id,
                'post_excerpt' => '', // Se asegura de borrar cualquier rastro de la descripción
            ));

            // 4️⃣ **Agregar la nueva descripción**
            update_post_meta($product_id, '_short_description', $nueva_descripcion);
            wp_update_post(array(
                'ID'           => $product_id,
                'post_excerpt' => $nueva_descripcion,
            ));

            // 5️⃣ **Eliminar caché de WooCommerce**
            wc_delete_product_transients($product_id);
            clean_post_cache($product_id);
        }
    } else {
        error_log('No se encontraron productos con esas categorías.');
    }
}

// Hook manual para ejecutar la actualización desde la URL
function ejecutar_actualizacion_mahle() {
    if (isset($_GET['actualizar_mahle']) && $_GET['actualizar_mahle'] == '1') {
        actualizar_descripcion_corta_mahle_conjuntos();
        echo 'Actualización completada. Revisá el log para más detalles.';
        exit;
    }
}
add_action('init', 'ejecutar_actualizacion_mahle');

<?
