/**
 * ajax-form.js v0.1.2
 * author: Yoshiya Hinosawa ( http://github.com/kt3k )
 * license: MIT
 */

(function ($) {
    'use strict';

    var initAjaxFormSingle = function (form) {

        var ATTR_INITIALIZED = 'data-ajax-form-initialized';
        var ATTR_API = 'data-api';
        var ATTR_METHOD = 'data-method';

        var initialized = $(form).attr(ATTR_INITIALIZED);

        if (initialized) {
            return;
        }

        var initButton = function () {

            $('button', form).each(function () {

                var $btn = $(this);

                var api = $btn.attr(ATTR_API);
                var method = $btn.attr(ATTR_METHOD) || 'get';

                if (!api) {

                    $btn.addClass('disabled');

                    throw new Error('api is not specified: ' + api);

                }

                if (!/^(post|get|put|delete)$/.test(method)) {

                    $btn.addClass('disabled');

                    throw new Error('method is invalid: ' + method);

                }

                var bindEvent = function () {

                    $btn.one('click', function () {

                        var paramList = $(form).serializeArray();
                        var params = {};

                        paramList.forEach(function (param) {

                            params[param.name] = param.value;

                        });



                        qwest[method](api, params).then(function (res) {

                            $btn.trigger('success.ajax-form', res);

                        }).catch(function (e) {

                            $btn.trigger('failure.ajax-form', e);

                            console.log(e);
                            console.log(e.stack);

                        }).then(bindEvent);

                    });

                };

                bindEvent();

            });

        };

        // init the button
        initButton();


        // mark init done
        $(form).attr(ATTR_INITIALIZED, 'on');

    };

    var initAjaxForms = function () {

        $('.ajax-form').each(function () {

            initAjaxFormSingle(this);

        });
    };


    $(document).on('init.ajax-form', initAjaxForms);


    $(function () {

        $(document).trigger('init.ajax-form');

    });

}(jQuery));
