$(document).ready(function () {

    getTaskList(0, "GetList");

    //gorevStatusChanged();
    $('#myFile').change(function () {
        file = $('#myFile').prop('files')[0];
        console.dir(file);
    })
    $('#fileAddTask').change(function () {
        taskFile = $('#fileAddTask').prop('files')[0];
        console.dir(taskFile);
    })
    personDataControl();

    // var url = window.location.href;
    // if (url.indexOf("=") > -1) {


    //     var url_id = url.substring(url.lastIndexOf('=') + 1);
    //     if (url != 'http://localhost:5000/task') {

    //         getDataFromIdSearch(url_id);
    //         $('#detailmodalwindow').modal();

    //     }
    // }



});

function getPersons(departman) {

    $('#departmanTask').change(function () {
        if (departman != 0) {
            var departmanS = $("#departmanTask option:selected").text();
            var _data = {
                "departman": departmanS
            }
        } else if (departman == 0) {
            var _data = {

            }
        }
        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Person/Getlist',
            _data,
            function (response) {
                $("#person").html('');
                if (response.status) {
                    var rows = " <option value='0' disabled selected>Kişi Seçiniz</option>  ";
                    response.data.forEach(function (person) {
                        rows += '<option value="' + person.id + '">' + person.ad_soyad + '</option>';
                    });
                    $("#person").html(rows);
                    //select box'ta kişi arama yapılabilsin diye chosen kullanıldı              
                    //$('#person').chosen({ width:'100%',height:'45px' });
                    $.closeSwal();
                };
            }
        );
        $('#personSec').css('display', 'inline');
    });
}

function getDepartmants(departman) {
    getPersons(departman);
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/departmanList',
        {},
        function (response) {
            $("#departmanTask").html('');
            $.closeSwal();
            if (response.status) {
                if(departman==''){
                    var rows = " <option value='0' disabled selected>Departman Seçiniz</option>  ";
                }else{
                    var rows = " <option value='0' selected>Departman Seçiniz</option>  ";
                    
                }
                response.data.forEach(function (data) {
                    if(departman==''){
                        rows += '<option value="' + data.departman + '">' + data.departman + '</option>';
                    }else{
                        if(departman==data.departman){
                            rows += '<option selected value="' + data.departman + '">' + data.departman + '</option>';
                        }else{
                            rows += '<option value="' + data.departman + '">' + data.departman + '</option>';
                        }
                        
                    }
                    

                });
                $("#departmanTask").html(rows);
            };
        }
    );
    
}

var taskFile;
var file;

function getPersons2(id) {
    
    var _data = {
        "id":+id
    }

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/Getlist',
        _data,
        function (response) {
            $("#person").html('');
            $.closeSwal();
            if (response.status) {
                var rows = "";
                var rows2="";
                response.data.forEach(function (person) {
                    rows += '<option selected value="' + person.id + '">' + person.ad_soyad + '</option>';
                    getDepartmants(person.departman);
                    

                });
                $("#person").html(rows);
                
                
            };
        }
    );
}

