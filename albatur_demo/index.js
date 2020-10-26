$(document).ready(function () {
  
   
    personDataControl();


    isBirthDay();
    wishes();
    globTab = 0;
    getTaskList('/GetList', 1, 0);
    getPersons();
    //$('#gorevtopic').focus();

    $('#gorevtopic').keypress(function (e) {
        var key = e.which;
        if (key == 13) {
            addTask();
        }
    });
 
    document.getElementById('gorevTabBtn').click();
    document.getElementById("gorevtopic").focus();

    $('#fullcalendar-default-view').fullCalendar({
        height: 800,
        locale: 'tr',
        themeSystem: 'bootstrap4',
        bootstrapFontAwesome: {
            close: ' ion ion-md-close',
            prev: ' ion ion-ios-arrow-back scaleX--1-rtl',
            next: ' ion ion-ios-arrow-forward scaleX--1-rtl',
            prevYear: ' ion ion-ios-arrow-dropleft-circle scaleX--1-rtl',
            nextYear: ' ion ion-ios-arrow-dropright-circle scaleX--1-rtl'
        },

        header: {
            left: 'title',
            center: 'month,agendaWeek,agendaDay',
            right: 'prev,next today'
        },

        defaultDate: today,
        navLinks: true,
        selectable: true,
        selectHelper: true,
        weekNumbers: true,
        nowIndicator: true,
        firstDay: 1,
        businessHours: {
            dow: [1, 2, 3, 4, 5],
            start: '9:00',
            end: '18:00',
        },
        editable: true,
        eventLimit: false,
        events: eventList,
        select: function (start, end) {
            $('#fullcalendar-default-view-modal')
                .on('shown.bs.modal', function () {
                    $(this).find('input[type="text"]').trigger('focus');
                    $('#addBtn').css('display', 'block');
                    $('#updateBtn').css('display', 'none');
                })
                .on('hidden.bs.modal', function () {
                    $(this)
                        .off('shown.bs.modal hidden.bs.modal submit')
                        .find('input[type="text"], select').val('');
                    $('#fullcalendar-def ault-view').fullCalendar('unselect');
                })
                .on('submit', function (e) {
                    e.preventDefault();
                    var title = $(this).find('input[type="text"]').val();
                    var className = $('#tip').val();
                    var baslangic_date = new Date(start._i);
                    if (title) {
                        var eventData = {
                            title: title,
                            start: start,
                            end: end,
                            className: className
                        }
                        var idd = Number($('#id').val());
                        console.log(idd);
                        var baslik = $('#topic').val();
                        var detay = $('#detail').val();
                        var bitis = $('#bitisTarihi').val();
                        var ozel = document.getElementById('chkOzel').checked;
                        var _data = {
                            "not_aciklama": detay,
                            "baslik": baslik,
                            "is_bana_ozel": ozel,
                            "not_date": baslangic_date,
                            "not_bitis_date": bitis,
                            "renk": className
                        };
                        takvimOlustur(_data);
                        $('#fullcalendar-default-view').fullCalendar('renderEvent', eventData, false);
                    }
                    $(this).modal('hide');
                })
                .modal('show');
        },
        eventClick: function (calEvent, jsEvent, view) {
            $('#addBtn').css('display', 'none');
            $('#updateBtn').css('display', 'block');
            $('#baslangicTarihi').css('display', 'block');
            $('#id').val(calEvent.id);
            $('#topic').val(calEvent.title);
            $('#detail').val(calEvent.detail);
            $('#personName').val(calEvent.personName);
            $('#fullcalendar-default-view-modal').modal('show');
            $('#baslangicTarihi').val(new Date(calEvent.start._i));
            if (view) {
                $('#baslangicTarihi').val(new Date(view.start._d));

            }
            document.getElementById('chkOzel').checked = calEvent.ozel;
        }
    }
    );
});
var myId = new Map();
function personDataControl(){
    
        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Person/GetbyId',
            {},
            function (response) {
                if (response.status) {
                    response.data.forEach(function (data, index) {
                        console.log(data);
                        var personnIdControl=data.id;
                        var adminControl=data.is_admin;
                        if(adminControl == true){
                            $('#isAdminSeen').show();
                        }else{
                            $('#isAdminSeen').hide();

                        }
                       
                        myId.set("myId",personnIdControl);
                   
    
    
                        
                    $.closeSwal();
                });
                };
            
    
            }
        );
    
}
function getPersons() {
    $.showSwal("Yükleniyor");

    $.getData(
        'POST',
        'Person/Getlist',
        {},
        function (response) {
            $("#personList").html('');
            if (response.status) {
                var rows = " <option value='0' disabled selected>Kişi Seçiniz</option>  ";

                response.data.forEach(function (person) {
                    rows += '<option value="' + person.id + '">' + person.ad_soyad + '</option>';

                });
                $("#person").html(rows);
                $("#personList").html(rows);

                //select box'ta kişi arama yapılabilsin diye chosen kullanıldı              
                $('#personList').chosen({ width: '100%', height: '45px' });

                $.closeSwal();
            };
        }
    );

}


