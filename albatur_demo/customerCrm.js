$(document).ready(function () {
    getCustomerList("",5,"");
    
   
   
    $('#myFile').change(function () {
        file = $('#myFile').prop('files')[0];
        console.dir(file);
    });
    isAdmin();
    
});



var file;
function openUploadModal(id) {
    $('#customerId').val(id);
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'CustomerFiles/Getlist?criteria=AND customer_id=' + id,
        {},
        function (response) {
            if (response.status) {
                var rows = "";
                response.data.forEach(function (data) {

                    rows += " <tr><td class='align-middle' id='t_aciklama'>" + data.aciklama + "</td>" +
                        "<td class='align-middle' id='t_url'><a target='_blank' href='" + baseHref + data.url + "'> " + baseHref + data.url + "</a> </td>" +
                        "<td class='table-action' id='islemler'>" + "  <button title='Sil' class='btn btn-outline-danger' id='removebutton' onclick='fileRemove(" + data.id + ");'> <i class='fas fa-trash-alt'></i> </button>  </td> </tr>";
                });
                $('#file-list').html(rows);
                setTableSearch("file-table");
                $.closeSwal();
            }

        }
    );

}

function isAdmin(){
var myToken= localStorage.getItem('token');
    $.getData(
        'POST',
        'Person/GetbyId',
        {},
        function (response) {
            if (response.status) {
                response.data.forEach(function (data) {
                    if(data.token==myToken){
                        if(data.is_admin!=true){
                            $('#isAdmin').css('display','none');
                        }
                    }
                });
            }

        }
    );
}

function fileRemove(id) {
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
                        setTimeout(function () { Swal.fire("Başarısız", "Sİlme Nedeni Girilmeli!","error"); }, 868);
                        
    }
    else {
        var _data = { "id": id, "silinme_aciklama": cause, "silen_id": 2 };
    $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'CustomerFiles/delete',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı", "success"); }, 868);
                        
                    location.reload();
                    $.closeSwal();
                }
            }
        );



    }
}
function uploadFile() {

    var detail = $('#detail').val();
    var customerId = $('#customerId').val();

    var formData = new FormData();
    formData.append('Image', file, file.name);
    formData.append('aciklama', detail);
    formData.append('customer_id', customerId);
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'CustomerFiles/File',
        formData,
        function (response) {
            if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);
                        
                $('#uploadModal').modal('hide');
                $.closeSwal();

            }
        }
    );

}
function searchFilterFirma(){
        $('#emptySearch').show();
        var firma_adi=$("#selectFirma").val(); 
        getCustomerList(0,4,firma_adi);
        console.log(firma_adi);
        $('#emptySearch').on('click',function(){
            getCustomerList(0,1,"");
            $('#emptySearch').hide();
            $("#selectFirma").val("");
            $('#selectDate').val(1);
        });

  

}
function getCustomerList(que,aralik_date,firmaAdi) {
    var _data={
        "firma_adi":firmaAdi,
        "aralik":aralik_date
    }
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'CustomerCrm/Getlistlike' ,
        _data,
        function (response) {
            $('#customer_list').html('');
            if (response.status) {

                console.dir(response);
                var i = 0;
                var rows="";
                response.data.forEach(function (customer) {

                    var tip="";
                    if(customer.gorusme_tipi==1)
                    {
                        tip="Mesaj";
                    }
                    else if(customer.gorusme_tipi==2)
                    {
                        tip="Email";
                    }
                    else if(customer.gorusme_tipi==3)
                    {
                        tip="Telefon";
                    }
                    else if(customer.gorusme_tipi==4)
                    {
                        tip="Görüşme";
                    }
                    i++;
                     rows += "<tr>" +

                        "<td class='align-middle' id='t_id'>" + i + "</td>" +
                        "<td class='align-middle' id='t_email'>" + customer.user_name + "</td>" +
                        "<td class='align-middle' id='t_firma_adi'>" + customer.firma_adi + "</td>" +
                        "<td  class='align-middle' id='t_yetkili_Adi'>" + customer.yetkili_adi + "</td>" +
                        "<td class='align-middle' id='t_gsm'>" + tip + "</td>" +
                        "<td class='align-middle' id='t_tipAdi' title='"+customer.mesaj+"'>"+customer.mesaj.substring(0,18)+" </td>" +
                        "<td class='table-action' id='islemler'>" + "  <button title='Görüntüle' class='btn btn-outline-warning btn-color-edit standard-button' data-toggle='modal' data-target='#chatModal' id='guncellebutton' onclick='setCrmDatas(" + customer.id + ")'> <i class='fas fa-eye'></i>  </button>   <button title='Sil' class='btn btn-outline-warning btn-color-delete standard-button' id='removebutton' onclick='customerCrmRemove(" + customer.id + ");'> <i class='fas fa-trash-alt'></i> </button>   </td>" + "</tr>";

                });
                $('#report-table').DataTable().destroy()
                $('#customer_list').html(rows);
                setTableSearch("report-table"); 
                $.closeSwal();
            }
        }
    );
}