function newSave() {

    $("#gorevTarihi").attr('min', $.nowDate2());
    $("#terminTarihi").attr('min', $.terminFutureMinDate());
    $("#person").val('');
    //$("#departmanTask").val(0).trigger("chosen:updated.chosen");
    getPersons(1);
    getDepartmants('');
    $('#formTaskStatus').css('display', 'none');
    $('#btnAddGorev').css('display', 'block');
    $('#btnAddPerson').css('display', 'none');

    $('#personSec').css('display', 'none');

}
function getDataFromId(id) {
    
    $('#personSec').css('display', 'inline');


    $('#modalwindow').modal('show');
    $('#formTaskStatus').css('display', 'block');
    $('#btnAddGorev').css('display', 'none');
    $('#btnAddPerson').css('display', 'block');

    $.showSwal("Yükleniyor");
    var _data = {
        "criteria_": "AND g.id=" + id
    }
    $.getData(
        'POST',
        'Gorev/Getlist',
        _data,
        function (response) {
            $.closeSwal();
            if (response.status) {
                var gelenIcerik = response.data[0].icerik
                if (gelenIcerik == null) {
                    gelenIcerik = "";
                }


                $('#taskOwner').html(response.data[0].gorev_veren_username);
                $('#topic').val(response.data[0].baslik);
                tinymce.get('description').setContent(gelenIcerik);
                $('#priority').val(response.data[0].aciliyet);
                $('#status').val(response.data[0].durum);
                $.showSwal("Yükleniyor");

                //getDepartmants();
                getPersons2(response.data[0].gorev_alan_id);
                //$("#person").val(response.data[0].gorev_alan_id);
                console.log(response.data[0].gorev_alan_id);

                //$("#departmanTask").val(response.data[0].gorev_alan_id).trigger("chosen:updated.chosen");
                $.closeSwal();

                $('#gorev_veren').val(response.data[0].gorev_veren_id);

                // $.getFormattedDate(response.data[0].bitis_tarihi, function (formatlanmis) {
                //     // console.log(formatlanmis);
                //     //    $('#terminTarihi').val(formatlanmis);
                // });
                // $.getFormattedDate(response.data[0].baslangic_tarihi, function (formatlanmis) {
                //     //   console.log(formatlanmis);
                //     //     $('#gorevTarihi').val(formatlanmis);
                // });

                //
                $('#terminTarihi').val(response.data[0].bitis_tarihi_format);
                // termin tarihi en az görev tarihinin başlangıcı
                $("#terminTarihi").attr('min', $.selectedDateBlockPast(response.data[0].baslangic_tarihi_format));

                $('#gorevTarihi').val(response.data[0].baslangic_tarihi_format);
                $("#gorevTarihi").attr('min', $.selectedDateBlockPast(response.data[0].baslangic_tarihi_format));


                $('#id').val(response.data[0].id);
                
            };
        }
    );

}



function getActiveTasks() {
    selectedStatus = 1;
    gorevStatusChanged();
}
function getClosedTasks() {
    selectedStatus = 2;
    gorevStatusChanged();
}
function getAllTask() {
    selectedStatus = 0;
    gorevStatusChanged();
}
function taskRemove(id) {
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
        setTimeout(function () { Swal.fire("Başarısız", "Sİlme Nedeni Girilmeli!", "error"); }, 868);

    }
    else {
        var _data = { "id": id, "silinme_aciklama": cause, "silen_id": 2 };
        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Gorev/delete',
            _data,
            function (response) {
                if (response.status) {

                    setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı", "success"); }, 868);

                    getTaskList(0, "GetList", 0);
                    $.closeSwal();
                };
            }
        );



    }
}
function changeTaskStatus() {
    var gorevId = Number($('#id').val());
    var status = Number($('#detailstatus').val());

    _data = {
        "id": gorevId,
        "durum": status
    }
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev/Close',
        _data,
        function (response) {
            if (response.status) {

                setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);

                $('#detailmodalwindow').modal('hide');
                $.closeSwal();
            };
        }
    );
}
function getDataFromIdSearch(id) {
    //task-detaile gidildiğinde nerden gelindigini bulabilmek icin sessionda tut
    sessionStorage.setItem("loc", "task");
    if (window.location.href.indexOf("panel") >= 0) {
        window.location.href = baseHref + "/panel/task-detail?task=" + id;
    }
    else {
        window.location.href = baseHref + "/task-detail?task=" + id;
    }


}


//-------------------------------------------------------------------
/*
function fileRemove(id) {
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
        Swal.fire("Başarısız", "Sİlme Nedeni Girilmeli!","error");
    }
    else {
        var _data = { "id": id, "silinme_aciklama": cause, "silen_id": 2 };
        $.showSwal("Yükleniyor");
    $.getData(
            'POST',
            'GorevFile/delete',
            _data,
            function (response) {
                if (response.status) {
                    Swal.fire("Başarılı", "Silme İşlemi Başarılı", "success");
                    location.reload();
                }

            }
        );



    }
}
*/

//--------------------------------
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


