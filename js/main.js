/* Navigation*/
var nav = (function () {
	var navelements = document.getElementById('navigation-list').getElementsByTagName('li'),
		currentpage = location.pathname.match(/[^/]*$/);

	if (navelements.length>0 ) {
        for(var i = 0, len = navelements.length;  i
<len; i++) {

			if (currentpage[0] === "" ) {
				currentpage = "index.html";
			}

            if (navelements[i].querySelector('a').href.indexOf(currentpage) !=-1) {
                navelements[i].className += " current";

            }
        }
    }
})();

var appForm = (function(){
	var my,
	$form = $('.form'),
	urlHandlerAjax = $form.attr('action');


	init();
	attachEvents();

	function init() {

		// Установка PopUp по центру
		$form.css({left:getPopUpLeft()});
		// console.log(urlHandlerAjax);

	}

	function attachEvents() {
		$('#link_popup_show').on('click', onPopupShow);
		$('#blackout, #icon_popup_close').on('click', onPopupHide);
		$('.input-text, .textarea-text').on('keypress', onToolTipHide)
		$('#unload-file').on('change', onChangeFile);
		$form.on('submit', onCheckForm);
	}

	// Центр PopUp
	 function getPopUpLeft (){
		var winWidth = $(window).width(),
			popupWidth = $form.width(),
			popupleft = (winWidth - popupWidth) / 2;
		return popupleft;
	}

	// Открытие PopUp
	function onPopupShow () {
		var scrollTop = $(window).scrollTop();
		$('#blackout').fadeIn(500);
		$form.animate({top: scrollTop + 80 + 'px', left: getPopUpLeft() + 'px'}, 500);
	}

	// Скрытие PopUp
    function onPopupHide (){
		$('#blackout').fadeOut(500);
    	$form.animate({top: '-3000px'}, 500);
    	controlForm.clearForm($form);
	}

	// Выбор загружаемого файла
	function onChangeFile (e){
		var $this = $(this),
			paht_file = $this.val().replace(/.+[\\\/]/, "");

		if (paht_file) {
			$('.unload_paht_file').text(paht_file);
			controlForm.delToolTip($this);
		}else {
			$('.unload_paht_file').text('Загрузите изображение');
		}
	}

	// Удаление ToolTip при наборе текста
	function onToolTipHide (e) {
		var $this = $(this);
		controlForm.delToolTip($this);
	}

	// Проверка валидации и отправка данных на сервер
	function onCheckForm (e){
		e.preventDefault();

		if(controlForm.validForm($form)) {
			controlForm.sendAjax($form, urlHandlerAjax);
		}
	}

  return window.AppForm = my;

})();

// Работа с формой
var controlForm = (function() {
	var my;

  	publicInterface();

  	// Отображение ToolTip
	function addToolTipError ($element) {
		var $tooltip = $element.closest('.form__item').find('.tooltipstext'),
			labeltext = $element.closest('.form__item').find('.label-text').text();

		$tooltip.text('Заполните поле "' + labeltext + '"') ;

		$tooltip.fadeIn(100, function(){
			if ($element.attr('type') !== 'file') {
				$element.addClass('error');
			}else {
				$('.label-unload-file').addClass('error');
			}
		});
	}

	// Скрытие ToolTip
	function delToolTipError ($element) {
		var $tooltip = $element.closest('.form__item').find('.tooltipstext');

		$tooltip.fadeOut(100, function(){
			if ($element.attr('type') !== 'file') {
					$element.removeClass('error');
			}else {
				$('.label-unload-file').removeClass('error');
			}
		});
	}

	// Сборка всех параметров формы, включая имена файлов
	function mySerialize (form) {
		var list_param = form.serialize(),
			file_elements = form.find('input[type=file]'),
			param_name = '',
			param_val = '';

		file_elements.each(function(index){

			param_name = $(this).attr('name');
			param_val = $(this).val().replace(/.+[\\\/]/, "");

			list_param += '&' + encodeURIComponent(param_name) + '=' + encodeURIComponent(param_val);

		});

		return list_param;
	}

	function publicInterface() {
		my = {
			validForm:  function(form) {
							var isValidForm = true;

							form.find('input, textarea').each(function(e) {
								var $this = $(this);

								if ($this.val() === '') {
									isValidForm = false;
									addToolTipError($this);
								}
							});

							return isValidForm;
						},

			delToolTip: function ($element) {
							delToolTipError($element);
						},

			clearForm:  function (form) {

							form.find("input, textarea").each(function(e) {
								var $this = $(this);

									$this.val('');
									$('.unload_paht_file').text('Загрузите изображение');
									delToolTipError($this);
							});
						},

			sendAjax: 	function(form, urlhandlerajax){
							var dataparam = mySerialize(form);

							console.log(dataparam, urlhandlerajax );

						}
		};
	}

	return window.validationForm = my;
})();


