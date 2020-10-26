$(document).ready(function () {
    personDataControl();
    $("#btnMesaj").on('click',function(){
        $('#smsModalWindow').css('display', "block");
    });
    $("#btnMail").on('click',function(){
        $('#mailModalWindow').css('display', "block");
    });

    $('#myFile').change(function () {
        file = $('#myFile').prop('files')[0];
        console.dir(file);
    })
    getAll();

    $("#btnAddPerson").on('click',function(){
        personAdd();
    });
   
});
var file;
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
                        
                      
                        var adminControl=data.is_admin; 
                        myId.set("isadmin",adminControl);                  
                    $.closeSwal();
                });
                };
            
    
            }
        );
    
}

function personAdd(){
    
    email = $('#emailDuzenle').val();       
    ad_soyad = $('#adSoyadPersonDuzenle').val();
    user_name = $('#user_nameDuzenle').val();
    gsm = $('#gsmPersonDuzenle').val();
    gorev=$("input[name='kisiBirimRadioBtn']:checked").val();
    evtel=$('#evTelPersonDuzenle').val();
    kangrubu=$('#kanGrubuPersonDuzenle').val();
    departman= $('#personDepartmanDuzenle').val();
    adres=$('#adresPersonDuzenle').val();  
    personKod=$('#personKodDuzenle').val();
    sifrePerson=$('#personSifre').val();
    dogumTarihi=$('#personDogumTarihi').val();      
    is_admin=$("input[name='personYonetici']:checked").val();
        var formData = new FormData();
        formData.append('Image', file, file.name);
        // formData.append('Image', file, file.name);
        console.dir(formData);
        console.log(file.name);        
        formData.append('email',email);
        formData.append('pass', sifrePerson);
        formData.append('ad_soyad',ad_soyad);
        formData.append('user_name',user_name);
        formData.append('gsm',gsm );
        formData.append('kan_grubu',kangrubu);
        formData.append('ev_tel',evtel);
        formData.append('gorev',gorev);
        formData.append('departman',departman);
        formData.append('adres',adres);
        formData.append('person_kod',personKod);
        formData.append('dogum_tarihi',dogumTarihi);
        formData.append('is_admin',is_admin);
        console.log(formData);

    $.uploadFile(
        'POST',
        'Person/FileWadd',
        formData,
        function (response) {
            if (response.status) {
                setTimeout(function () { Swal.fire("Başarılı", "Yeni Kullanıcı Eklendi", "success"); }, 868);     
                        
                
                const file2 = document.querySelector('#myFile');
                file2.value = '';
                inputRemove();
                getAll();
            }
        }
    );
    $('#modalwindow').modal('hide');
    


}
function isAdmin(id)
{
   var isadmin=myId.get("isadmin");
   console.log(isadmin);
   if(isadmin == true){
    $('#yeniKayitBtnPerson').show();
    return `
        <button title="Log" style="margin-right:5px;" onclick="getPersonsDetail(${id})" class="btn btn-outline-search standard-button btn-color-search"> <i class="fas fas fa-folder"></i></button>
        <button title='Log' class='btn btn-outline-warning has-status btn-color-info standard-button' data-toggle='modal' data-target='#logmodalwindow' id='logButton' onclick='getLogDatas(${id})'><i title='Log' class='fas fa-info-circle'></i></button>
        <button class='btn btn-outline-warning has-status btn-color-edit standard-button' data-toggle='modal' data-target='#modalwindow' id='guncellebutton' onclick='getPersonbyId(${id})'><i title='Düzenle' class='fas fa-edit'></i></button>
        <button class='btn btn-outline-warning has-status btn-color-delete standard-button' id='removebutton' onclick='personRemove(${id});'> <i title='Sil' class='fas fa-trash-alt'></i> </button>
    `

   }
   if(isadmin != true){
    $('#yeniKayitBtnPerson').hide();
    return `
        <button title="Log" style="margin-right:5px;" onclick="getPersonsDetail(${id})" class="btn btn-outline-search standard-button btn-color-search"> <i class="fas fas fa-folder"></i></button>       
        <button class='btn btn-outline-warning has-status btn-color-delete standard-button' id='removebutton' onclick='personRemove(${id});'> <i title='Sil' class='fas fa-trash-alt'></i> </button>
    `
   }

  
   
}