// function getPersons(str) {

//     $.showSwal("Yükleniyor");
//     $.getData(
//         'POST',
//         'Person/Getlist',
//         {},
//         function (response) {
//             $("#" + str + "person").html('');
//             if (response.status) {
//                 var rows = "";
//                 response.data.forEach(function (data) {
//                     rows += '<option value="' + data.id + '">' + data.ad_soyad + '</option>';

//                     if (globTab == 1) {
//                         eventList.push({
//                             "id": data.id,
//                             "title": "Doğum Günü",
//                             "start": new Date(data.dogum_tarihi),
//                             "end": new Date(data.dogum_tarihi),
//                             "detail": "Personel Doğum Günü",
//                             "className": "fc-event-warning",
//                             "personId": data.id,
//                             "personName": data.ad_soyad,
//                             "ozel": false,
//                             "gorev": false

//                         });
//                     }
//                 });
//                 $('#fullcalendar-default-view').fullCalendar('renderEvents', eventList, true);
//                 rows += '<option selected id="personChoose" value="0">Seçiniz </option>';

//                 $("#" + str + "person").html(rows);
//                 $.closeSwal();
//             };
//         }
//     );
// }


function addTask() {
    var topic = $('#gorevtopic').val();
    var priority = Number($('#priority').val());
    var person = Number($('#person').val());
    var _data = {
        "gorev_alan": person, //Person that takes tasks
        "baslik": topic, //Task title
        "aciliyet": priority //emergency of the task
    };

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev/quickadd',
        _data,
        function (response) {
            if (response.status) {
                //Succesful , New Save Process Succesful
                setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);

                //getTaskList('/GetList?criteria=and g.bitis_tarihi is null'); 
                getTaskList('/GetList', 1);
                $('#postform1').trigger('reset');
                $.closeSwal();
            };
        }
    );

}

// function getTaskList(que) {
//     $.getData(
//         'POST',
//         'Gorev' + que,
//         {},
//         function (response) {
//             if (response.status) {
//                 var i = 0;
//                 var rows = "";
//                 $('#taskList').html();
//                 var closedTask = "";
//                 var openedTask = "";
//                 var closeNum = 0;
//                 var openNum = 0;
//                 response.data.forEach(function (data) {
//                     var str = "";
//                     if (data.durum == 2) {
//                         closeNum++;
//                         str = '<label class="badge badge-primary">Kapalı <i class="fa fa-smile-o" aria-hidden="true"></i></label>';
//                     }
//                     else if (data.durum == 1) {
//                         openNum++;
//                         str = '<label class="badge badge-success">Açık <i class="fa fa-frown-o" aria-hidden="true"></i></label>';
//                     }
//                     var acil = "";

//                     if (data.aciliyet == 1)
//                         acil = '<label class="badge badge-danger">Yüksek </label>';

//                     else if (data.aciliyet == 2)
//                         acil = '<label class="badge badge-warning">Orta <i class="fa fa-frown-o" aria-hidden="true"></i></label>';
//                     else
//                         acil = '<label class="badge badge-primary">Düşük <i class="fa fa-frown-o" aria-hidden="true"></i></label>';

