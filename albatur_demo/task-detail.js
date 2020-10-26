$(document).ready(function () {

    $('#myFile').change(function () {
        file = $('#myFile').prop('files')[0];
        console.dir(file);
    })
    //task-detail geri butonu
    $('#btnBackToTask').on('click',function(){
        //sessionStorage ta nerden gelindigi tutulmuştu get ile bunları karşılaştır
        if(sessionStorage.getItem("loc") == "task"){
            window.location.href=baseHref + "/panel/task";
        }
        if(sessionStorage.getItem("loc") == "index"){
            window.location.href=baseHref + "/panel/index";
        }       
    });
   
    var url = window.location.href;
    if (url.indexOf("=") > -1) {


        var url_id = url.substring(url.lastIndexOf('=') + 1);
        if (url != 'http://localhost:5000/task') {


            getDataFromIdSearch(url_id);


        }
    }
});

var file;

//yoruk ekle butonu
function addTaskComment() {
    var gorevId = Number($('#id').val());
    var comment = $('#enterComment').val();
    if (document.getElementById("myFile").files.length == 0) {
      
        console.log("GOREV ID===" + gorevId);
        var _data = {
            "gorev_id": gorevId,

            "yorum": comment
        };

        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'GorevYorum/add',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Yeni Yorum Eklendi", "success"); }, 868);     
                        

                    getYorum(gorevId);                  
                    $("#enterComment").val('');

                };
            }
        );
    }
    else if (document.getElementById("myFile").files.length != 0){
       
        var formData = new FormData();
        formData.append('Image', file, file.name);
        // formData.append('Image', file, file.name);
        console.dir(formData);
        console.log(file.name);        
        formData.append('Name', "Görev Yorum File");
        formData.append('gorev_id', gorevId);
        formData.append('yorum', comment);
    $.uploadFile(
        'POST',
        'GorevYorumFile/Filespec',
        formData,
        function (response) {
            if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Yeni Yorum Eklendi", "success"); }, 1000);     
                        
                $("#enterComment").val('');
                const file2 = document.querySelector('#myFile');
                file2.value = '';
               getYorum(gorevId);
            }
        }
    );


    }   

}
// APİ'den gelen dosyanın hangi tip olduğunu bulan fonk.
function getFilesType(filesName){
    if(filesName.indexOf(".txt")>-1 || filesName.indexOf(".docx")> -1){
        return ` <i class="fas fa-file-word" style="font-size: 32px; margin-left: -5px;"></i>`        
    }
    if(filesName.indexOf(".xls")> -1 || filesName.indexOf(".xml")> -1 || filesName.indexOf(".xlsx")> -1){
        return `<i class="fas fa-table" style="font-size: 31px; margin-left: -9px;"></i>`

    }   
    if(filesName.indexOf(".pdf")> -1 ){
        return `<i class="fas fa-file-pdf" style="font-size: 32px; margin-left: -5px;"></i>`

    }    
    if(filesName.indexOf(".jpeg")> -1 || filesName.indexOf("png")>-1){
        return `<i class="far fa-file-image" style="font-size: 32px; margin-left: -5px;"></i>`

    }
    else{
        return `<i class="far fa-file" style="font-size: 32px; margin-left: -5px;"></i>`
        
    }
}

function getDataFromIdSearch(id) {
    // getDataFromId(id); idler değişmeli
    getPersons('detail');
    $.showSwal("Yükleniyor");
    var _gorevData = {
        "criteria_": "AND g.id=" + id
    }
    $.getData(
        'POST',
        'Gorev/Getlist',
        _gorevData,
        function (response) {
            if (response.status) {

                $('#detailAssaigned').val(response.data[0].gorev_alan_username);
                $('#detailtaskOwner').html(response.data[0].gorev_veren_username);
                $('#detailtaskDate').html(response.data[0].bitis_tarihi);
                $('#detailcreatedDate').html(response.data[0].baslangic_tarihi);
                $('#detailtopic').val(response.data[0].baslik);
                $('#detailpriority').val(response.data[0].aciliyet);
                $('#detailstatus').val(response.data[0].durum);
                $('#detailperson').val(response.data[0].gorev_alan_id);
                $('#detailgorev_veren').val(response.data[0].gorev_veren_id);
                document.getElementById("chkTakvim").checked = response.data[0].is_takvim;
                //document.getElementById('detaildescription').value = response.data[0].icerik;
                $('#detaildescription').text(response.data[0].icerik);
                $.getFormattedDate(response.data[0].bitis_tarihi, function (formatlanmis) {
                    console.log(formatlanmis);
                    $('#detailterminTarihi').val(formatlanmis);
                });
                $.getFormattedDate(response.data[0].baslangic_tarihi, function (formatlanmis) {
                    console.log(formatlanmis);
                    $('#detailgorevTarihi').val(formatlanmis);
                });



                $('#id').val(response.data[0].id);
                $.closeSwal();
            };
            getYorum(id);

        }
    );
 

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

//id 'ye göre yorumları getiren fonk.
function getYorum(id_){
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'GorevYorum/Getlist?criteria=AND gy.gorev_id=' + id_,
        {},
        function (response) {
            if (response.status) {
                var str = "";
                $('#comments').html("");
                response.data.forEach(function (data) {

                    var btn = "";
                    if (data.file != null) {
                        btn =  `<a class="btn btn-outline-info" style="height: 50px;border-radius: 13px; width: 45px; box-shadow:0 0 0 1px #e4ebf3 inset;" target="blank" href="${data.file}"> ${getFilesType(data.file)}  </a>`;

                    }
                    str += `
                    <div class="chat-message-left mb-4"><div>                    
                    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" style="height:60px;" alt="sunil"> </div>
                    <div class="text-muted small text-nowrap mt-2" > ${formatDate(data.eklenme_zaman)} </div></div>
                    <div class="flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3" style="width:100%";> 
                    <div class="font-weight-semibold mb-1"> ${data.person_user_name}</div> ${data.yorum}</div>
                    ${btn} </button></div> 
                    `
                });
                $('#comments').html(str);
                $.closeSwal();
            };

        }
    );

}




//var selectedStatus = 0;
function getPersons(str) {
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/Getlist',
        {},
        function (response) {
            $("#" + str + "person").html('');
            if (response.status) {
                var rows = "";
                response.data.forEach(function (person) {
                    rows += '<option value="' + person.id + '">' + person.ad_soyad + '</option>';
                });
                $("#" + str + "person").html(rows);
                $.closeSwal();
            };

        }
    );
}


