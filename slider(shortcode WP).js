function mi_carrusel_productos($atts) {
    // Atributos del shortcode (IDs de productos)
    $atts = shortcode_atts(array(
        'ids' => '', // Lista de IDs separados por comas
    ), $atts, 'mi_carrusel');

    // Convertimos los IDs en un array
    $product_ids = explode(',', $atts['ids']);

    // Si no hay productos, mostramos un mensaje
    if (empty($product_ids)) {
        return '<p>No se encontraron productos.</p>';
    }

    // Cargamos los estilos de Swiper.js solo si no están ya cargados
    wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css');
    wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js', array(), false, true);

    ob_start(); // Captura la salida
    ?>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <?php
            foreach ($product_ids as $product_id) {
                $product = wc_get_product($product_id);
                if (!$product) continue;

                $image = wp_get_attachment_image_src($product->get_image_id(), 'medium')[0];
                $title = $product->get_name();
                $price = $product->get_price_html();
                $link = $product->get_permalink();
                ?>
                <div class="swiper-slide">
                    <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($title); ?>">
                    <div class="product-title"><?php echo esc_html($title); ?></div>
                    <div class="product-price"><?php echo $price; ?></div>
                    <a href="<?php echo esc_url($link); ?>" class="btn-buy">Ver Producto</a>
                </div>
                <?php
            }
            ?>
        </div>
        <div class="button-container">
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 4,
                spaceBetween: 20,
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    1024: { slidesPerView: 3 },
                    768: { slidesPerView: 1 },
                    480: { slidesPerView: 1, spaceBetween: 10 }
                }
            });
        });
    </script>
    <?php
    return ob_get_clean(); // Devuelve el contenido capturado
}

// Registrar el shortcode en WordPress
add_shortcode('mi_carrusel', 'mi_carrusel_productos');