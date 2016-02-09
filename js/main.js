/* Navigation*/
(function () {
  var navelements = document.getElementById('navigation-list').getElementsByTagName('li'),
      currentpage = location.pathname.match(/[^/]*$/);

  if (navelements.length > 0) {
        for(var i = 0, len = navelements.length;  i < len; i++) {
          if (currentpage[0] === "" ) {
            currentpage = "index.html";
          }

          if (navelements[i].querySelector('a').href.indexOf(currentpage) !=-1) {
              navelements[i].className += " current";
          }
        }
    }
})();

(function(){
  var $form;

  init();
  attachEvents();

  /**
   * Инициализация
   */
  function init() {
    $form = $('.form');
  }

  /**
   * Обработчики форм
   */
  function attachEvents() {
    $('#link_popup_show').on('click', onPopupShow);
    $('.popup__overlay, #icon_popup_close').on('click', onPopupHide);
    $('.input_text, .textarea_text').on('keypress', onToolTipHide)
    $('#unload_file').on('change', onChangeFile);
    $form.on('submit', onCheckForm);
    $form.on('reset', onClearForm);
  }

  /**
   * Открытие PopUp
   *
   */
  function onPopupShow () {
    var $popup = $('.popup__overlay'),
      $modal = $('.popup');
      $popup.fadeIn(300);
  }

  /**
   * Скрытие PopUp
   */
  function onPopupHide (event){
    var $popup = $('.popup__overlay');
    e = event || window.event
    if (e.target == this) {
        $popup.fadeOut(300);
        controlForm.clearForm($form);
    }
  }

  /**
   * Выбор загружаемого файла
   */
  function onChangeFile (element){
    var $this = $(this),
      paht_file = $this.val().replace(/.+[\\\/]/, "");

    if (paht_file) {
      $('.unload_paht_file').text(paht_file);
      controlForm.delToolTip($this);
    }else {
      $('.unload_paht_file').text('Загрузите изображение');
    }
  }

  /**
   * Удаление ToolTip при наборе текста
   */
  function onToolTipHide (element) {
    var $this = $(this);
    controlForm.delToolTip($this);
  }

  /**
   * Проверка валидации и отправка данных на сервер
   */
  function onCheckForm (form){
    form.preventDefault();

    if(controlForm.validForm($(this))) {
      controlForm.sendAjax($(this));
    }
  }

  /**
   * Очистка формы по кнопке
   */
  function onClearForm (form){
    controlForm.clearForm($(this));
  }
})();

  /**
   *
   * Работа с формой
   *
   */
(function() {
  var my;

  publicInterface();

  /**
   * Отображение ToolTip
   */
  function addToolTipError ($element) {
    var $tooltip = $element.closest('.form__item').find('.tooltipstext'),
      labeltext = $element.closest('.form__item').find('.label_text').text();

    $tooltip.text('Заполните поле "' + labeltext + '"') ;

    $tooltip.fadeIn(100, function(){
      if ($element.attr('type') !== 'file') {
        $element.addClass('error');
      }else {
        $('.label_unload_file').addClass('error');
      }
    });
  }

  /**
   * Скрытие ToolTip
   */
  function delToolTipError ($element) {
    var $tooltip = $element.closest('.form__item').find('.tooltipstext');

    $tooltip.fadeOut(100, function(){
      if ($element.attr('type') !== 'file') {
          $element.removeClass('error');
      }else {
        $('.label_unload_file').removeClass('error');
      }
    });
  }

  /**
   * Отображение сообщений сервера пользователю
   */
  function createStatusServer ($form, jsondata) {
    var status = jsondata['status'],
      status_text = jsondata['status_text'],
      $sever_mess = $form.find('.sever_mess');

    if (status === 'server_before') {
      $sever_mess.removeClass('server_error server_ok');
      $sever_mess.addClass('server_before');
      $sever_mess.find('.server_mess_title').text('Одну минуточку...');
    }

    if (status === 'server_error' ) {
      $sever_mess.removeClass('server_ok');
      $sever_mess.addClass('server_error');
      $sever_mess.find('.server_mess_title').text('Ошибка!');
    }

    if (status === 'server_ok') {
      $sever_mess.removeClass('server_error');
      $sever_mess.addClass('server_ok');
      $sever_mess.find('.server_mess_title').text('Спасибо!');
    }

    $sever_mess.find('.server_mess_desc').text(status_text);
  }

  /**
   * Вывод сообщения перед отправкой данных на сервер
   */
  function ajaxBeforeSendForm($form) {
    var jsondata = {'status':'server_before', 'status_text':'Подождите ответ от сервера.'};
    createStatusServer ($form, jsondata);
  }

  /**
   * Вывод сообщения при упешной отправке данных на сервер
   */
  function ajaxSuccessForm($form, jsondata) {
    createStatusServer ($form, jsondata);
  }

  /**
   * Вывод сообщения об ошибке на сервере
   */
  function ajaxErrorForm($form) {
    var jsondata = {'status':'server_error', 'status_text':'Ошибка сервера'};
    createStatusServer ($form, jsondata);
  }

  /**
   * Открытые методы
   */
  function publicInterface() {
    my = {

      /**
       * Проверка заполнения форм пользователем
       */
      validForm:  function($form) {
              var isValidForm = true;

              $form.find('input, textarea').each(function(e) {
                var $this = $(this);

                if ($this.val() === '') {
                  isValidForm = false;
                  addToolTipError($this);
                }
              });

              return isValidForm;
            },

      /**
       * Скрытие ToolTip у элемента
       */
      delToolTip: function ($element) {
        delToolTipError($element);
      },

      /**
       * Очистка полей формы
       */
      clearForm: function ($form) {
        $form.find("input, textarea").each(function(e) {
          var $this = $(this);

            $this.val('');
            $('.unload_paht_file').text('Загрузите изображение');
            delToolTipError($this);
        });

        $form.find('.sever_mess').removeClass('server_error server_ok server_before');
      },

      /**
       * Отправка данных на сервер.
       */
      sendAjax: function($form){
        var formdata = new FormData($form[0]),
            urlHandlerAjax = $form.attr('action'),
            ajaxOptions = {
              url: urlHandlerAjax,
              type: 'post',
              data: formdata,
              dataType: 'json',
              contentType: false,
              processData: false,
              beforeSend: ajaxBeforeSendForm.bind(this, $form),
              success: ajaxSuccessForm.bind(this, $form),
              error: ajaxErrorForm.bind(this, $form)
            };

        $.ajax(ajaxOptions);
      }
    };
  }

  window.controlForm = my;
})();