//                     i++;
//                     rows += '<div class="singleElem">' +
//                         '<div class="row align-items-center">' +
//                         ' <div class="status-row">' + str + ' ' + acil + '</div>' +
//                         '<div class="title-row">' +
//                         '<h6>' + data.baslik + ' </h6>' +
//                         '  </div>' +
//                         ' </div>' +
//                         ' <div class="row align-items-center bottom-row">' +
//                         '  <div class="">' + data.gorev_veren_username + '</div>' +
//                         ' <div class="">' +
//                         '<h6>' + data.baslangic_tarihi + '--' + (data.bitis_tarihi == null ? '' : data.bitis_tarihi) + ' Atanmış Kişi:  ' + data.gorev_alan_username + '</h6>' +
//                         '</div>' +
//                         '<div class=""> <button style="width: 63px;" title="Yorumlar" class="btn btn-outline-warning has-status btn-color-search standard-button" data-toggle="modal" data-target="#detailmodalwindow" id="searchButton" onclick="getDataFromIdSearch(' + data.id + ')"><i class="fas fa-search" style="padding-right:1px;"> </i> <span class="status-amount red">  ' + data.yorum_sayisi + '</span></button>  <button title="Log" class="btn btn-outline-success btn-color-info standard-button" data-toggle="modal" data-target="#logmodalwindow" id="logButton" onclick="getLogDatas(' + data.id + ')"> <i class="fas fa-info-circle"></i></button>  </div>' +
//                         '</div></div>';
//                     if (globTab == 1) {
//                         eventList.push({
//                             "id": data.id,
//                             "title": data.baslik,
//                             "start": new Date(data.baslangic_tarihi),
//                             "end": new Date(data.bitis_tarihi),
//                             "detail": data.icerik,
//                             "className": "fc-event-info",
//                             "personId": 322,
//                             "personName": data.gorev_alan_username,
//                             "ozel": false,
//                             "gorev": true

//                         });
//                     }

//                 });
//                 $('#fullcalendar-default-view').fullCalendar('renderEvents', eventList, true);
//                 $('#taskList').html(rows);
//             }
//         }
//     );


// }



/*görev log*/
function getDataFromIdSearch(id) {

    if (window.location.href.indexOf("panel") >= 0) {
        window.location.href = baseHref + "/panel/task-detail?task=" + id;
    }
    else {
        window.location.href = baseHref + "/task-detail?task=" + id;
    }
    // // getDataFromId(id); idler değişmeli
    // getPersons('detail');

    // $.showSwal("Yükleniyor");
    // $.getData(
    //     'POST',
    //     'Gorev/Getlist?criteria=AND g.id=' + id,
    //     {},
    //     function (response) {
    //         if (response.status) {

    //             $('#detailAssaigned').val(response.data[0].gorev_alan_username);
    //             $('#detailtaskOwner').html(response.data[0].gorev_veren_username);
    //             $('#detailtaskDate').html(response.data[0].baslangic_tarihi);
    //             $('#detailcreatedDate').html(response.data[0].bitis_tarihi);
    //             $('#detailtopic').val(response.data[0].baslik);
    //             $('#detailpriority').val(response.data[0].aciliyet);
    //             $('#detailstatus').val(response.data[0].durum);
    //             $('#detailperson').val(response.data[0].gorev_alan_id);
    //             $('#detailgorev_veren').val(response.data[0].gorev_veren_id);
    //             document.getElementById('detaildescription').value = response.data[0].icerik;
    //             $.getFormattedDate(response.data[0].bitis_tarihi, function (formatlanmis) {
    //                 console.log(formatlanmis);
    //                 $('#detailterminTarihi').val(formatlanmis);
    //             });
    //             $.getFormattedDate(response.data[0].baslangic_tarihi, function (formatlanmis) {
    //                 console.log(formatlanmis);
    //                 $('#detailgorevTarihi').val(formatlanmis);
    //             });



    //             $('#id').val(response.data[0].id);
    //             $.closeSwal();
    //         };
    //     }
    // );

    // $.showSwal("Yükleniyor");
    // $.getData(
    //     'POST',
    //     'GorevYorum/Getlist?criteria=AND gy.gorev_id=' + id,
    //     {},
    //     function (response) {
    //         if (response.status) {
    //             var str = "";
    //             $('#comments').html("");
    //             response.data.forEach(function (data) {

    //                 var btn = "";
    //                 if (data.file != null) {
    //                     btn = '<a class="btn btn-outline-warning" target="blank" href="' + baseHref + data.file + '">  <i class="fas fa-search"></i> </a> ';

    //                 }
    //                 str += ' <div class="chat-message-left mb-4"><div>    <i class="fa fa-user" aria-hidden="true"></i>    <div class="text-muted small text-nowrap mt-2" >' + data.eklenme_zaman + '</div></div><div class="flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3">    <div class="font-weight-semibold mb-1">' + data.person_user_name + '</div>' + data.yorum + '</div> ' +
    //                     btn + ' </button></div>'

    //             });
    //             $('#comments').html(str);
    //             $.closeSwal();
    //         };
    //     }
    // );

    // $.showSwal("Yükleniyor");
    // $.getData(
    //     'POST',
    //     'GorevFile/Getlist?criteria=where gorev_id=' + id,
    //     {},
    //     function (response) {
    //         if (response.status) {
    //             var str = "";

    //             response.data.forEach(function (data) {

    //                 str += " <tr>" +
    //                     "<td class='align-middle' id='t_url'><a target='_blank' href='" + baseHref + data.file + "'> " + baseHref + data.file + "</a> </td>" +
    //                     "<td class='table-action' id='islemler'>" + "  <button hidden title='Sil' class='btn btn-outline-danger' id='removebutton' onclick='fileRemove(" + data.id + ");'> <i class='fas fa-trash-alt'></i> </button>  </td> </tr>";

    //             });
    //             $('#file-list').html(str);
    //             setTableSearch('file-table');
    //             $.closeSwal();
    //         };
    //     }
    // );
}