function customerCrmRemove(id) {
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
                        setTimeout(function () { Swal.fire("Başarısız", "Silme Nedeni Girilmeli!","error"); }, 868);
                        
    }
    else {
        var _data = { "id": id, "silinme_aciklama": cause, "silen_id": 2 };
    $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'CustomerCrm/delete',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı","success"); }, 868);
                        
                    getCustomerList('');
                    $.closeSwal();
                }

            }
        );
    }
}

function customerMsgRemove(customerChatMsgId) {
    var cause = prompt("Silme Nedeni Gir:");
    if (cause == null || cause == "") {
                        setTimeout(function () { Swal.fire("Başarısız", "Sİlme Nedeni Girilmeli!","error"); }, 868);
                        
    }
    else {
        var _data = { "id": customerChatMsgId, "silen_id": 1 };
    $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'CustomerCrm/delete',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı","success"); }, 868);
                        
                    $.closeSwal();
                    location.reload();
                }
            });
    }
}

function setCrmDatas(customerCrmId) {  
    $('#customerMailDiv').hide();
    $('#customerKodDiv').hide();
    $('#customerSearchLike').hide();
    $("#searchCustomerTable").hide();    
    $("#customerUlke").hide();    
    $("#customerSehir").hide();    
    $('#btnUpdateCustomerMail').css("display", "none");
    $('#btnAddCustomerMail').css("display", "none");
    //$('#selectMeetingType').html(' <option disabled value="1">Mesaj</option> <option disabled value="2">Email</option>   <option value="3">Telefon</option>   <option value="4">Görüşme</option>');
    // var searchCriter = "?criteria=andcc.id=" + Number(customerCrmId);
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'CustomerCrm/Getlist?criteria=and cc.id='+Number(customerCrmId),
        {},
        function (response) {
            if (response.status) {
                 console.log(response.data[0]);
                 $('#customerCrmId').val(customerCrmId);
                $("#firmaName").val(response.data[0].firma_adi);
                $("#yetkiliName").val(response.data[0].yetkili_adi);               
               tinymce.get("sendMessageContent").setContent(response.data[0].mesaj);;              
               // $('#selectMeetingType').val(response.data[0].gorusme_tipi);
               $('input[name=meetingTypeCheck]:checked', '#meetingType').val(response.data[0].gorusme_tipi);
                var val= formatDate(response.data[0].gorusme_zaman);
                $('#gorusmeTarihi').val(val);
                document.getElementById("chkOzel").checked = response.data[0].is_bana_ozel;
                $.closeSwal();
            }
        }
    );


}

// function customerMsgEdit() {
//     var customerCrmId = Number($('#customerCrmId').val());    
//     var msg = $('#sendMessageContent').val();
//     var type = Number($('#selectMeetingType').val());
//     var dt = $('#gorusmeTarihi').val();
//     var isOzel = document.getElementById("chkOzel").checked;
//     console.log(isOzel);


//     var _data = {
//         "id": customerCrmId,
//         "customer_id": customerId,
//         "mesaj": msg,
//         "is_bana_ozel": isOzel,
//         "ekleyen_id": 1,
//         "gorusme_tipi": type,
//         "gorusme_zaman": dt
//     };

//     $.getData(
//         'POST',
//         'CustomerCrm/update',
//         _data,
//         function (response) {
//             if (response.status) {

//                 Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success");
//                 $('#chatModal').modal('hide');
//                 getCustomerList("");
//             }


//         }
//     );
// }

function newSave()
{
    getCustomers();
    $('#btnUpdateCustomerMail').css("display", "none");
    $('#btnAddCustomerMail').css("display", "block");
    $('#postform')[0].reset();
    //$('#selectMeetingType').html(' <option value="3">Telefon</option>   <option value="4">Görüşme</option>');
    $('#customerMailDiv').show();
    $('#customerKodDiv').show();
    $('#customerSearchLike').show();
    $("#customerUlke").show();    
    $("#customerSehir").show(); 

    
}