function getTaskList(stat, que) {


    function isOpen(state) {
        if (state == 1) {
            return `<div class="ui-legend bg-success" title="Açık Görev" style="width:8px;height:48px; display: inline-block;vertical-align: inherit; margin-left:-5px; margin-right:8px; margin-top:-10px; margin-bottom:-10px; background-color: #0078d4 !important;"></div>`;
        }
        else if (state == 2) {
            return `<div class="ui-legend bg-danger" title="Kapalı Görev" style="width:8px;height:48px; display: inline-block;vertical-align: inherit; margin-left:-5px; margin-right:8px;margin-top:-10px; margin-bottom:-10px;"></div>`;

        }
    }
    function isTask(appointedTask) {
        if (appointedTask == 1) {
            return `<div title="Detaylı Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"><i class="fas fa-tasks" style="font-size:20px !important;"></i> </div>`
        }
        if (appointedTask == 2) {
            return `<div   title="Hızlı Görev" class="" style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"></i><i class="fas fa-tasks" style="font-size:20px !important;"></i> </div>`
        }
        if (appointedTask == 3) {
            return `<div title="Toplantı Görev" class=""  style="border: 1px solid #949494;width:35px;height:30px;text-align: center;line-height: 30px;border-radius: 3px;color: #5f5f5f;margin-left:5px !important;"></i>  <i class="fas fa-user"></i></div>`
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
    function isComplete(durum, gelenId) {

        if (durum == 1) {
            return `<button style="width: 63px;margin-right:5px;background-color: #ff4a00 !important;" title="Görevi Tamamla" class="btn btn-outline-success has-status btn-color standard-button" id="gorevTamamla" onclick="taskComplete(${gelenId})"><i class="fas fa-check" style="padding-right:1px;"> </i></button>`
        } else {
            return '';
        }
    }

    var _data = {};
    if (stat == 1) {
        _data =
        {
            "durum": 1
        }
    }
    if (stat == 2) {
        _data = {
            "durum": 2
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
        'Gorev/' + que,
        _data,
        function (response) {
            if (response.status) {
                var i = 0;
                var rows = "";
                $('#task-list').html('');

                response.data.forEach(function (data) {

                    i++;
                    rows += "<tr id='taskSutun' >" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_index1'>" + isOpen(data.durum) + + i + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_index2'>" + taskWho(data.gorev_alan_id) + "</td>" +
                        "<td class='align-middle' style='background-color:" + whatColor(data.aciliyet) + "' onclick='getDataFromIdSearch(" + data.id + ")' id='t_priority' ></td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_tip1'>" + isTask(data.gorev_tip) + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_titlet'>" + data.baslik + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_content' >" + data.icerik + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_start_date' >" + data.baslangic_tarihi + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_finish_date' >" + data.bitis_tarihi + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_assign_person' >" + data.gorev_veren_username + "</td>" +
                        "<td class='align-middle'  onclick=getDataFromIdSearch(" + data.id + ") id='t_taking_person' >" + data.gorev_alan_username + "</td>" +

                        "<td class='table-action' id='islemler'>" +

                        '<button style="display:none;">' + isComplete(data.durum, data.id) + '</button>' +

                        '<button style="width: 63px;margin-right:5px;" title="Yorumlar" class="btn btn-outline-success has-status btn-color-search standard-button"  id="searchButton" onclick="getDataFromIdSearch(' + data.id + ')"><i class="fas fa-search" style="padding-right:1px;"> </i>' + data.yorum_sayisi + '</button>' +

                        '<button title="Log" style="margin-right:5px;" class="btn btn-outline-success standard-button btn-color-info" data-toggle="modal" data-target="#logmodalwindow" id="logButton" onclick="getLogDatas(' + data.id + ')"> <i class="fas fa-info-circle"></i></button>' +

                        '<button title="Düzenle" style="margin-right:5px;" class="btn btn-outline-warning standard-button btn-color-edit" data-toggle="modal" data-target="#modalwindow" id="guncellebutton" onclick="getDataFromId(' + data.id + ')"> <i class="fas fa-edit"></i> </button>' +

                        '<button title="Sil" class="btn btn-outline-danger standard-button btn-color-delete" id="removebutton" onclick="taskRemove(' + data.id + ')"> <i class="fas fa-trash-alt"></i> </button>' +


                        // '<button title="Sil" class="btn btn-outline-danger standard-button btn-color-edit" id="removebutton" style="margin-left:5px !important;"><i class="fas fa-thumbtack top-icon"></i>  <i class="fas fa-sync-alt"></i>    </button>'+              



                        "</tr>";

                });
                console.log(response.data);



                $('#task-table').DataTable().destroy()
                $('#task-list').html(rows);

                setTableSearch('task-table');
                $.closeSwal();
            };

        }

    );
}
//gorev tamamla butonu
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

//var selectedStatus = 0;
function gorevStatusChanged() {
    //* atamaya göre:
    var que = $('#assigmentType').val();
    var selectedStatus = $('#stateType').val();

    if (que == 0) {
        getTaskList(selectedStatus, 'GetList', 0);
    }
    else if (que == 1) {
        getTaskList(selectedStatus, 'GetverilenTask', 0);
    }
    else if (que == 2) {
        getTaskList(selectedStatus, 'GetMyTask', 0);
    }
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

function addTask() {
    var taskId = 0;
    console.dir(taskFile);
    var topic = $('#topic').val();
    var description = tinymce.get('description').getContent({ format: "text" });;
    var priority = Number($('#priority').val());
    var status = Number($('#status').val());
    var person = Number($('#person').val());
    //var departmanTask = Number($('#departmanTask').chosen().val());
    var terminTarihi = $('#terminTarihi').val();
    var gorevTarihi = $('#gorevTarihi').val();
    var chkTakvim = document.getElementById("chkTakvim").checked;
    console.log(gorevTarihi);
    var _data = {
        "is_takvim": chkTakvim,
        "gorev_veren": 1,
        "gorev_alan": person,
        "baslik": topic,
        "icerik": description,
        "aciliyet": priority,
        "durum": status,
        "baslangic_tarihi": gorevTarihi,
        "bitis_tarihi": terminTarihi

    };
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev/add',
        _data,
        function (response) {
            if (response.status) {
                if (taskFile == null) {
                    setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);

                    $('#modalwindow').modal('hide');
                    gorevStatusChanged();
                }
                else {
                    var gorevId = Number($('#id').val());
                    var comment = $('#enterComment').val();
                    var formData = new FormData();
                    formData.append('Image', taskFile, taskFile.name);
                    console.dir(formData);
                    formData.append('gorev_id', response.data.id);
                    formData.append('aciklama', "Görev Fotoğrafı");
                    $.showSwal("Yükleniyor");
                    $.uploadFile(
                        'POST',
                        'GorevFile/File',
                        formData,
                        function (response) {
                            if (response.status) {
                                setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);

                                $('#modalwindow').modal('hide');
                                gorevStatusChanged();
                                $.closeSwal();
                            }
                        }
                    );

                }
            }
        }
    );



}
function updateTask() {
    var id = Number($('#id').val());
    var topic = $('#topic').val();
    var description = tinymce.get('description').getContent({ format: "text" });;
    var priority = Number($('#priority').val());
    var status = Number($('#status').val());
    var person = Number($('#person').val());
    var terminTarihi = $('#terminTarihi').val();
    var gorevTarihi = $('#gorevTarihi').val();
    var chkTakvim = document.getElementById("chkTakvim").checked;
    var _data = {
        "is_takvim": chkTakvim,
        "id": id,
        "gorev_alan": person,
        "baslik": topic,
        "icerik": description,
        "aciliyet": priority,
        "durum": status,
        "baslangic_tarihi": gorevTarihi,
        "bitis_tarihi": terminTarihi

    };
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Gorev/update',
        _data,
        function (response) {
            if (response.status) {
                setTimeout(function () { Swal.fire("Başarılı", "Düzenleme İşlemi Başarılı", "success"); }, 868);

                $('#modalwindow').modal('hide');
                gorevStatusChanged();
                $.closeSwal();
            };
        }
    );
}


function updateKategori() {

    var parent = Number($('#ustKategori').val());
    var kategoriAdi = $('#kategoriAdi').val();
    var tip = $('#tip').val();
    var id = Number($('#id').val());
    var isAktif = document.getElementById("isAktif").checked;
    _data = {
        "id": id,
        "is_aktif": isAktif,
        "parent": parent,
        "tip": tip,
        "kategori_name": kategoriAdi
    }
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Kategori/update',
        _data,
        function (response) {
            if (response.status) {
                setTimeout(function () { Swal.fire("Başarılı", "Düzenleme İşlemi Başarılı", "success"); }, 868);

                $('#modalwindow').modal('hide');
                getkategoriList();
                $.closeSwal();
            };
        }
    );

}