function getLogDatas(id) {

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev/GetLogs?criteria=and gl.gorev_id=' + id,
        {},
        function (response) {
            if (response.status) {
                var str = "";
                response.data.forEach(function (data) {
                    str += " <tr>" +
                        "<td class='align-middle' id='t_url'>" + data.islem + "</td>" +
                        "<td class='align-middle' id='t_url'>" + data.username + "</td>" +
                        "<td class='align-middle' id='t_url'>" + data.baslik + " </td>" +
                        "<td class='align-middle' id='t_url'> " + data.zaman + "</td> </tr>";
                });
                $('#gorevlog-list').html(str);
                setTableSearch('gorevlog-table');
                $.closeSwal();
            };
        }
    );
}

function filterChange() {
    $('#fullcalendar-default-view').fullCalendar('removeEvents');
    eventList = [];
    var statu = $('#filterStatus').val();
    if (statu == 0) {
    }
    else if (statu == 1) {
        $('#selectStatus').val(2);
        gorevStatusChanged();
        /* <option value="1">Bana Atanmış Görevler</option>
           <option value="2">Benim Atadığım Görevler</option>
           <option value="3">Personel Doğum Günleri</option>
           <option value="4"> Müşteri Doğum Günleri</option>
           <option value="5">Takvim Notları</option>*/
    }
    else if (statu == 2) {
        $('#selectStatus').val(1);
        gorevStatusChanged();
    }
    else if (statu == 3) {
        getPersons();
    }
    else if (statu == 4) {
        getCustomerListForBirtday();
    }
    else if (statu == 5) {
        getTakvim();
    }
    console.log("geldim");
}

// function gorevStatusChanged() {
//     var que = $('#selectStatus').val();
//     if (que == 0) {
//         getTaskList('/GetList?criteria=and g.bitis_tarihi is null');

//     }
//     else if (que == 1) {
//         getTaskList('/GetverilenTask');
//     }
//     else if (que == 2) {
//         getTaskList('/GetMyTask');
//     }
// }

function openTabBar(evt, cityName) {
    globTab = 0;
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    console.log(evt.currentTarget.id);
    if (evt.currentTarget.id.indexOf("takvim") > -1) {
        globTab = 1;
    }
    document.getElementById("gorevtopic").focus();
}
var globTab = 0; //aktif olan tab takvim ise 1
var today = new Date();
var y = today.getFullYear();
var m = today.getMonth();
var d = today.getDate();
var eventList = [];

function getTakvim() {

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Takvim/Getlist',
        {},
        function (response) {
            if (response.status) {
                var i = 0;
                response.data.forEach(function (data) {
                    eventList.push({
                        "id": data.id,
                        "title": data.baslik,
                        "start": new Date(data.not_date),
                        "end": new Date(data.not_bitis_date),
                        "detail": data.not_aciklama,
                        "className": data.renk,
                        "personId": data.person_id,
                        "personName": data.user_name,
                        "ozel": data.is_bana_ozel,
                        "gorev": false

                    });
                });
                $('#fullcalendar-default-view').fullCalendar('renderEvents', eventList, true);
                $.closeSwal();
            };
        });
}

function takvimOlustur(_data) {

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Takvim/add',
        _data,
        function (response) {
            if (response.status) {
                setTimeout(function () { Swal.fire("Başarılı", "Kayıt İşlemi Başarılı", "success"); }, 868);

                $.closeSwal();
                location.reload();
            };
        }
    );
}

function takvimGuncelle() {

    var idd = Number($('#id').val());
    var baslik = $('#topic').val();
    var detay = $('#detail').val();
    var bitis = $('#bitisTarihi').val();
    var renk = $('#tip').val();
    var ozel = document.getElementById('chkOzel').checked;
    _data = {
        "id": idd,
        "not_aciklama": detay,
        "baslik": baslik,
        "is_bana_ozel": ozel,
        "not_bitis_date": bitis

    };

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Takvim/update',
        _data,
        function (response) {
            if (response.status) {
                setTimeout(function () { Swal.fire("Başarılı", "Kayıt İşlemi Başarılı", "success"); }, 868);

                $.closeSwal();
            };
        }
    );
}

