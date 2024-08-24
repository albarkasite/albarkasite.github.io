
function generateForm(data) {

    //empty out the preview area
    $("#custome_att").empty();
  
    // $.getJSON('sjfb-load.php?form_id=' + formID, function(data) {
    if (data) {
        //go through each saved field object and render the form HTML
        $.each(data, function (k, v) {

            var fieldType = v['type'];
            var req = v['req'];

            //Add the field
            $('#custome_att').append(addFieldHTML(fieldType, v['label']));
            var $currentField = $('#custome_att .sjfb-field').last();

            //Add the label
            if (req) {
                $currentField.find('label').html(v['label'] + " <b style='color: #a94442'>*</b> ");
            } else {
                $currentField.find('label').text(v['label']);
            }

         

            //Any choices?
            if (v['choices']) {

                var uniqueID = Math.floor(Math.random() * 999999) + 1;
                var req = v['req'] ? "<b style='color: #a94442'>*</b>" : "";
                $.each(v['choices'], function (k, v) {

                    if (fieldType == 'select') {
                        var selected = v['sel'] ? ' selected' : '';
                        var priceShow = v['price'] && v['price'] != 0 ? `${strLang(`[${v['price']}+]`, `[+${v['price']}]`)}` : '';
                        //var choiceHTML = '<option  value=' + v['price'] + ' ' + selected +  '>' + v['label'] + '</option>';
                        var choiceHTML = `<option data-price="${v['price']}"  value="${v['label']}" ${selected} >${v['label']} ${priceShow} </option>`;
                        $currentField.find(".choices").append(choiceHTML);
                    } else if (fieldType == 'radio') {
                        var selected = v['sel'] ? ' checked' : '';
                        var choiceHTML = '<label><input type="radio" name="radio-' + uniqueID + '"' + selected + ' value="' + v['label'] + '">' + v['label'] + '</label>';
                        $currentField.find(".choices").append(choiceHTML);
                    } else if (fieldType == 'checkbox') {
                        var selected = v['sel'] ? ' checked' : '';
                        //var choiceHTML = '<label><input type="checkbox" name="checkbox-' + uniqueID + '[]"' + selected + ' value="' + v['label'] + '">' + v['label'] + '</label>';
                        var choiceHTML = `
                         <div class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" value="${v['label']}" ${selected} data-price="${v['price']}" name="checkbox-${uniqueID}"  id="${uniqueID + k}">
                                    <label class="custom-control-label" for="${uniqueID + k}">${v['label']} ${req} </label>
                                    </div>
                                <div  id="checkbox_error_${uniqueID}" class="checkbox_error"></div>
                            </div>
                        `

                        $currentField.find(".choices").append(choiceHTML);
                    }

                });
            }

            //Is it required?
            if (v['req']) {
                if (fieldType == 'text') {
                    $currentField.find("input").prop('required', true).addClass('required-choice')
                } else if (fieldType == 'file') {
                    $currentField.find("input").prop('required', true).addClass('required-choice')
                } 
                else if (fieldType == 'textarea') {
                    $currentField.find("textarea").prop('required', true).addClass('required-choice')
                } else if (fieldType == 'select') {
                    $currentField.find("select").prop('required', true).addClass('required-choice')
                } else if (fieldType == 'checkbox') {
                    $currentField.find("input").prop('required', true).addClass('required-choice')
                }
                else if (fieldType == 'radio') {
                    $currentField.find("input").prop('required', true).addClass('required-choice')
                }
                $currentField.addClass('required-field');
            }

        });
    }

    //HTML templates for rendering frontend form fields
    function addFieldHTML(fieldType , lebel ) {

        var uniqueID = Math.floor(Math.random() * 999999) + 1;

        switch (fieldType) {
            case 'text':
                const isDate = lebel.toLowerCase().includes("تاريخ") || lebel.toLowerCase().includes("date") ? "date" : "text";

                return '' +


                    `
                        <div id="sjfb-${uniqueID}"  class="input-div border-input sjfb-field sjfb-text">
                             <label for="text-${uniqueID}"></label>
                             <input type="${isDate}" maxlength="100"  class="form-control" name="${lebel}" id="text-${uniqueID}">
                       </div>
                    `;
            case 'file':
                return '' +


                    `
                        <div id="sjfb-${uniqueID}"  class="input-div border-input sjfb-field sjfb-file mb-3">
                             <label for="file-${uniqueID}"></label>
                             <div class="file-upload-wrapper" data-btn-text="${strLang('اختر ملف', 'Upload')}" data-text="${strLang('اختر  الملف الخاص بك!', 'Select your file!')}">
                                <input type="file"  class="form-control file-upload-field" name="${lebel}" id="file-${uniqueID}">
                              </div>
                            <label id="file-${uniqueID}-error"  style="display: none" class="error" for="file-${uniqueID}">${strLang('الحقل مطلوب', 'Required')}.</label>
                            <div id="upload-file-${uniqueID}" class="file-upload-now" style="display: none">
                                 <i data-feather="upload-cloud"></i>
                               ${strLang('يتم تحميل الملف', 'File is uploading')}
                                <i class="fa fa-spinner fa-spin"></i>

                            </div>
                            <div  id="error-file-${uniqueID}" class="checkbox_error"></div>
                       </div>
                    `
            case 'textarea':
                return '' +
                    '<div id="sjfb-' + uniqueID + '" class="sjfb-field sjfb-textarea">' +
                    '<label for="textarea-' + uniqueID + '"></label>' +
                    '<textarea id="textarea-' + uniqueID + '"></textarea>' +
                    '</div>';

            case 'select':
                return '' +

                    `
                        <div id="sjfb-${uniqueID}"  class="product-select store-custom-attr-select sjfb-field sjfb-select">
                           
                                        <label for="select-${uniqueID}"> </label>
                                            <select class="form-control choices choices-select"  name="${lebel}" id="select-${uniqueID}">
                                               <option data-price="0" selected hidden disabled value="-1">-- ${strLang('اختر' , 'Select')} --</option>
                                            </select>
                                   
                                    </div>
                    `

                    //'<div id="sjfb-' + uniqueID + '" class="sjfb-field sjfb-select">' +
                    //'<label for="select-' + uniqueID + '"></label>' +
                    //'<select id="select-' + uniqueID + '" class="choices choices-select"></select>' +
                    //'</div>';

            case 'radio':
                return '' +
                    '<div id="sjfb-' + uniqueID + '" class="sjfb-field sjfb-radio">' +
                    '<label></label>' +
                    '<div class="choices choices-radio"></div>' +
                    '</div>';

            case 'checkbox':
                return '' +



                    '<div id="sjfb-checkbox-' + uniqueID + '" class="sjfb-field sjfb-checkbox mt-3">' +
                /*    '<label class="sjfb-label"></label>' +*/
                    '<div class="choices choices-checkbox"></div>' +
                    '</div>' 
                    ;

            case 'agree':
                return '' +
                    '<div id="sjfb-agree-' + uniqueID + '" class="sjfb-field sjfb-agree required-field">' +
                    '<input type="checkbox" required="required">' +
                    '<label></label>' +
                    '</div>'
            //case 'file':
            //    return `
            //            <div id="sjfb-${uniqueID}"  class="input-div border-input sjfb-field sjfb-text">
            //                 <label for="text-${uniqueID}"></label>
            //                 <input type="file"  class="form-control" name="${lebel}" id="text-${uniqueID}">
            //           </div>
                 //      `
        }
    }
    // });
}