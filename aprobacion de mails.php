//ESTO FUNCIONA CON EL PLUGIN ULTIMATE MEMBMER Y CON LA CONFIG SMTP CON USUARIO Y CONTRASEÑA DEL HOST

<?php
// ADD MODDA 13.3.2025 APROBACION VIA EMAIL

// Clave secreta para generar el hash
define('CUSTOM_NONCE_SECRET', 'tu_clave_secreta_12345'); 

function generar_nonce_personalizado($user_id, $action) {
    return hash_hmac('sha256', $action . $user_id, CUSTOM_NONCE_SECRET);
}

// Enviar correo de aprobación
function enviar_correo_aprobacion_admin($user_id) {
    $user = get_userdata($user_id);
    $admin_email = ['damyperez8@gmail.com', 'tienda@elgallegotodomotor.com'];
	

    $subject = '🔔 Nuevo usuario pendiente de aprobación';

    // Generar nonce personalizado
    $approve_nonce = generar_nonce_personalizado($user_id, 'approve_user');
    $reject_nonce = generar_nonce_personalizado($user_id, 'reject_user');

    // Enlaces personalizados
    $approve_link = site_url("?action=approve_user&user_id={$user_id}&nonce={$approve_nonce}");
    $reject_link = site_url("?action=reject_user&user_id={$user_id}&nonce={$reject_nonce}");

    $message = "<p>Un nuevo usuario se ha registrado y requiere aprobación:</p>";
    $message .= "<p><strong>Nombre:</strong> {$user->display_name}</p>";
    $message .= "<p><strong>Email:</strong> {$user->user_email}</p>";

    // Botones funcionales
    $message .= "<p>
        <a href='{$approve_link}' style='padding: 10px 15px; background-color: green; color: white; text-decoration: none; border-radius: 5px; margin-right: 10px;'>✅ Aprobar Usuario</a>
        <br><br>
        <a href='{$reject_link}' style='padding: 10px 15px; background-color: red; color: white; text-decoration: none; border-radius: 5px;'>❌ Rechazar Usuario</a>
    </p>";

    $headers = array('Content-Type: text/html; charset=UTF-8');
    wp_mail(implode(',', $admin_email), $subject, $message, $headers);
}
add_action('um_registration_complete', 'enviar_correo_aprobacion_admin', 10, 1);

// Función para validar nonce personalizado
function validar_nonce_personalizado($user_id, $nonce, $action) {
    $expected_nonce = generar_nonce_personalizado($user_id, $action);
    return hash_equals($expected_nonce, $nonce);
}

// Procesar aprobación de usuario
function aprobar_usuario() {
    if (!isset($_GET['user_id'], $_GET['nonce'])) {
        wp_die('❌ Acción inválida.');
    }

    $user_id = intval($_GET['user_id']);
    $nonce = sanitize_text_field($_GET['nonce']);

    if (!validar_nonce_personalizado($user_id, $nonce, 'approve_user')) {
        wp_die('❌ Acción no permitida. (Nonce inválido)');
    }

    update_user_meta($user_id, 'account_status', 'approved');
    wp_die('✅ Usuario aprobado con éxito.');
}
add_action('init', function () {
    if (isset($_GET['action']) && $_GET['action'] === 'approve_user') {
        aprobar_usuario();
    }
});

// Procesar rechazo de usuario
function rechazar_usuario() {
    if (!isset($_GET['user_id'], $_GET['nonce'])) {
        wp_die('❌ Acción inválida.');
    }

    $user_id = intval($_GET['user_id']);
    $nonce = sanitize_text_field($_GET['nonce']);

    if (!validar_nonce_personalizado($user_id, $nonce, 'reject_user')) {
        wp_die('❌ Acción no permitida. (Nonce inválido)');
    }

    require_once ABSPATH . 'wp-admin/includes/user.php';
    wp_delete_user($user_id);
    wp_die('✅ Usuario rechazado con éxito.');
}
add_action('init', function () {
    if (isset($_GET['action']) && $_GET['action'] === 'reject_user') {
        rechazar_usuario();
    }
});
<?php