/*
function ssdsd (){

	var Win 			= $(window),
		Fon         	= $('#blackout'),
		PopupForm 		= $('#popup_form'),
		LinkPopupShow 	= $('#link_popup_show'),
		IconPpopupClose = $('#icon_popup_close'),
		UnloadFileInput	= $('#unload-file'),
		ProjectPahtFile	= $('.unload_paht_file'),
		ProjectName		= $('#project-name'),
		ProjectUrl		= $('#project-url'),
		ProjectDesc		= $('#project-desc'),
		BtnAddProject	= $('#button-add');

   // Отображение PopUp
	LinkPopupShow.on('click', function(){
		var scrollTop = $(window).scrollTop();
		Fon.fadeIn(500);
		PopupForm.animate({top: scrollTop + 80 + 'px', left: getPopUpLeft() + 'px'}, 500);
    });

	// Скрытие PopUp
    var hideModalForm = function(){
		Fon.fadeOut(500);
    	PopupForm.animate({top: '-3000px'}, 500);
	};

	// Центр PopUp
	var getPopUpLeft = function(){
		var winWidth = Win.width(),
			popupWidth = PopupForm.width(),
			popupleft = (winWidth - popupWidth) / 2;
		return popupleft;
	};


	// Валидация формы
	var formValidation = function(){
		var	departure = true;

		if (ProjectName.val() === "") {
			addError(ProjectName, "Введите название проекта");
			departure = false;
		}

		if (UnloadFileInput.val() === "") {
			addError(UnloadFileInput, "Загрузите изображение проекта");
			departure = false;
		}

		if (ProjectUrl.val() === "") {
			addError(ProjectUrl, "Укажите ссылку на проект");
			departure = false;
		}

		if (ProjectDesc.val() === "") {
			addError(ProjectDesc, "Введите описание проекта");
			departure = false;
		}

		return departure;
	};

	// Отображение ToolTip. Подсветка незаполненного поля
	var addError = function(obj, error_text){

		var toltip_error = obj.parent().find('.tooltipstext');

			toltip_error.fadeIn(100, function(){
				toltip_error.html(error_text);
			});

			if (obj.attr('id') !== 'unload-file') {
				obj.addClass('error');
			}else {
				$('.label-unload-file').addClass('error');
			}
	};

	// Скрытие ToolTip при заполнении поля
	var removeError = function(obj) {

		var toltip_error = obj.parent().find('.tooltipstext');

		toltip_error.fadeOut(100, function(){
			toltip_error.html('');
		});

		if (obj.attr('id') !== 'unload-file') {
			obj.removeClass('error');
		}else {
			$('.label-unload-file').removeClass('error');
		}
	}

	// Изменение содержимого текстовых полей
	$('.input-text, .textarea-text').on('keypress', function(e){
		var $this = $(this);
		removeError($this);
	});

	// При открытии диалогового окна
	$('#unload-file').on('focus', function(e){
		var $this = $(this);
		removeError($this);
	});

	// Установка PopUp по центру
	PopupForm.css({left:getPopUpLeft()});



	// Скрытие PopUp "клик по подложке"
	Fon.on('click', function(){
    	hideModalForm();
    });

	// Скрытие PopUp "крестиком"
   	IconPpopupClose.on('click', function(){
    	hideModalForm();
    });

   	// Выбор загружаемого файла
	UnloadFileInput.on('change', function(e){
		var paht_file = this.value;
		if (paht_file.length>
	0) {
			ProjectPahtFile.text(this.value);
		}
	});

	// Кнопка "Добавить"
   	BtnAddProject.on('click', function(e){
   		e.preventDefault();

   		if (formValidation()) {
   			alert('Валидация прошла успешно');
   		}else {
   			alert('хрен там');
   		}
    	// alert(ProjectName.val());
    });
};
*/