var i = 1;
function getAll() {
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/Getlist',
        {},
        function (response) {
            $("#persontbody").html('');

            if (response.status) {
                var i = 1;
                var rows = "";
                response.data.forEach(function (person) {
                    rows += "<tr id='kullaniciSutun'>" +
                        "<td id='t_index' onclick=getPersonsDetail("+person.id+")>" + i + "</td>" +
                        /*"<td id='t_id'>" + person.id + "</td>" +*/
                        "<td id='t_email' onclick=getPersonsDetail("+person.id+")>" + person.email + "</td>" +
                        "<td id='t_ad_soyad'  onclick=getPersonsDetail("+person.id+")>" + person.ad_soyad + "</td>" +
                        "<td id='t_kullanıcı_adi' onclick=getPersonsDetail("+person.id+")>" + person.user_name + "</td>" +
                        "<td id='t_gsm'  onclick=getPersonsDetail("+person.id+")>" + person.gsm + "</td>" +
                        ` <td id='islemler'>  
                        ${isAdmin(person.id)}
                       
                        </td> `
                       
                        "</tr>";
                    i++;
                });
                $('#tblPerson').DataTable().destroy()
                $('#persontbody').html(rows);
                setTableSearch("tblPerson");
                $.closeSwal();
            };
        }
    );
}
function personGorev(gorev){
    if(gorev==1){
        return "Beyaz Yaka";
    }
    if(gorev==2){
        return "İşçi"
    }
}
function getPersonsDetail(id){
    $('#detayPersonModal').modal('show');
    
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/Getlist?criteria=and id='+id,
        {},
        function (response) {
            if (response.status) {
                $('#person_id').val(response.data[0].id);
                $('#adSoyadPerson').val(response.data[0].ad_soyad.toUpperCase());
                $('#emailPerson').val(response.data[0].email);
                $('#gsmPerson').val(response.data[0].gsm);
                $('#birimPerson').val(personGorev(response.data[0].gorev));
                $('#departmanPerson').val(response.data[0].departman);
                $('#user_namePerson').val(response.data[0].user_name);
                $('#evTelPerson').val(response.data[0].ev_tel);
                $('#kanGrubuPerson').val(response.data[0].kan_grubu);
                $('#yakinTelPerson').val(response.data[0].yakin_num);
                $('#yakinDerecePerson').val(response.data[0].yakinlik_derece);
                $('#adresPerson').val(response.data[0].adres);
                $('#personDogumTarih').val(response.data[0].dogum_tarihi_format);
                $('#imgPerson').attr('src',response.data[0].fotograf) ;
                
               
                $.closeSwal();
            };
        }
    );


}
function changebuttons() {

    $('#btnAddPerson').css('display', "block");
    $('#duzeltbutton').css('display', "none");
    $('#personSifreDiv').css('display','block');
}

function inputRemove() {
    $('#emailDuzenle').val('');
    $('#adSoyadPersonDuzenle').val('');
    /*$('#ekleyen_id').val(response.data[0].ekleyen_id);*/
    $('#user_nameDuzenle').val('');
    $('#gsmPersonDuzenle').val('');
    $('#birimPersonDuzenle').val('');
    $('#evTelPersonDuzenle').val('');
    $('#kanGrubuPersonDuzenle').val('');
    // $('#yakinTelPersonDuzenle').val('');
    // $('#yakinDerecePersonDuzenle').val('');
    $('#fileDiv').css('display','block');   
    $('#personSifre').val('');
    $('#personDogumTarihi').val('');
    $('#personDepartmanDuzenle').val('');
    $('#personKodDuzenle').val('');
    $('#adresPersonDuzenle').val('');
    $('#person_id').val('');
    
}

function getPersonbyId(id) { 
    $('#person_id').val(id);
    $('#fileDiv').css('display','none');
    $('#personSifreDiv').css('display','none');  
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/Getlist?criteria=AND id=' + id,
        {},
        function (response) {
            if (response.status) {
                $('#emailDuzenle').val(response.data[0].email);               
                $('#adSoyadPersonDuzenle').val(response.data[0].ad_soyad);               
                $('#user_nameDuzenle').val(response.data[0].user_name);
                $('#gsmPersonDuzenle').val(response.data[0].gsm);
                $('#personDepartmanDuzenle').val(response.data[0].departman);
                $("INPUT[name=kisiBirimRadioBtn]").val([response.data[0].gorev]);               
                $('#personKodDuzenle').val(response.data[0].person_kod);
                $('#kanGrubuPersonDuzenle').val(response.data[0].kan_grubu);
                $('#personDogumTarihi').val(response.data[0].dogum_tarihi_format);
                $('#personSifre').val(response.data[0].pass);
                $('#evTelPersonDuzenle').val(response.data[0].ev_tel);
                $('#adresPersonDuzenle').val(response.data[0].adres);
                $('#person_id').val(response.data[0].id);
                $("INPUT[name=personYonetici]").val([response.data[0].is_admin]);  
                getAll();
                $.closeSwal();
            };
        }
    );

    $('#duzeltbutton').css('display', "block");
    $('#btnAddPerson').css('display', "none");
}

