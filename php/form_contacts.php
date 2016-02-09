<?php
session_start();

$captcha_code=$_SESSION['captcha_code'];

if (isset($_POST['leadname'])) {$leadname=$_POST['leadname'];
if ($leadname == '') {unset($leadname);}}

if (isset($_POST['leademail'])) {$leademail=$_POST['leademail'];
if ($leademail == '') {unset($leademail);}}

if (isset($_POST['leadmessage'])) {$leadmessage=$_POST['leadmessage'];
if ($leadmessage == '') {unset($leadmessage);}}

if (isset($_POST['leadcapture'])) {$leadcapture=$_POST['leadcapture'];
if ($leadcapture == '') {unset($leadcapture);}}

if (isset($leadname) && isset($leademail) && isset($leadmessage)  && isset($leadcapture)){

	// Проверка капчи
	if ($leadcapture != $captcha_code) {
		$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Неверный проверочный код');
		echo json_encode($sever_mes);
		return;
	}

	// Проверка email
	$leademail_valid = preg_match("/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/",$leademail);

	if ($leademail_valid==0){

		$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Вы ввели некорректный Email');
		echo json_encode($sever_mes);
		return;
	}else {


		$subject = 'Mashkov Andrey проверка работоспособности PHPMailer';
		$content = content($leadname, $leademail, $leadmessage);

		$tmp = smtpmail($leademail, $subject, $content);

		if($tmp) {
			$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ошибка отправки сообщений');
			echo json_encode($sever_mes);
			return;
		} else {
			$sever_mes = array( 'status' => 'server_ok', 'status_text' => 'Сообщение отправлено на почту '.$leademail);
			echo json_encode($sever_mes);
			return;
		}

	}

}else {
	$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Не хватает данных');
	echo json_encode($sever_mes);
	return;
}

function smtpmail($to, $subject, $content)
{

	require_once("config_app.php");
	require '../lib/phpmailer/class.phpmailer.php';
	require '../lib/phpmailer/PHPMailerAutoload.php';

	$mail = new PHPMailer;

	$mail->SMTPDebug = $__smtp['debug'];
	$mail->isSMTP();
	$mail->Host =	$__smtp['host'];
	$mail->SMTPAuth = $__smtp['auth'];
	$mail->Username = $__smtp['username'];
	$mail->Password = $__smtp['password'];
	$mail->SMTPSecure = 'tls';
	$mail->Port = $__smtp['port'];;

	$mail->SetFrom($__smtp['addreply'], 'Mashkov Andrey');
	$mail->AddReplyTo($__smtp['addreply'], $__smtp['username']);
	$mail->AddAddress($to);

	$mail->isHTML(true);
	$mail->CharSet='utf8'; //кодировка письма
	$mail->Subject = $subject;
	$mail->Body    = $content;
	$mail->send();

		$mail->ClearAddresses();
		$mail->ClearAttachments();
		$mail->IsHTML(false);
}

function content($leadname, $leademail, $leadmessage){
	$body = '
<table align="center" border="0" bgcolor="#eeeeee" cellpadding="0" cellspacing="0" style="border-collapse: collapse;font-family: sans-serif;width: 100%; font-size: 16px; color:#424242;">
<tbody>
<tr>
<td style="padding: 20px; width: 600px;">
    <table style="width: 600px; margin: 0 auto; border:0;" border="0" cellpadding="0" cellspacing="0" >
    <tbody>
    <tr>
        <td colspan="3" style="text-align:center; padding: 15px 20px; background-color: #4DBDFE; color:#FFF;" >     С сайта <b>mashkovpro.ru</b>  было отправлено сообщение
        </td>
    </tr>
    <tr>
        <td colspan="3" style="width: 600px; text-align:justify; line-height: 22px; background-color: #FFF; padding: 10px 30px 30px 30px;">

            <br />
            <table style="width: 600px;  margin: 0 auto; border:0;" border="0" cellpadding="0" cellspacing="0" >
                <tr>
                    <td style="width:150px;  vertical-align:top;text-align:right; padding:10px 20px; font-weight:bold;">Имя:</td>
                    <td>'.$leadname.'</td>
                </tr>
                <tr>
                    <td style="width:150px; vertical-align:top; text-align:right; padding:10px 20px; font-weight:bold;">Email:</td>
                    <td>'. $leademail.'</td>
                </tr>
                <tr>
                    <td style="width:150px; vertical-align:top; text-align:right; padding:10px 20px; font-weight:bold;">Текст обращения:</td>
                    <td>'.$leadmessage.'</td>
                </tr>
            </table>

        </td>
    </tr>
    </tbody>
    </table>
</td>
</tr>
</tbody>
</table>';

	return $body;
}

?>