function getCustomerListForBirtday() {

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Customer/Getlist',
        {},
        function (response) {
            if (response.status) {

                response.data.forEach(function (data) {
                    console.log(data.dogum_tarihi);
                    if (globTab == 1) {
                        eventList.push({
                            "id": data.id,
                            "title": "Doğum Günü",
                            "start": new Date(data.dogum_tarihi),
                            "end": new Date(),
                            "detail": "Müşteri Doğum Günü",
                            "className": 'fc-event-warning',
                            "personId": data.id,
                            "personName": data.yetkili_adi,
                            "ozel": false,
                            "gorev": false
                        });
                    }
                });
                $('#fullcalendar-default-view').fullCalendar('renderEvents', eventList, true);
                $.closeSwal();
            };
        }
    );
}

function takvimSil() {
    var idd = Number($('#id').val());
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
        setTimeout(function () { Swal.fire("Başarısız", "Silme Nedeni Girilmeli!", "error"); }, 868);
    }
    else {
        var _data = { "id": idd, "silen_id": 1 };

        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Takvim/delete',
            _data,
            function (response) {
                if (response.status) {
                    setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı", "success"); }, 868);

                    $.closeSwal();
                };
            });
    }
}

$(function () {
    var today = new Date();
    var y = today.getFullYear();
    var m = today.getMonth();
    var d = today.getDate();
    getTakvim();
});

function getTaskList(que, cri, istenenPerson) {


    function isOpen(state) {
        if (state == 1) {
            return `<div class="ui-legend bg-success" title="Açık Görev" style="width:8px;height:48px; display: inline-block;vertical-align: inherit; margin-left:-5px; margin-right:8px; margin-top:-10px; margin-bottom:-10px; background-color: #0078d4 !important;"></div>`;
        }
        else if (state == 2) {
            return `<div class="ui-legend bg-danger" title="Kapalı Görev" style="width:8px;height:48px; display: inline-block;vertical-align: inherit; margin-left:-5px; margin-right:8px;margin-top:-10px; margin-bottom:-10px;"></div>`;
        }
    }
    function whatColor(pri) {
        if (pri == 1) {
            return "#FFE3E3";
        }
        else if (pri == 2) {
            return "#D3ECF5";
        }
        else if (pri == 3) {
            return "#D5F5EB";
        } else if (pri == 0) {
            return "#ffffff";
        }
    }
    var _data = {};
    if (cri == 1) {
        _data =
        {
            "durum": 1
        }
    }
    if (cri == 2) {
        _data = {
            "durum": 2
        }
    }
    if (cri == 0 && istenenPerson != 0) {
        _data = {
            "id": istenenPerson
        }
    }
    if (cri == 1 && istenenPerson != 0) {
        _data = {
            "id": istenenPerson,
            "durum": 1
        }
    }
    if (cri == 2 && istenenPerson != 0) {
        _data = {
            "id": istenenPerson,
            "durum": 2
        }
    }
    function isComplete(durum, gelenId) {
       
        if (durum == 1) {
            return `<button style="width: 63px;margin-right:5px;background-color: #ff4a00 !important;" title="Görevi Tamamla" class="btn btn-outline-success has-status btn-color standard-button" id="gorevTamamla" onclick="taskComplete(${gelenId})"><i class="fas fa-check" style="padding-right:1px;"> </i></button>`
        } else {
            return '';
        }
    }
    function gorevGelenYer(gorevTip) {
        if (gorevTip == 1) {
            return `<div   title="Detaylı Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"></i><i class="fas fa-tasks" style="font-size:20px !important;"></i> </div>`;
        }
        if (gorevTip == 2) {
            return `<div   title="Hızlı Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"></i><i class="fas fa-tasks" style="font-size:20px !important;"></i> </div>`;

        }
        if (gorevTip == 3) {
            return `<div title="Toplantı Görev" class=""  style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"></i>  <i class="fas fa-user"></i></div>`;
        }
    }
    function taskWho(id) {
       var personIdControl= myId.get("myId");
        
        if (id == personIdControl) {
            return `<div title="Bana Atanan Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"><i class="fas fa-people-arrows" style="font-size:20px !important;"></i> </div>`

        }
        else {
            return `<div title="Benim Atadığım Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"><i class="fas fa-street-view" style="font-size:20px !important;"></i> </div>`

        }

    }
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev' + que,
        _data,
        function (response) {
            if (response.status) {
                var i = 0;
                var rows = "";
                $('#task-list').html('');

                response.data.forEach(function (data) {

                    i++;
                    rows += '<tr id="taskSutun">' +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_index'style='width: 30px' >" + isOpen(data.durum) + i + "</td>" +
                        "<td class='align-middle'  onclick=goToTaskDetail(" + data.id + ") id='t_index2'>" + taskWho(data.gorev_alan_id) + "</td>" +
                        "<td class='align-middle'  style='background-color:" + whatColor(data.aciliyet) + "' onclick=goToTaskDetail(" + data.id + ") id='t_priority' ></td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_index1'>" + gorevGelenYer(data.gorev_tip) + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_titlet' >" + data.baslik + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_content' >" + data.icerik + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_start_date' >" + data.baslangic_tarihi_format + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_finish_date' >" + data.bitis_tarihi_format + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_assign_person' >" + data.gorev_veren_username + "</td>" +
                        "<td class='align-middle' onclick=goToTaskDetail(" + data.id + ") id='t_taking_person' >" + data.gorev_alan_username + "</td>" +
                        "<td class='table-action' id='islemler'>" +
                        '<div class=""> <button style="width: 63px;visibility: hidden !important;" title="Yorumlar" class="btn btn-outline-warning has-status btn-color-search standard-button" data-toggle="modal" data-target="#detailmodalwindow" id="searchButton" onclick="getDataFromIdSearch(' + data.id + ')"><i class="fas fa-search" style="padding-right:1px;"> </i> <span class="status-amount red">  0</span></button>' +
                        '<button style="display:none;">' + isComplete(data.durum, data.id) + '</button>' +
                        '<button title="Log" class="btn btn-outline-success btn-color-info standard-button" data-toggle="modal" data-target="#logmodalwindow" id="logButton" onclick="getLogDatas(' + data.id + ')"> <i class="fas fa-info-circle"></i></button>  </div>' +

                        "</tr>";
                });

                $('#task-table').DataTable().destroy()
                $('#task-list').html(rows);
                setTableSearch('task-table');
                $.closeSwal();
            };
        }
    );
}