function getLogDatas(id) {
    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'personlog/Getlist?criteria=and pl.person_id=' + id,
        {},
        function (response) {
            if (response.status) {
                var str = "";
                response.data.forEach(function (data) {
                    str += " <tr>" +
                        "<td class='align-middle' id='t_url'>" + data.islem + "</td>" +
                        "<td class='align-middle' id='t_url'>" + data.tip + "</td>" +
                        "<td class='align-middle' id='t_url'>" + data.user_name + "</td>" +
                        "<td class='align-middle' id='t_url'> " + data.zaman + "</td> </tr>";
                });
                $('#gorevlog-list').html(str);
                setTableSearch('gorevlog-table');
                $.closeSwal();
            };
        }
    );
}
function update() {
    var email = $('#emailDuzenle').val();
    
    var ad_soyad = $('#adSoyadPersonDuzenle').val();
    var user_name = $('#user_nameDuzenle').val();
    var gsm = $('#gsmPersonDuzenle').val();
    var dogumT=$('#personDogumTarihi').val();
    var adres= $('#adresPersonDuzenle').val();
    var personKod=$('#personKodDuzenle').val();
    var personKanGrubu= $('#kanGrubuPersonDuzenle').val();
    var personDepartman= $('#personDepartmanDuzenle').val();
    var personGorev=$("input[name='kisiBirimRadioBtn']:checked").val();
    var personEvtel= $('#evTelPersonDuzenle').val();
    var is_admin=$("input[name='personYonetici']:checked").val();
   
    /*var ekleyen_id = Number($('#ekleyen_id').val());*/
    var id = Number($('#person_id').val());


    var _data = {
        "id": id,
        "email": email,       
        "ad_soyad": ad_soyad,
        "user_name": user_name,
        "is_admin": is_admin,
        "dogum_tarihi":dogumT,
        "gsm": gsm,
        "adres":adres,
        "person_kod":personKod,
        "kan_grubu":personKanGrubu,
        "departman":personDepartman,
        "gorev":personGorev,
        "ev_tel":personEvtel
    };

    $.showSwal("Yükleniyor");
    $.getData(
        'POST',
        'Person/update',
        _data,
        function (response) {
            if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Düzenleme İşlemi Başarılı", "success"); }, 868);     
                        
                $('#modalwindow').modal('hide');
                getAll();
                $.closeSwal();
            };
        }
    );
}



function personRemove(id) {

    var ans = prompt("Lütfen silme nedeninizi girin:", "");
    if (ans == null || ans == "") {
        /*txt = "İptal edildi";
        alert(txt);*/
                        setTimeout(function () { Swal.fire("Başarısız", "Silme nedeni boş geçilemez!", "error"); }, 868);     
                        
    }
    else {
        var _data = { "id": id, "silinme_aciklama": ans, "silen_id": 2 };

        $.showSwal("Yükleniyor");
        $.getData(
            'POST',
            'Person/delete',
            _data,
            function (response) {
                if (response.status) {
                        setTimeout(function () { Swal.fire("Başarılı", "Silme İşlemi Başarılı", "success"); }, 868);     
                        
                    $('#modalwindow').modal('hide');
                    getAll();
                    $.closeSwal();
                };
            }
        );
    }
}

function sendSms(){
    var smsContent = $('#smsContent').val();
    var id= Number($('#person_id').val());
    var form = new FormData();
    form.append("mesaj", smsContent);
    form.append("id", id);
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'Sms/Send',
        form,
        function (response) {
            $.closeSwal(); 
            if (response.status) {
                Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success");   
                $('#smsModalWindow').modal('hide');
                $('#detayPersonModal').modal('hide');
            };
        }
    );
    $('#smsContent').val('');
}

function sendMail(){
    var mailTitle = $('#mailTitle').val();
    var mailContent = $('#mailContent').val();
    var id= Number($('#person_id').val());
    var form = new FormData();
    form.append("baslik", mailTitle);
    form.append("text", mailContent);
    form.append("id", id);
    $.showSwal("Yükleniyor");
    $.uploadFile(
        'POST',
        'Mail/Send',
        form,
        function (response) {
            $.closeSwal(); 
            if (response.status) {
                Swal.fire("Başarılı", "Yeni Kayıt İşlemi Başarılı", "success");   
                $('#mailModalWindow').modal('hide');
                $('#detayPersonModal').modal('hide');
            };
        }
    );
    $('#mailTitle').val('');
    $('#mailContent').val('');
}
