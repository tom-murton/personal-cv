
<?php
// Simple test file to check if PHP is working
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'PHP is working correctly',
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ]
]);
?>
