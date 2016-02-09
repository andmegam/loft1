<?php

if (isset($_POST['project_name'])) {$project_name=$_POST['project_name'];
if ($project_name == '') {unset($project_name);}}

if (isset($_POST['project_url'])) {$project_url=$_POST['project_url'];
if ($project_url == '') {unset($project_url);}}

if (isset($_POST['project_desc'])) {$project_desc=$_POST['project_desc'];
if ($project_desc == '') {unset($project_desc);}}

if (isset($_FILES['project_file'])) {$project_file=$_FILES['project_file'];
if ($project_file == '') {unset($project_file);}}

if (isset($project_name) && $project_file && isset($project_url) != '' && isset($project_desc)){

	// Подключение к БД
	require_once("config_app.php");

	$project_name = strip_tags(htmlspecialchars(trim($project_name)));
	$project_url = strip_tags(htmlspecialchars(trim($project_url)));
	$project_desc = strip_tags(htmlspecialchars(trim($project_desc)));

	// Проверка размера файла
	if ($project_file['size']> 1024*1024) {

		$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ваш файл слишком большой (более 1Mb)');
		echo json_encode($sever_mes);
		return;
	}

	// Проверка разширения файла
	if($project_file['type'] == "image/gif" || $project_file['type'] == "image/png" ||
	$project_file['type'] == "image/jpg" || $project_file['type'] == "image/jpeg")
	{
		// Директория для файлов проекта
		$project_dir = 'img/project_img';

		// Создадим директорию на сервере, если её нет.
		if (!file_exists('../'.$project_dir)) {
			mkdir('../'.$project_dir, 0777);
		}

		return;

		// Закачиваем файл
		if(is_uploaded_file($project_file["tmp_name"]))
	    {
	    	// Подготавливаем файл проекта
	    	$old_file_name = $project_file['name'];
	    	$new_file_name =  strtolower(translit($old_file_name));

			// Полный путь куда копировать
			$final_path = $project_dir."/".$new_file_name;

	     	// Перемещаем файл в нужную нам папку.
	        $result_move = move_uploaded_file($project_file["tmp_name"], "../".$final_path);

			if (!$result_move) {
			    $sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ошибка перемещения файла в нужную директорию');
				echo json_encode($sever_mes);
				return;
			}

	       	// Запись в БД
	       	$sql = "INSERT INTO projects (projectname,projecturl,projectdesc, projectimg)
			VALUES ('".$project_name."','".$project_url."' ,'".$project_desc."','".$final_path."');";
	        $result = mysqli_query($mysqli,$sql) or die(mysqli_error()) ;

	       	if($result) {
	       		$sever_mes = array( 'status' => 'server_ok', 'status_text' => 'Проект успешно добавлен');
				echo json_encode($sever_mes);
				return;
	       	}else {
				$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ошибка добавления проекта в БД');
				echo json_encode($sever_mes);
				return;
			}

	   } else {
		    $sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ошибка загрузки файла на сервер');
			echo json_encode($sever_mes);
			return;
	   }

	}else{

		$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Ваш файл не является изображением');
		echo json_encode($sever_mes);
		return;
	}

}else {

	$sever_mes = array( 'status' => 'server_error', 'status_text' => 'Не хватает данных');
	echo json_encode($sever_mes);
	return;
}

 function translit($str) {
    $rus = array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я');
    $lat = array('A', 'B', 'V', 'G', 'D', 'E', 'E', 'Gh', 'Z', 'I', 'Y', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'C', 'Ch', 'Sh', 'Sch', 'Y', 'Y', 'Y', 'E', 'Yu', 'Ya', 'a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya');
    return str_replace($rus, $lat, $str);
 }

?>