function taskComplete(gorevId) {
    var _data1 = {
        "id": gorevId,
        "durum": 2
    }
    Swal.fire({
        title: 'Görev Tamamlansın mı?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
    }).then((result) => {
        if (result.isConfirmed) {
            $.getData(
                'POST',
                'Gorev/Close',
                _data1,
                function (response) {
                    if (response.status) {
                        gorevStatusChanged();

                        setTimeout(function () {
                            setTimeout(function () { Swal.fire("Başarılı", "Görev Tamamlandı", "success"); }, 868);

                        }, 500);
                    };
                }
            );
        }
    })
}

function durumDegistir() {
    var assigmentType = $("input[name=atamayaGore]:checked").val();
    var selectDurum = $("input[name=durumaGore]:checked").val();

    if (assigmentType == 0) {
        getTaskList('/Getlist', selectDurum);
    }
    else if (assigmentType == 1) {
        getTaskList('/GetverilenTask', selectDurum);
    }
    else if (assigmentType == 2) {
        getTaskList('/GetMyTask', selectDurum);

    }

}
$('#backToDefault').on('click',function(){
    $('#baskasinaAtamayaGore').hide();    
    $('#baskasininDurumu').hide();
    $('#selectAtamayaGore').show();
    $('#selectDurumaGore').show();
    $('#backToDefault').hide();
    $("#personList").val(0).trigger("chosen:updated.chosen");
    $("#defaultChecked").prop("checked", true);
    $("#acikDurumDefault").prop("checked", true);

    
    getTaskList('/GetList', 1, 0);
});

function kisiAra() {
    $('#selectAtamayaGore').hide();
    $('#selectDurumaGore').hide();
    $('#baskasinaAtamayaGore').show();    
    $('#baskasininDurumu').show();
    $("#hepsiDurumAnother").prop("checked", true);
    $("#atananHepsiAnother").prop("checked", true);
    $('#backToDefault').show();
    var istenenPersonId = Number($('#personList').chosen().val());
    getTaskList('/GetByPId', 0, istenenPersonId);
    
   
}

