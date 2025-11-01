<?php
// Set the recipient email address (Your professional email hosted on Hostinger)
$receiving_email_address = 'soufiane.arrazouki@hotmail.com'; // CHANGE THIS TO YOUR HOSTINGER-CONFIGURED EMAIL

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit;
}

// 1. Get and sanitize form data
$name = isset($_POST['name']) ? filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$message = isset($_POST['message']) ? filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING) : '';

// Basic validation
if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or incomplete data received."]);
    exit;
}

// 2. Prepare email content
$subject = "New Contact from Portfolio: " . $name;
$body = "You have received a new message from your portfolio website.\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Email: " . $email . "\n\n";
$body .= "Message:\n" . $message . "\n";

// 3. Set headers (Crucial for proper delivery and Reply-To functionality)
$headers = "From: " . $email . "\r\n"; // Sender's email will be used in the From field
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 4. Send the email
if (mail($receiving_email_address, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server failed to send the email. Check PHP mail logs."]);
}

?>