function getCustomers() {
    $("#searchCustomerTable").hide();
   
    $("#customerSearchLike").on('click',function(){
        $("#searchCustomerTable").show();
        var firma_adi=$("#firmaName").val().toLocaleUpperCase('tr-TR');       
        var yetkili_adi=$("#yetkiliName").val().toLocaleUpperCase('tr-TR');
        var mail=$("#musteriMail").val();
        var musteriKod=$("#musteriKod").val().toLocaleUpperCase('tr-TR');
        var sehir=$('#musteriSehir').val().toLocaleUpperCase('tr-TR');
        var ulke=$('#musteriUlke').val().toLocaleUpperCase('tr-TR');

        var _data={
            "yetkili_adi":yetkili_adi,
            "firma_adi":firma_adi,
            "email":mail,
            "customer_code":musteriKod,
            "sehir":sehir,
            "ulke":ulke
        }  
    $.showSwal("Yükleniyor");       
        $.getData(
            'POST',
            'Customer/Getlistlike',
             _data,
            function (response) {
                //console.log(response);
                var str = ""               
                $("#searchCriterCustomer").html("");               
                if (response.status) {
                    response.data.forEach(function (customer,index) {
                        // str += '<option  data-tokens="'+customer.firma_adi+'" value="' + customer.id + '">' + customer.firma_adi + '</option>';
                        str += `
                        <tr>
                        <th scope="row">${index+1}</th>
                        <td scope="row"> <input type="radio" id="radio${index}" name="customRadio" onchange="customerCrmSelectRadio();" value="${customer.id}"></td>                      
                        <td scope="col">${customer.firma_adi}</td>
                        <td scope="col">${customer.yetkili_adi}</td>
                        <td scope="col">${customer.gsm}</td>
                        <td scope="col">${customer.email}</td>                                              
                        <td scope="col">${customer.sehir}</td>
                        <td scope="col">${customer.ulke}</td>                       
                        <td scope="col">${customer.adres}</td>              
                        <td scope="col">${customer.customer_code}</td>
                      </tr>
                        `
                    });                   
                    $("#searchCriterCustomer").html(str);          
                    $.closeSwal();       
                }
            }
        );
        
    });
    
}


//arama sonucunda seçilen radio butonun id sini al
var customerId;

function customerCrmSelectRadio(){
    var selectDurum = $("input[name=customRadio]:checked").val();
    console.log(selectDurum);
    customerId= Number(selectDurum);
   

   //kaydet butonuna tıklandığında....
    $("#btnAddCustomerMail").on('click',function(){
        
        function displayRadioValue() {
            var ele = document.getElementsByName('meetingTypeCheck');
    
            for (i = 0; i < ele.length; i++) {
                if (ele[i].checked)
                type = Number(ele[i].value);
            }
        }
       
        
       
       

        displayRadioValue();
        console.log(type);
       
        var msg = tinymce.get("sendMessageContent").getContent({ format: "text" });;
        //var type = Number($('#selectMeetingType').val());
        var dt = $('#gorusmeTarihi').val();
        var isOzel = document.getElementById("chkOzel").checked;
    //     console.log(isOzel);
    //    console.log(msg);
    //    console.log(customerId);
    
        var _data = {
            "customer_id": customerId ,
            "mesaj": msg,
            "is_bana_ozel": isOzel,
            "ekleyen_id": 1,
            "gorusme_tipi": type,
            "gorusme_zaman": dt
        };
    $.showSwal("Yükleniyor");   

        $.getData(
            'POST',
            'CustomerCrm/add',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success"); }, 868);
                        
                    $('#chatModal').modal('hide');
                    $('#sendMessageContent').val("");
                    document.getElementById('selectCustomerType').value=5;
                    customerTypeChanged();
                    $.closeSwal();
                }

            });

    });
}
   



function customerTypeChanged() {

    var param = document.getElementById('selectCustomerType').value;
    var selectdate=Number($('#selectDate').val());
    
    var searchCriter = "";

    if (param == 0) {
        searchCriter = "";
    }
    else {
        searchCriter = "?criteria=AND customer_type_id=" + param;
    }
    getCustomerList(searchCriter,selectdate);

}