function anotherChange(){
    var anotherPerson = $("input[name=anotherPerson]:checked").val();
    var istenenPersonId = Number($('#personList').chosen().val());
    var anotherState = $("input[name=anotherState]:checked").val();
    
    if(anotherPerson == 1){
        getTaskList('/GetverilenTask',anotherState , istenenPersonId);
    }
    if(anotherPerson == 2){
        getTaskList('/GetMyTask', anotherState, istenenPersonId);
    }if (anotherPerson == 0) {
        getTaskList('/GetByPId', anotherState, istenenPersonId);
    }

}
function durumDegistirBaskasi() {
    var istenenPersonId = Number($('#personList').chosen().val());
    var anotherPerson = $("input[name=anotherPerson]:checked").val();
    $("#hepsiDurumAnother").prop("checked", true);
    console.log(anotherPerson);
    if (anotherPerson == 1) {
        getTaskList('/GetverilenTask', 0, istenenPersonId);
        
    } if (anotherPerson == 2) {
        getTaskList('/GetMyTask', 0, istenenPersonId);        
    } if (anotherPerson == 0) {
        getTaskList('/GetByPId', 0, istenenPersonId);  
    }      
}


function detailsTask() {
    var x = document.getElementById("detailsSec");
    var element = document.getElementById("toggleIcon");
    if (x.style.display === "none") {
        x.style.display = "block";

        element.className = element.className.replace(/\bfeather icon-chevron-down\b/g, "feather icon-chevron-up");

        $("#btnDetailsTask").attr({
            "title": "Detayları Gizle"
        });

    } else {
        x.style.display = "none";
        element.className = element.className.replace(/\bfeather icon-chevron-up\b/g, "feather icon-chevron-down");
        document.getElementById("priorityChoose").selected = "true";
        document.getElementById("personChoose").selected = "true";
        $("#btnDetailsTask").attr({
            "title": "Detayları Göster"
        });
    }
}
function goToTaskDetail(id_) {
    //task-detaile gidildiğinde nerden gelindigini bulabilmek icin sessionda tut
    sessionStorage.setItem("loc", "index");
    if (window.location.href.indexOf("panel") >= 0) {
        window.location.href = baseHref + "/panel/task-detail?task=" + id_;
    }
    else {
        window.location.href = baseHref + "/task-detail?task=" + id_;
    }
}
var nowdate = $.nowDate2();
var index2 = 0;

function wishes() {
    var _data = {
        "criteria": "AND i.icerik_konum=1"
    }
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'IcerikPerson/GeticerikPerson',
        _data,
        function (response) {
            //console.log(wd);
            //var wd= response.data[0].bitis_tarihi;
            //if(wd<nowdate) console.log("geçmemiş");
            //else if(wd>nowdate) console.log("geçmiş");
            $('#prevAndNext').html('');
            $('#carouselSec').html('');
            $('#navbarOl').html('');
            if (response.status) {
                var rows1 = "";
                var rows2 = "";
                var rows3 = "";
                if (response.data.length != 0) {

                    //response.data.bitis_tarihi<nowdate
                    response.data.forEach(function (data, index) {
                        console.log(index2);
                        console.log(response.data[index].bitis_tarihi);
                        console.log(nowdate);
                        console.log(data);
                        if (response.data[index].bitis_tarihi > nowdate) {

                            console.log("bitis tarihi gecmemiş");
                            if (data.file_url == null) {
                                if (index2 == 0) {
                                    rows3 += '<div class="carousel-item active" style="height: 210px;overflow-y: auto;">' +
                                        '<div class="card" >' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title">' + data.stok_adi + '</h5>' +
                                        '<h6 class="card-subtitle mb-2 text-muted">' + data.tip_adi + '</h6>' +
                                        '<p class="card-text">' + data.icerik + '</p>' +
                                        '</div></div></div>';
                                } else {
                                    rows3 += '<div class="carousel-item" style="height: 210px;overflow-y: auto;">' +
                                        '<div class="card" >' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title">' + data.stok_adi + '</h5>' +
                                        '<h6 class="card-subtitle mb-2 text-muted">' + data.tip_adi + '</h6>' +
                                        '<p class="card-text">' + data.icerik + '</p>' +
                                        '</div></div></div>';
                                }
                            } else if (data.file_url != null) {
                                if (index2 == 0) {
                                    rows3 += '<div class="carousel-item active" style="height: 210px;overflow-y: auto;">' +
                                        '<div class="card">' +
                                        '<div style="text-align: center;" >' +
                                        '<img class="card-img-top" style="height:165px;width:165px" src="..' + data.file_url + '" alt="Card image cap">' +
                                        '</div>' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title">' + data.stok_adi + '</h5>' +
                                        '<h6 class="card-subtitle mb-2 text-muted">' + data.tip_adi + '</h6>' +
                                        '<p class="card-text">' + data.icerik + '</p>' +
                                        '</div></div></div>';
                                } else {
                                    rows3 += '<div class="carousel-item" style="height: 210px;overflow-y: auto;">' +
                                        '<div class="card" >' +
                                        '<div style="text-align: center;" >' +
                                        '<img class="card-img-top" style="height:165px;width:165px" src="..' + data.file_url + '" alt="Card image cap">' +
                                        '</div>' +
                                        '<div class="card-body">' +
                                        '<h5 class="card-title">' + data.stok_adi + '</h5>' +
                                        '<h6 class="card-subtitle mb-2 text-muted">' + data.tip_adi + '</h6>' +
                                        '<p class="card-text">' + data.icerik + '</p>' +
                                        '</div></div></div>';
                                }
                            }
                            if (index2 == 0) {
                                rows2 += '<li data-target="#myCarousel1" data-slide-to="' + index2 + '" class="active"></li>';
                                index2++;
                            } else {
                                rows2 += '<li data-target="#myCarousel1" data-slide-to="' + index2 + '"></li>';
                                index2++;
                            }
                            rows1 += '<a class="btn-floating" href="#multi-item-example" data-slide="prev"><i class="fas fa-chevron-left" style="position: absolute;margin-left: 14px;left: -13px;top: 50%;z-index: 14;"></i></a>' +
                                '<a class="btn-floating" href="#multi-item-example" data-slide="next"><i class="fas fa-chevron-right" style="position: absolute;margin-right: 14px;right: -13px;top: 50%;z-index: 14;"></i></a>';
                        }
                        else {
                            index++;
                            console.log("bitiş tarihi gecmiş");
                        }
                    });

                    $('#prevAndNext').html(rows1);
                    $('#carouselSec').html(rows3);
                    $('#navbarOl').html('<ol class="carousel-indicators">' + rows2 + '</ol>');
                }
                else if (response.data.length == 0) {
                    console.log("gösterilecek içerik yok");
                }
                $.closeSwal();
            };
        }
    );
}

function isBirthDay() {
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/WhoBirth',
        {},
        function (response) {
            $('#prevAndNext2').html('');
            $('#carouselSec2').html('');
            $('#navbarOl2').html('');
            if (response.status) {
                var rows1 = "";
                var rows2 = "";
                var rows3 = "";
                if (response.data.length != 0 /*&& response.data[0].bitis_tarihi_format<$.nowDate2()*/) {

                    response.data.forEach(function (data, index) {
                        if (index == 0) {
                            rows3 += '<div class="carousel-item active" style="height: 210px;overflow-y: auto;">' +
                                '<div class="card" >' +
                                '<div class="card-body">' +
                                '<h5 class="card-title">Doğum Günün Kutlu Olsun</h5>' +
                                '<h6 class="card-subtitle mb-2 text-muted">' + data.ad_soyad + '</h6>' +

                                '</div></div></div>';
                        } else {
                            rows3 += '<div class="carousel-item" style="height: 210px;overflow-y: auto;">' +
                                '<div class="card" >' +
                                '<div class="card-body">' +
                                '<h5 class="card-title">Doğum Günün Kutlu Olsun</h5>' +
                                '<h6 class="card-subtitle mb-2 text-muted">' + data.ad_soyad + '</h6>' +
                                '</div></div></div>';
                        }

                        if (index == 0) {
                            rows2 += '<li data-target="#myCarousel2" data-slide-to="' + index + '" class="active"></li>';
                            index++;
                        } else {
                            rows2 += '<li data-target="#myCarousel2" data-slide-to="' + index + '"></li>';
                            index++;
                        }

                    });
                    rows1 += '<a class="btn-floating" href="#multi-item-example2" data-slide="prev"><i class="fas fa-chevron-left" style="position: absolute;margin-left: 14px;left: -13px;top: 20%;z-index: 14;"></i></a>' +
                        '<a class="btn-floating" href="#multi-item-example2" data-slide="next"><i class="fas fa-chevron-right" style="position: absolute;margin-right: 14px;right: -13px;top: 20%;z-index: 14;"></i></a>';
                    $('#prevAndNext2').html(rows1);
                    $('#carouselSec2').html(rows3);
                    $('#navbarOl2').html('<ol class="carousel-indicators">' + rows2 + '</ol>');
                }
                else if (response.data.length == 0) {
                    console.log("gösterilecek içerik yok");
                }
                $.closeSwal();
            };

        }
    );
}